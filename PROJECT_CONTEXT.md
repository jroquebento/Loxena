# Loxena — Contexto Técnico do Projeto

> Documento de referência para desenvolvedores e IAs continuarem o projeto com base no código atual. Quando houver divergência, considerar os controllers, casos de uso, entidades e frontend presentes no repositório como fonte de verdade; usar `contexto_do_projeto_loxena_frontend_e_backend.md` como complemento recente e este documento como contexto consolidado.

## 1. Identidade e objetivo

**Loxena** é uma aplicação web de portfólio para representar operações essenciais de um centro de distribuição, com foco em WMS: cadastros operacionais, controle de saldo e reservas, atendimento de pedidos e etapas de picking a delivery.

O objetivo é demonstrar integração full stack e regras logísticas realistas em um MVP compreensível. Não ampliar o escopo para reproduzir um WMS empresarial completo sem necessidade concreta. O domínio é genérico e não deve reproduzir processos, nomes ou informações internas de empresas reais.

## 2. Estado atual resumido

| Área | Estado observado no código |
|---|---|
| Products | API e tela de CRUD; inativação lógica. |
| Categories | API e tela de CRUD; inativação lógica e validação de nome duplicado descrita no contexto recente. |
| Locations | API e tela de CRUD; inativação bloqueada se houver quantidade física na localização. |
| Stocks | API e tela para consulta, entrada, baixa e transferência; saldo físico, reservado e disponível. |
| Customers | API e tela de cadastro/consulta/atualização/inativação. |
| Orders / OrderItems | API e telas de criação, listagem, detalhes, picking, conferência, embalagem, expedição, entrega e cancelamento. Itens são geridos dentro do pedido. |
| Autenticação e papéis | Não implementados no MVP atual. |
| Recebimento formal / fornecedores | Não implementados; entrada de mercadoria é lançada diretamente em Stocks. |
| Pagamento confirmado | Não implementado; o pedido reserva estoque quando criado. |
| Dashboard / contagem formal de inventário | Não implementados no estado atual. |

O contexto legado descrevia Orders como não implementado; isso está desatualizado. O código atual possui entidade, enum, casos de uso, controller e páginas do fluxo de pedidos. Não repetir o status antigo.

## 3. Stack e estrutura do repositório

### Backend

- C# e .NET 10 (`net10.0`).
- ASP.NET Core Web API, controllers e OpenAPI/Swagger.
- Entity Framework Core 10 com SQL Server; banco configurado como `LoxenaDb` e connection string `DefaultConnection`.
- Mapster para mapeamento e injeção de dependência nativa.
- Tratamento global de exceções com `ProblemDetails`.

Projetos:

- `backend/Loxena.Api`: controllers, configuração HTTP, OpenAPI e handler global de exceções.
- `backend/Loxena.Application`: casos de uso, DTOs e interfaces de repositório.
- `backend/Loxena.Domain`: entidades, enumerações e regras de domínio.
- `backend/Loxena.Infrastructure`: DbContext, configurações EF Core e persistência.
- `tests/UnitTests`: projeto de testes unitários.

### Frontend

- React 19, TypeScript, Vite e Tailwind CSS 4.
- React Router, Fetch API, React-Toastify e SweetAlert2.
- O frontend usa serviços/utilitários para chamadas HTTP e tratamento de `ProblemDetails`; hooks como `useCrud` e `useStockMovements` mantêm lógica reutilizável fora das páginas.
- URL local da API configurada nos serviços verificados: `https://localhost:7175`.

Páginas/rotas observadas: `/` (produtos), `/categorias`, `/localizacoes`, `/estoque`, `/clientes`, `/pedidos`, `/pedidos/novo` e `/pedidos/operar/:id`.

### Dependências de arquitetura

```text
Loxena.Api → Loxena.Application
Loxena.Api → Loxena.Infrastructure
Loxena.Application → Loxena.Domain
Loxena.Infrastructure → Loxena.Application
Loxena.Infrastructure → Loxena.Domain
```

```text
React + TypeScript
        ↓ HTTP/JSON
ASP.NET Core API
        ↓
Application (casos de uso) → Domain (regras)
        ↑                           ↑
Infrastructure (repositórios / EF Core)
        ↓
SQL Server
```

O Domain não deve depender de HTTP, banco de dados ou frontend. A camada Application orquestra casos de uso; Infrastructure implementa persistência; Api traduz requisições e respostas HTTP.

## 4. Entidades e regras relevantes

### Product

Contém `Id`, `Name`, `Description`, `Price`, `CategoryId` e `IsActive`. A entidade valida campos obrigatórios, limites de tamanho e preço não negativo. Quantidade não pertence ao produto; ela é controlada por Stock.

### Category

Contém `Id`, `Name` e `IsActive`. O nome é obrigatório e limitado a 100 caracteres. O contexto recente registra validação de duplicidade no fluxo de criação/atualização. A inativação/exclusão não deve ser descrita como remoção física.

### Location

Contém `Id`, `Code`, `Description` e `IsActive`. O código é normalizado para maiúsculas; o contexto de demonstração usa códigos curtos como `A1`, `A2`, `B1`, `B2` e `EXP`. O caso de uso de inativação impede desativar uma localização que possua estoque físico maior que zero.

### Stock

Contém `Id`, `ProductId`, `LocationId`, `PhysicalQuantity` e `ReservedQuantity`. `AvailableQuantity` é calculado e ignorado pelo EF Core:

```text
AvailableQuantity = PhysicalQuantity - ReservedQuantity
```

Regras: valores movimentados devem ser positivos; não reservar além do disponível; não remover estoque físico que comprometa reservas; ao cumprir uma reserva na expedição, reduzir o físico e a reserva. A configuração EF estabelece limites de não negatividade, reserva não superior ao físico, versão de linha e índices para a relação produto/localização.

Operações de entrada, baixa e transferência são operações de estoque. Não criam Receiving, ReceivingItem ou histórico formal de recebimento.

### Customer

Contém `Id`, `Name`, `Email`, `Document`, `Phone` e `IsActive`. Nome, e-mail, documento e telefone são obrigatórios conforme validações da entidade; e-mail é normalizado para minúsculas. Há criação, consulta, atualização e inativação pela API.

### Order e OrderItem

`Order` contém cliente, data de criação, status e itens. `OrderItem` contém produto, Stock associado, quantidade pedida, preço unitário e quantidade separada (`PickedQuantity`). O total do pedido é calculado pelos itens.

Os status existentes no enum são `Pending`, `Picking`, `Checking`, `Packing`, `Shipped`, `Delivered` e `Canceled`.

## 5. Fluxo real de pedido e estoque

```text
Entrada manual em Stocks
        ↓
Produto armazenado em uma Location
        ↓
Criação do Order: Pending + reserva imediata
        ↓
Picking (iniciar e registrar quantidade de cada item)
        ↓ todos os itens integralmente separados
Checking → Packing → Shipped → Delivered
```

Regras confirmadas no domínio/casos de uso:

1. A criação do pedido exige pelo menos um item e valida existência/atividade do produto e saldo suficiente em um registro de estoque. O sistema seleciona um Stock com disponibilidade suficiente para o item e reserva a quantidade.
2. A reserva ocorre na criação do pedido, não após pagamento. Não há endpoint/estado de pagamento confirmado.
3. Picking só avança de `Pending` para `Picking`; a quantidade registrada por item não pode exceder a quantidade pedida.
4. Checking só inicia de `Picking` quando todos os itens estão completamente separados.
5. Packing avança de `Checking`; shipping avança de `Packing`; delivery avança de `Shipped`.
6. No shipping, cada item atende sua reserva: `PhysicalQuantity` e `ReservedQuantity` diminuem pela quantidade expedida.
7. Cancelamento libera a reserva dos itens e só é válido antes de `Shipped`/`Delivered`. Pedido já cancelado não pode ser cancelado novamente.

Não documentar pagamento, retirada ou recebimento formal como parte do fluxo implementado. O fluxo operacional da interface acompanha os status do backend.

## 6. Endpoints confirmados

Os controllers usam `[Route("[controller]")]`; não há prefixo `/api` nos atributos verificados. `id`, `productId` e payloads são parâmetros/DTOs conforme a ação. Respostas de erro passam pelo tratamento global e podem ser expostas em `ProblemDetails`.

### Products

| Método | Rota | Ação |
|---|---|---|
| GET | `/Products` | Listar produtos |
| GET | `/Products/{id}` | Consultar por ID |
| POST | `/Products` | Criar |
| PUT | `/Products/{id}` | Atualizar |
| DELETE | `/Products/{id}` | Inativar |

### Categories

| Método | Rota | Ação |
|---|---|---|
| GET | `/Categories` | Listar categorias |
| GET | `/Categories/{id}` | Consultar por ID |
| POST | `/Categories` | Criar |
| PUT | `/Categories/{id}` | Atualizar |
| DELETE | `/Categories/{id}` | Inativar |

### Locations

| Método | Rota | Ação |
|---|---|---|
| GET | `/Locations` | Listar localizações |
| GET | `/Locations/{id}` | Consultar por ID |
| POST | `/Locations` | Criar |
| PUT | `/Locations/{id}` | Atualizar |
| DELETE | `/Locations/{id}` | Inativar (falha se houver estoque físico) |

### Stocks

| Método | Rota | Ação |
|---|---|---|
| GET | `/Stocks` | Listar saldos |
| GET | `/Stocks/{id}` | Consultar saldo por ID |
| GET | `/Stocks/product/{productId}` | Consultar saldos por produto |
| POST | `/Stocks/add` | Entrada de estoque |
| POST | `/Stocks/remove` | Baixa de estoque |
| POST | `/Stocks/transfer` | Transferência de estoque |

### Customers

| Método | Rota | Ação |
|---|---|---|
| GET | `/Customers` | Listar clientes |
| GET | `/Customers/{id}` | Consultar por ID |
| POST | `/Customers` | Criar |
| PUT | `/Customers/{id}` | Atualizar |
| DELETE | `/Customers/{id}` | Inativar |

### Orders

| Método | Rota | Ação |
|---|---|---|
| GET | `/Orders` | Listar pedidos |
| GET | `/Orders/{id}` | Consultar pedido e itens |
| POST | `/Orders` | Criar pedido e reservar estoque |
| PATCH | `/Orders/{id}/cancel` | Cancelar pedido |
| PATCH | `/Orders/{id}/start-picking` | Iniciar picking |
| PATCH | `/Orders/{id}/pick` | Registrar picking de item |
| PATCH | `/Orders/{id}/start-checking` | Iniciar conferência |
| PATCH | `/Orders/{id}/start-packing` | Iniciar embalagem |
| PATCH | `/Orders/{id}/ship` | Expedir e cumprir reservas |
| PATCH | `/Orders/{id}/deliver` | Registrar entrega |

Não inferir rotas auxiliares, autenticação ou parâmetros que não estejam nos controllers/DTOs. Revalidar esta seção sempre que controllers forem alterados.

## 7. Frontend e dados de demonstração

O menu atual contém Produtos, Categorias, Localizações, Saldo de Estoque, Clientes e Pedidos. A criação de pedido calcula disponibilidade a partir de `availableQuantity`, permite adicionar itens ao carrinho e envia `customerId` e pares de `productId`/`quantity`. O backend faz sua própria validação e reserva; a validação do frontend não substitui a regra do domínio.

O documento de contexto recente registra dados simplificados para demonstração: categorias diretas (Ferramentas, Eletrônicos, Suprimentos, Peças e Embalagens), produtos cotidianos e localizações curtas (`A1`, `A2`, `B1`, `B2`, `EXP`). Tratar esses itens como massa/contexto de teste documentado, sem afirmar que há seed automático sem confirmar sua implementação.

## 8. Persistência, configuração e migrações

`LoxenaDbContext` registra DbSets de `Products`, `Categories`, `Locations`, `Stocks`, `Customers`, `Orders` e `OrderItems`, e carrega configurações EF do assembly. Não há DbSet atual para Receiving, ReceivingItem, Supplier, User ou Role.

A conexão SQL Server é lida de `ConnectionStrings:DefaultConnection`. Swagger/OpenAPI é habilitado em desenvolvimento. A política CORS configurada permite a origem local do Vite `http://localhost:5173`.

O contexto recente informa reset do banco `LoxenaDb` e histórico sincronizado até `20261008150140_AddPickedQuantityToOrderItem`. Esse dado é um retrato contextual e deve ser conferido no diretório de migrações/banco atual antes de executar operações destrutivas ou assumir o estado de outro ambiente.

## 9. Diretrizes para continuidade

- Implementar incrementalmente e priorizar regras de negócio relevantes; evitar overengineering e bibliotecas sem necessidade concreta.
- Manter o Domain independente de framework HTTP e persistência.
- Respeitar contratos, rotas, DTOs e códigos de resposta existentes; não inventar endpoints para satisfazer a interface.
- Manter mensagens voltadas ao usuário em português e alinhar o tratamento frontend ao formato `ProblemDetails`.
- Manter quantidade no Stock, não em Product; respeitar `PhysicalQuantity - ReservedQuantity` em qualquer fluxo de disponibilidade.
- Atualizar este contexto e o README quando contratos ou comportamento do domínio mudarem.
- Antes de propor/implementar: verificar estado atual, explicar a decisão, fazer alteração mínima, validar/testar e relatar limitações observadas.
