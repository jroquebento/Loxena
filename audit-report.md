# Auditoria técnica — Loxena

## Escopo e critérios

Análise estática dos arquivos consultados nas camadas Domain, Application, Infrastructure e API, considerando as regras de negócio informadas: uma localização comporta um único tipo de produto enquanto houver quantidade positiva; estoque é movimentado por `AddStock`/`RemoveStock`; exceções são convertidas centralmente para `ProblemDetails`.

O relatório descreve riscos encontrados no código observado. Não foram revisadas migrations nem executados testes. O Test Explorer mostrou três testes não executados, todos relativos a casos de uso de Produto; isso não comprova que não existam outros testes fora da descoberta atual.

## Alta Gravidade

### 1. Regra de ocupação da localização não está protegida contra concorrência

**Arquivos:** `backend/Loxena.Application/Stocks/AddStock/AddStockUseCase.cs`, `backend/Loxena.Infrastructure/Repositories/StockRepository.cs`, `backend/Loxena.Infrastructure/Data/LoxenaDbContext.cs`

`AddStockUseCase` consulta `HasStockForOtherProductAsync`, depois procura o estoque do par produto/localização e, por fim, grava. Duas chamadas concorrentes para produtos diferentes podem passar pela checagem antes de qualquer gravação e inserir estoque na mesma localização.

O mapeamento não define índice ou constraint que proteja essa regra. Um índice único `(LocationId, ProductId)` sozinho garantiria apenas unicidade do par, não impediria dois produtos diferentes na mesma localização. A regra descrita exige proteção efetiva no banco para a ocupação por quantidade positiva, além de tratamento do conflito pela aplicação. Uma transação padrão envolvendo somente as consultas e a gravação não necessariamente elimina a corrida sob o isolamento padrão.

**Impacto:** violação de uma regra central do WMS sob carga concorrente.

### 2. Atualizações concorrentes podem perder movimentações

**Arquivos:** `backend/Loxena.Infrastructure/Repositories/StockRepository.cs`, `backend/Loxena.Application/Stocks/AddStock/AddStockUseCase.cs`, `backend/Loxena.Application/Stocks/RemoveStock/RemoveStockUseCase.cs`

Não foi observada estratégia de concorrência otimista, como token `RowVersion`, nem outra proteção contra atualização baseada em saldo desatualizado. Duas requisições podem ler o mesmo estoque e gravar resultados calculados independentemente; a última gravação pode sobrescrever a primeira.

**Impacto:** o saldo persistido pode não refletir todas as operações solicitadas. Por exemplo, duas adições simultâneas podem resultar em apenas uma delas contabilizada.

### 3. Quantidades não têm proteção contra overflow nem invariantes no banco

**Arquivos:** `backend/Loxena.Domain/Entities/Stock.cs`, `backend/Loxena.Infrastructure/Data/LoxenaDbContext.cs`

As quantidades usam `int`, e `AddPhysicalQuantity` e `ReserveQuantity` somam sem verificar overflow. Também não há constraints no mapeamento para proteger invariantes persistidas, como quantidades não negativas e `ReservedQuantity <= PhysicalQuantity`.

**Impacto:** em overflow, dados previamente inconsistentes ou gravações fora dos fluxos validados, o saldo pode assumir valores inválidos. As validações da entidade cobrem o fluxo normal, mas não são uma barreira no banco.

## Média Gravidade

### 4. Produto pode ser associado a categoria inativa

**Arquivos:** `backend/Loxena.Application/Products/CreateProduct/CreateProductUseCase.cs`, `backend/Loxena.Application/Products/UpdateProduct/UpdateProductUseCase.cs`

Os casos de uso confirmam que a categoria existe, mas não verificam `IsActive`. Assim, criação e atualização permitem associar produto a categoria inativa. A regra precisa ser explícita e aplicada igualmente nos dois fluxos.

### 5. Verificações de unicidade de categoria e localização têm janela de concorrência

**Arquivos:** `backend/Loxena.Infrastructure/Repositories/CategoryRepository.cs`, `backend/Loxena.Infrastructure/Repositories/LocationRepository.cs`, casos de uso de criação/atualização

A aplicação verifica previamente se nome ou código já existe, mas o `DbContext` consultado não configura constraints ou índices únicos correspondentes. Chamadas simultâneas podem passar pela verificação e gravar duplicatas.

As consultas aplicam `ToLower()`/`ToUpper()` às colunas. Isso pode dificultar o uso eficiente de índices, dependendo do banco e da collation, e exige coerência com a normalização usada nas entidades. A política de unicidade observada considera apenas registros ativos.

### 6. Comportamento de exclusão da relação Product–Category não está explícito

**Arquivo:** `backend/Loxena.Infrastructure/Data/LoxenaDbContext.cs`

A relação obrigatória de `Product` com `Category` não configura `OnDelete(DeleteBehavior.Restrict)`. O comportamento padrão de uma relação obrigatória pode permitir exclusão em cascata. Os endpoints consultados usam inativação, não exclusão física; o risco se materializa se exclusões físicas forem introduzidas ou executadas diretamente no banco.

As relações Stock–Product e Stock–Location, ao contrário, definem `Restrict` explicitamente.

### 7. Consultas GET rastreiam entidades e listas não são paginadas

**Arquivos:** repositórios e casos de uso `Get*`

Consultas de leitura observadas materializam entidades sem `AsNoTracking()`, e os métodos `GetAllAsync` retornam listas completas, sem paginação. O rastreamento aumenta o trabalho e a memória do contexto em leituras somente de consulta; listas ilimitadas aumentam o custo de memória, banco e resposta conforme os dados crescem.

Há uma ressalva: alguns métodos de busca por ID também são usados por fluxos de alteração, então não se deve aplicar `AsNoTracking()` indiscriminadamente sem separar os usos de leitura e atualização.

**N+1:** não foi encontrado N+1 nas consultas observadas: não há `Include` ou navegações configuradas nelas. Não há evidência de N+1 atual.

### 8. Handler pode expor mensagens de exceções internas

**Arquivo:** `backend/Loxena.Api/ExceptionHandlers/GlobalExceptionHandler.cs`

O campo `ProblemDetails.Detail` recebe `exception.Message` também para exceções inesperadas. Mensagens provenientes de infraestrutura podem conter detalhes internos. Além disso, toda `InvalidOperationException` é traduzida para `400 Bad Request`, embora conflitos e violações de estado nem sempre devam usar o mesmo status.

### 9. Política de atividade diverge entre adicionar e remover estoque

**Arquivos:** `backend/Loxena.Application/Stocks/AddStock/AddStockUseCase.cs`, `backend/Loxena.Application/Stocks/RemoveStock/RemoveStockUseCase.cs`

`AddStock` valida que produto e localização estão ativos; `RemoveStock` não faz essa validação. Isso pode ser intencional para permitir esvaziar estoques após inativação, mas a política não está explícita. O comportamento deve ser decidido e testado, não deixado como assimetria acidental.

### 10. Ciclo de vida de Location está incompleto em relação a Product e Category

**Arquivos:** `backend/Loxena.Domain/Entities/Location.cs`, `backend/Loxena.Api/Controllers/LocationsController.cs`

`Location` tem `IsActive`, mas não foi observado método de inativação nem endpoint para isso. O ciclo de vida diverge do de Produto e Categoria, e `GetAllAsync` retorna localizações sem filtrar inativas (se esse estado vier a ser utilizado por outro caminho).

## Melhorias Contínuas

### 11. Controllers retornam entidades de domínio diretamente

**Arquivos:** controllers da API

Os endpoints retornam `Product`, `Category`, `Location` e `Stock` diretamente. Isso acopla o contrato HTTP ao modelo de domínio e aumenta o risco de alterações internas quebrarem clientes. Não foi observado vazamento inverso — referência da camada Domain à API — e a dependência de Application para Domain é esperada nessa Clean Architecture.

### 12. Repositórios persistem em cada operação

**Arquivos:** repositórios de Infrastructure

Cada `AddAsync`/`UpdateAsync` chama `SaveChangesAsync`. Nos fluxos observados, geralmente há uma entidade persistida por caso de uso, então não é necessariamente um defeito funcional atual. Porém, isso dificulta coordenar atomicamente casos de uso que futuramente precisem persistir múltiplas alterações.

### 13. `CancellationToken` não é propagado

**Arquivos:** interfaces de repositório, casos de uso e controllers consultados

As operações assíncronas não recebem nem propagam `CancellationToken`. Requisições canceladas podem continuar consumindo recursos durante consultas e gravações.

### 14. POST responde com `200 OK`

**Arquivos:** controllers

Os endpoints de criação retornam `Ok(...)`. Avalie alinhar o contrato HTTP ao resultado de criação de recurso, incluindo o status apropriado e a localização do recurso, se fizer sentido para a API.

### 15. Cobertura de testes observada não cobre as regras críticas de estoque

A descoberta atual mostrou três testes não executados, referentes à criação e atualização de Produto. Não foram mostrados testes para concorrência, ocupação de localização, adição/remoção de estoque, reservas ou categorias/localizações. Isso não confirma a inexistência de outros testes, mas deixa essas regras sem cobertura confirmada nesta auditoria.

## Nota específica sobre estoque negativo

No fluxo sequencial normal, `RemovePhysicalQuantity` valida a quantidade disponível antes da subtração, e `ReserveQuantity` também verifica disponibilidade. Portanto, não foi encontrada uma falha direta que torne o estoque negativo em uma única execução válida. Os riscos concretos são overflow, estado previamente inconsistente e concorrência sem detecção; são esses cenários que podem comprometer o saldo.

## Ordem sugerida de investigação

1. Proteger a regra de ocupação da localização e a unicidade do registro de estoque no banco, tratando conflitos concorrentes.
2. Adotar estratégia de concorrência para impedir atualizações perdidas de saldo.
3. Definir limites e invariantes persistidos para quantidades, incluindo overflow.
4. Validar categoria ativa nos fluxos de produto, caso essa seja a regra de negócio.
5. Revisar respostas de erro, contratos HTTP, DTOs e testes das regras críticas.
