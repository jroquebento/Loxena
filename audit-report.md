# 🛡️ Relatório de Auditoria Arquitetural - Loxena WMS

## Escopo e conclusão executiva

Auditoria estática do estado atual da solução: `Loxena.Api`, `Loxena.Application`, `Loxena.Domain`, `Loxena.Infrastructure` e `tests/UnitTests`. O workspace está em .NET 10; as migrations e o snapshot consultados são do provider SQL Server. Não foram alterados arquivos de implementação nem executados testes ou validações contra um banco real.

**Conclusão:** o módulo de estoque já tem proteções importantes no banco: `RowVersion`, constraints para quantidades e reservas, índice único por par produto/localização e índice único filtrado por localização quando `PhysicalQuantity > 0`. Isso impede várias formas de corrupção concorrente do estoque, desde que as migrations estejam aplicadas. Os principais riscos restantes são regras de atividade verificadas fora da gravação atômica, tratamento inadequado de conflitos esperados, ausência de concorrência otimista em Produto, e discrepâncias entre domínio e precisão decimal persistida.

## 🚨 Severidade Crítica (Risco de corrupção de dados ou quebra de negócio)

### 1. A inativação concorrente de Produto/Localização pode intercalar com AddStock

**Arquivos/classes:** `backend/Loxena.Application/Stocks/AddStock/AddStockUseCase.cs`; `backend/Loxena.Application/Products/InactivateProduct/InactivateProductUseCase.cs`; `backend/Loxena.Domain/Entities/Stock.cs`.

`AddStockUseCase` valida `IsActive`, mas essa leitura e o `SaveChangesAsync` ocorrem em operações separadas. `RowVersion` protege a linha de `Stock`, não as linhas de `Product` ou `Location`. Uma requisição pode ler Produto ativo; outra inativá-lo e confirmar; a primeira então inserir estoque. O caminho sequencial rejeita Produto inativo corretamente, mas a validação não é atômica com a gravação. O mesmo padrão vale para `Location`; no código atual não foi encontrado fluxo de inativação normal de localização, embora a entidade tenha `IsActive`.

**Correção mínima:** fazer a validação de atividade e a gravação de estoque sob uma fronteira transacional com isolamento/locking apropriado no SQL Server, incluindo também a checagem de ocupação; manter o índice filtrado como última barreira de integridade. Encapsular a operação na Infrastructure evita injetar `DbContext` na Application. Exemplo ilustrativo do trecho de persistência:

```csharp
await using var tx = await _context.Database.BeginTransactionAsync(
	IsolationLevel.Serializable, cancellationToken);

var productIsActive = await _context.Products.AnyAsync(
	p => p.Id == productId && p.IsActive, cancellationToken);
var locationIsActive = await _context.Locations.AnyAsync(
	l => l.Id == locationId && l.IsActive, cancellationToken);

if (!productIsActive || !locationIsActive)
	throw new InvalidOperationException("Produto ou localização inativo.");

// Validar ocupação, carregar/criar o Stock e salvar dentro desta mesma transação.
await _context.SaveChangesAsync(cancellationToken);
await tx.CommitAsync(cancellationToken);
```

O isolamento deve ser validado com o provider e índices reais; não substituir o índice filtrado por uma checagem somente em C#.

### 2. Categoria inativa pode receber Produtos

**Arquivos/classes:** `backend/Loxena.Application/Products/CreateProduct/CreateProductUseCase.cs`; `backend/Loxena.Application/Products/UpdateProduct/UpdateProductUseCase.cs`.

Ambos os casos de uso verificam apenas se a categoria existe. Como `GetByIdAsync` também retorna categorias inativas, é possível criar ou mover um Produto para categoria inativa sem concorrência alguma. Isso contorna a política de inativação e deixa a validação de `InactivateCategoryUseCase` dependente de verificações inconsistentes.

**Correção mínima:** rejeitar categoria inexistente **ou inativa** nos dois casos de uso:

```csharp
if (category is null || !category.IsActive)
	throw new InvalidOperationException("Categoria inexistente ou inativa.");
```

Se criação de produto e inativação de categoria puderem ocorrer simultaneamente, aplicar também uma regra transacional/concorrente no fluxo de gravação. A verificação no caso de uso, sozinha, não serializa operações concorrentes.

## ⚠️ Severidade Alta (Falhas arquiteturais graves ou gargalos de performance)

### 3. Conflitos de concorrência e constraints viram erro HTTP 500

**Arquivos/classes:** `backend/Loxena.Infrastructure/Repositories/StockRepository.cs`; `backend/Loxena.Api/ExceptionHandlers/GlobalExceptionHandler.cs`.

O `RowVersion` e os índices únicos fazem o banco rejeitar atualizações desatualizadas ou inserções conflitantes, preservando os dados. Porém, o handler só mapeia `ArgumentException` e `InvalidOperationException`; `DbUpdateConcurrencyException` e conflitos de índice chegam ao caso genérico e viram `500`. Esses conflitos são resultados esperados de concorrência e deveriam ser comunicados como conflito, não falha interna.

**Correção mínima:** traduzir falhas de persistência esperadas para uma exceção de conflito da Application e mapeá-la como `409 Conflict`, mantendo detalhes internos fora da resposta:

```csharp
catch (DbUpdateConcurrencyException ex)
{
	throw new ConcurrencyConflictException(
		"O estoque foi alterado por outra operação. Recarregue e tente novamente.", ex);
}
```

O handler deve mapear `ConcurrencyConflictException` para 409. Violações dos índices SQL Server (2601/2627) também podem ser traduzidas na Infrastructure para conflito de localização/duplicidade. Não expor `SqlException` nem mensagem do provider pela API.

### 4. Atualizações simultâneas de Produto usam last-write-wins

**Arquivos/classes:** `backend/Loxena.Domain/Entities/Product.cs`; `backend/Loxena.Infrastructure/Data/LoxenaDbContext.cs`; `backend/Loxena.Infrastructure/Repositories/ProductRepository.cs`.

Somente `Stock` tem token de concorrência. `ProductRepository.UpdateAsync` grava entidade rastreada sem versão; dois usuários podem editar o mesmo Produto e a última gravação sobrescrever campos alterados pela primeira sem aviso.

**Correção mínima:** configurar concorrência otimista para Product. Se não se quiser introduzir conceito SQL Server na entidade de domínio, usar propriedade sombra no mapping e criar migration:

```csharp
modelBuilder.Entity<Product>()
	.Property<byte[]>("RowVersion")
	.IsRowVersion();
```

Mapear o conflito para 409 como no caso de estoque. Aplicar o mesmo tratamento a Category/Location somente se atualizações concorrentes nessas entidades forem relevantes ao uso esperado.

### 5. Entidade de domínio `Stock` contém detalhe específico de persistência

**Arquivo/classe:** `backend/Loxena.Domain/Entities/Stock.cs` — `byte[] RowVersion`.

O projeto Domain não referencia EF Core ou ASP.NET e os demais campos são independentes de framework, mas a propriedade chamada `RowVersion` representa diretamente o token do SQL Server/EF e expõe infraestrutura no modelo de domínio. Isso acopla a entidade a uma estratégia específica do provider, embora não haja pacote EF no projeto Domain.

**Correção simples:** mover o token para propriedade sombra no mapping, como no exemplo do item anterior. Se a versão precisar fazer parte do contrato de negócio/API, use um conceito neutro de versão em vez do nome/provider específico `RowVersion`.

### 6. Precisão e faixa de `Product.Price` não correspondem totalmente ao domínio

**Arquivos/classes:** `backend/Loxena.Domain/Entities/Product.cs`; `backend/Loxena.Infrastructure/Data/LoxenaDbContext.cs`.

A entidade aceita qualquer `decimal >= 0`, mas o banco persiste `decimal(18,2)`. Um valor com mais de duas casas pode ser arredondado pelo banco e a resposta da criação pode refletir o valor em memória, diferente de uma leitura posterior. Valores acima da faixa de `decimal(18,2)` podem falhar somente ao persistir, resultando em erro não tratado como entrada inválida.

**Correção mínima:** definir escala e faixa como regra explícita do domínio; rejeitar precisão excedente ou normalizá-la de forma consistente antes de retornar/persistir:

```csharp
if (price < 0m || price > 9_999_999_999_999_999.99m)
	throw new ArgumentOutOfRangeException(nameof(price));

if (decimal.Round(price, 2) != price)
	throw new ArgumentException("O preço aceita no máximo duas casas decimais.", nameof(price));
```

A faixa deve corresponder à política financeira do produto; a amostra representa a capacidade máxima de `decimal(18,2)` (16 dígitos inteiros e 2 decimais), não uma recomendação de preço comercial.

### 7. Leitura de listas carrega entidades rastreadas e sem paginação

**Arquivos/classes:** `backend/Loxena.Infrastructure/Repositories/*Repository.cs`, métodos `GetAllAsync`/`GetByProductIdAsync`.

Consultas de leitura materializam entidades com tracking (`ToListAsync`/`FirstOrDefaultAsync` sem `AsNoTracking`). Os casos `Get*` apenas mapeiam respostas, portanto o change tracker adiciona alocação e trabalho sem benefício. As listas também são ilimitadas; em crescimento, `GetAll` pode consumir memória e produzir respostas grandes.

**Correção mínima:** usar consultas sem tracking nos caminhos dedicados a leitura e adicionar paginação quando o volume exigir. Não marcar cegamente `GetByIdAsync` como no-tracking: ele também alimenta casos de uso de atualização.

```csharp
return await _context.Products
	.AsNoTracking()
	.Where(p => p.IsActive)
	.OrderBy(p => p.Name)
	.Take(pageSize)
	.ToListAsync(cancellationToken);
```

## 🟡 Severidade Média (Débitos técnicos e más práticas)

### 8. Unicidade de nome/código depende de checagem anterior à gravação

**Arquivos/classes:** `backend/Loxena.Infrastructure/Repositories/CategoryRepository.cs`; `backend/Loxena.Infrastructure/Repositories/LocationRepository.cs`; `LoxenaDbContext`.

`ExistsByNameAsync` e `ExistsByCodeAsync` rodam antes do insert/update. Duas chamadas concorrentes podem verificar “não existe” e inserir duplicatas. Não há índice único correspondente no modelo ou snapshot. As consultas também aplicam `ToLower()`/`ToUpper()` à coluna, o que pode impedir uso eficiente de índice; comportamento de case sensitivity depende da collation.

**Correção mínima:** persistir uma forma normalizada e impor unicidade compatível com a regra (incluindo se a unicidade vale só para ativos). Exemplo, se nome/código são únicos para todos os registros:

```csharp
modelBuilder.Entity<Category>().HasIndex(c => c.Name).IsUnique();
modelBuilder.Entity<Location>().HasIndex(l => l.Code).IsUnique();
```

Se unicidade for apenas entre ativos, usar índices filtrados equivalentes e tratar o conflito do banco como 409. Confirmar collation/normalização antes de escolher a expressão.

### 9. Exclusão física de Category está configurada em cascata

**Arquivo/classe:** `backend/Loxena.Infrastructure/Data/LoxenaDbContext.cs`; confirmado em `Migrations/LoxenaDbContextModelSnapshot.cs`.

A FK `Product.CategoryId` tem `DeleteBehavior.Cascade` no snapshot. O endpoint observado inativa a categoria e não apaga fisicamente, então não há um caminho HTTP atual que dispare cascata. Ainda assim, exclusão física via manutenção, script ou novo endpoint poderia apagar Produtos vinculados sem uma decisão explícita.

**Correção mínima:** se a política for preservar histórico, configurar restrição e criar migration:

```csharp
entity.HasOne<Category>()
	.WithMany()
	.HasForeignKey(p => p.CategoryId)
	.IsRequired()
	.OnDelete(DeleteBehavior.Restrict);
```

### 10. Ciclo de vida de Location não oferece inativação

**Arquivos/classes:** `backend/Loxena.Domain/Entities/Location.cs`; `backend/Loxena.Api/Controllers/LocationsController.cs`.

A entidade e tabela têm `IsActive`; `AddStock` consulta esse valor, mas não há método de inativação, caso de uso ou endpoint de Location nos arquivos auditados. Portanto, o sistema não define nem executa a regra sobre o que fazer com estoque ao desativar prateleira. Não foi encontrada uma falha de fluxo existente, mas o estado é incompleto/inacessível pela API normal.

**Correção mínima, se inativação fizer parte do MVP:** definir a política e impedir inativar localização com saldo físico positivo:

```csharp
if (await stockRepository.HasPhysicalStockAtLocationAsync(id))
	throw new InvalidOperationException("Esvazie a localização antes de inativá-la.");

location.Inactivate();
await locationRepository.UpdateAsync(location);
```

Se localização nunca deve ser inativada, remover `IsActive` e as verificações associadas para não manter estado sem transição suportada.

### 11. Handler expõe mensagem de exceção e classifica todo estado inválido como 400

**Arquivo/classe:** `backend/Loxena.Api/ExceptionHandlers/GlobalExceptionHandler.cs`.

`Detail = exception.Message` é aplicado inclusive a erros inesperados; mensagens de driver/banco podem revelar detalhes internos. Também todo `InvalidOperationException` vira 400, sem distinguir conflito de estado (409) de entrada inválida (400). O log inclui a exceção e stack trace, o que é útil internamente, mas não justifica expor a mensagem ao cliente.

**Correção mínima:** retornar detalhe genérico para 500 e mapear exceções de domínio/conflito por tipos semânticos:

```csharp
var detail = statusCode == StatusCodes.Status500InternalServerError
	? "Ocorreu um erro interno."
	: exception.Message;
```

Preferir exceções específicas da aplicação para validação e conflito em vez de inferir semântica a partir de `InvalidOperationException`.

### 12. Inativação de Produto mantém estoque e RemoveStock continua permitido

**Arquivos/classes:** `InactivateProductUseCase.cs`, `AddStockUseCase.cs`, `RemoveStockUseCase.cs`.

Inativar Produto não verifica se há saldo. Depois da inativação, `AddStock` recusa novas entradas, mas `RemoveStock` não consulta atividade e permite reduzir o saldo. Isso pode ser a política correta para liquidar estoque remanescente; o código não a documenta nem testa. Se o esperado for impedir toda movimentação de produto inativo, a remoção viola a política; se o esperado for esvaziar, o comportamento é útil.

**Correção mínima:** declarar/testar a regra. Para permitir liquidação, manter remoção e rejeitar somente adição; para bloquear qualquer movimentação, validar `IsActive` também em `RemoveStock`.

### 13. Endpoints não configuram autenticação/autorização

**Arquivos/classes:** `backend/Loxena.Api/Program.cs`; controllers.

O pipeline chama `UseAuthorization`, mas não foi encontrada configuração de autenticação nem atributos/policies `[Authorize]`. Em execução exposta fora do ambiente local, os endpoints de cadastro e movimentação ficam sem controle de identidade/autorização observado. Pode ser aceitável no MVP local, mas não é seguro assumir isso em produção.

**Correção mínima antes de expor a API:** configurar um esquema de autenticação apropriado para o ambiente e proteger os endpoints que alteram dados:

```csharp
[Authorize]
[HttpPost("add")]
public async Task<IActionResult> AddStock(AddStockRequest request) { ... }
```

Não é necessário adotar uma arquitetura adicional; habilitar autenticação somente se a API for publicada para usuários reais.

## 💡 Sugestões de Melhoria (Alinhadas ao padrão de não fazer overengineering)

### 14. Não há evidência atual de N+1

As entidades consultadas expõem IDs escalares e o modelo não configura navegações; as consultas observadas não usam `Include`. Portanto, não encontrei N+1 nas rotas revisadas. Se forem adicionadas navegações no futuro, inspecionar o SQL e projetar para Response DTO no banco antes de introduzir carregamento em lote.

### 15. A API já retorna DTOs de resposta e os controllers delegam

Os casos de uso retornam `ProductResponse`, `CategoryResponse`, `LocationResponse` e `StockResponse`; controllers chamam use cases e não serializam as entidades Domain diretamente. Essa fronteira está adequada. `Application` referencia Domain e Infrastructure referencia Application/Domain, padrão compatível com a Clean Architecture observada; não foi encontrado `using` ou referência de pacote EF Core/ASP.NET no projeto Domain.

### 16. Unit of Work não é necessário com os fluxos encontrados

Cada caso de uso observado persiste uma entidade/agregado em uma chamada a `SaveChangesAsync`; o próprio EF Core executa cada `SaveChanges` transacionalmente. Não existe fluxo atual que crie Produto e depois Estoque como parte da mesma operação. Logo, não há evidência de gravação parcial “cria Produto, falha ao criar Estoque”, nem justificativa para introduzir Unit of Work agora. A preocupação real é a validação multi-leitura de `AddStock` não ser atômica com sua gravação, tratada no item 1.

### 17. Cobertura de teste não alcança as regras centrais de WMS

Os testes fonte encontrados são de criação/atualização de Produto; não foi localizada cobertura para reservas, remoção maior que disponível, `RowVersion`, localização ocupada, inativação concorrente, conflitos únicos ou migrações. Exemplo de teste de regressão simples para a invariante:

```csharp
[Fact]
public void ReserveQuantity_WhenAmountExceedsAvailable_Throws()
{
	var stock = new Stock(productId, locationId, initialQuantity: 5);

	Assert.Throws<ArgumentException>(() => stock.ReserveQuantity(6));
}
```

Adicionar testes de integração com SQL Server (ou provider compatível com os recursos utilizados) para RowVersion, índice filtrado e check constraints; provider EF in-memory não valida fielmente esses recursos relacionais.

### 18. Respostas de criação usam `200 OK`

Os controllers retornam `Ok(...)` em `POST`. É melhoria de contrato HTTP, não falha de domínio. Quando conveniente, usar `CreatedAtAction` para comunicar criação e localização do recurso, sem alterar a injeção direta de UseCases.

## Proteções existentes confirmadas

- `Stock.RowVersion` está configurado com `.IsRowVersion()`; migration `20260930003810_AddStockRowVersion` existe.
- Check constraints impedem `PhysicalQuantity < 0`, `ReservedQuantity < 0` e `ReservedQuantity > PhysicalQuantity`; estão no `DbContext`, migration e snapshot.
- Índice único `(ProductId, LocationId)` impede duplicidade do mesmo par.
- Índice único filtrado por `LocationId` em `[PhysicalQuantity] > 0` garante no máximo um registro com saldo físico positivo por localização; esta é a proteção efetiva contra a corrida de ocupação. A migration `20260930004833_AddStockUniqueIndexes` existe.
- FKs de Stock para Product e Location usam `DeleteBehavior.Restrict`.
- Os mapeamentos de tamanho observados para nome/descrição coincidem com os limites validados pelas entidades; `Product.Price` tem precision configurada em 18,2, embora a validação de escala/faixa deva ser alinhada como descrito acima.

**Limitação importante:** existência de migration no repositório não prova que ela foi aplicada a cada banco em execução. O ambiente de deploy precisa aplicar as migrations antes de depender dessas garantias.
