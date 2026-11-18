# Loxena — Contexto Técnico do Projeto

> Referência interna de handover para desenvolvedores e assistentes de IA. As informações deste documento descrevem o código e a configuração atuais; em caso de divergência, controllers, casos de uso, entidades, configurações de persistência, frontend, Dockerfiles e workflow de CI são a fonte da verdade. Não inferir funcionalidades que não estejam implementadas.

## 1. Visão técnica e stack

O repositório contém a solução .NET `backend/Loxena.slnx`, com quatro projetos de produção e dois projetos de testes:

- `backend/Loxena.Domain`
- `backend/Loxena.Application`
- `backend/Loxena.Infrastructure`
- `backend/Loxena.Api`
- `tests/UnitTests`
- `tests/IntegrationTests`

| Área | Versão/configuração observada |
|---|---|
| Backend | C# e .NET 10 (`net10.0`); imagem de build `mcr.microsoft.com/dotnet/sdk:10.0` e runtime `mcr.microsoft.com/dotnet/aspnet:10.0`. |
| API e persistência | ASP.NET Core Web API, Entity Framework Core 10.x e SQL Server. O Compose usa `mcr.microsoft.com/mssql/server:2025-latest`; banco `LoxenaDb`. |
| Frontend | React `^19.2.8`, TypeScript `~6.0.2`, Tailwind CSS `^4.3.3` e Vite `^8.3.0`. O build executa `tsc -b && vite build`. |
| Container do frontend | Build com `node:20-alpine`; entrega de arquivos estáticos em `nginx:alpine`. Essas tags são as usadas no Dockerfile. |
| CI do frontend | GitHub Actions configura Node.js `22`, executa `npm ci` e `npm run build`. É uma versão diferente da imagem Node usada no Dockerfile. |
| Testes | Projetos .NET 10 com xUnit; `UnitTests` usa Moq e `IntegrationTests` usa Testcontainers para SQL Server. |

As dependências de produção incluem React Router, Fetch API, React-Toastify e SweetAlert2 no frontend; Mapster e injeção de dependência nativa no backend. Os projetos de API e Infrastructure referenciam Entity Framework Core 10. O SQL Server é iniciado e configurado pelo `docker-compose.yml`.

## 2. Arquitetura e responsabilidades

### Backend — Clean Architecture

```text
Loxena.Api ───────────────→ Loxena.Application ─────→ Loxena.Domain
     │                                                     ↑
     └──────────────────→ Loxena.Infrastructure ──────────┘
                                  │
                                  └── implementa contratos da Application
```

- **`Loxena.Domain`**: entidades, enumerações e invariantes do domínio. Não referencia API, Infrastructure ou frameworks de persistência.
- **`Loxena.Application`**: casos de uso, DTOs e interfaces de repositório; depende do Domain.
- **`Loxena.Infrastructure`**: `LoxenaDbContext`, configurações EF Core e repositórios; implementa interfaces da Application e depende também do Domain.
- **`Loxena.Api`**: controllers REST, composição de dependências, configuração HTTP/OpenAPI e tratamento global de exceções; referencia Application e Infrastructure.

A solução declara os dois projetos de testes. `UnitTests` referencia Application; `IntegrationTests` referencia Application e Infrastructure.

O handler `GlobalExceptionHandler` produz respostas `ProblemDetails`: `ArgumentException` e `InvalidOperationException` são mapeadas para HTTP 400; `DbUpdateConcurrencyException` para HTTP 409 Conflict; demais exceções para HTTP 500. O handler registra as exceções no log.

### Frontend

O frontend está em `frontend/loxena-web/src` e organiza a interface em páginas (`pages`), componentes reutilizáveis (`components`), hooks (`hooks`), serviços de API (`services`), tipos (`types`) e utilitários (`utils`). As páginas atuais incluem produtos, categorias, localizações, estoque, clientes e pedidos, além de criação e operação/detalhes de pedido.

- `services/apiConfig.ts` define a base HTTP como `/api`; os serviços usam Fetch API.
- `components/OrderList.tsx` e `components/StockList.tsx` exibem tabelas a partir do breakpoint `md` e cards em telas menores.
- `components/SearchInput.tsx` é um controle de busca reutilizável e controlado pelo estado da página.
- `utils/searchUtils.ts` aplica Unicode NFD, remove marcas diacríticas, converte para minúsculas e remove espaços nas extremidades. Os filtros de pedidos e estoque são executados client-side sobre os dados carregados.
- `App.tsx` define a área `<main>` com `overflow-y-auto`, que funciona como contêiner de rolagem da aplicação. Ao iniciar uma movimentação de estoque, `StockList` solicita rolagem suave tanto à janela quanto ao `<main>`.

No modo local, `vite.config.ts` encaminha `/api` a `http://localhost:8080` e remove o prefixo `/api` antes de enviar a requisição.

## 3. Modelo de domínio e invariantes críticos

As entidades registradas no `LoxenaDbContext` são `Category`, `Customer`, `Location`, `Order`, `OrderItem`, `Product` e `Stock`. A quantidade pertence a `Stock`, não a `Product`.

### Estoque e localização

- Cada `Stock` identifica `ProductId` e `LocationId`, além de `PhysicalQuantity` e `ReservedQuantity`.
- `AvailableQuantity` é calculado como `PhysicalQuantity - ReservedQuantity` e ignorado pelo mapeamento EF.
- Quantidades movimentadas devem ser positivas. Não é permitido reservar além do disponível nem remover físico que comprometa reservas. Na expedição, `FulfillReservation` reduz o físico e o reservado.
- Restrições de banco impedem quantidades física ou reservada negativas e reserva superior ao físico.
- Há unicidade para o par `(ProductId, LocationId)`. O índice `IX_Stock_SingleActiveProduct_PerLocation` é único por `LocationId` com filtro `[PhysicalQuantity] > 0`: restringe a localização a, no máximo, um registro de produto com saldo físico positivo. O filtro **não** verifica `Product.IsActive`.
- O caso de uso de inativação de `Location` impede a operação quando existe qualquer estoque com `PhysicalQuantity > 0` naquela localização.
- `OrderItem.StockId` é obrigatório e identifica o saldo utilizado para atender o item. A configuração de `OrderItem` não declara navegação nem relacionamento/FK EF explícito para `Stock`; o vínculo é consumido pelos casos de uso.

### Pedido e reserva

Estados declarados em `OrderStatus`: `Pending`, `Picking`, `Checking`, `Packing`, `Shipped`, `Delivered` e `Canceled`.

```text
Pending → Picking → Checking → Packing → Shipped → Delivered
   └──────────────────────────→ Canceled (antes de Shipped)
```

- A criação exige cliente ativo e pelo menos um item. Cada produto deve existir e estar ativo; o caso de uso seleciona um registro de estoque com disponível suficiente e reserva a quantidade imediatamente. Não existe etapa de confirmação de pagamento antes da reserva.
- O picking só pode ser registrado no estado `Picking`, e a quantidade separada de um item não pode exceder sua quantidade pedida.
- `Checking` só começa em `Picking` quando todos os itens estão completamente separados. As transições seguintes são `Checking` → `Packing` → `Shipped` → `Delivered`.
- A expedição exige `Packing`, busca o estoque pelo `OrderItem.StockId` e cumpre a reserva de cada item, reduzindo saldo físico e reservado.
- Cancelamento é permitido antes da expedição, libera as reservas dos itens e não pode ser repetido. Pedidos em `Shipped` ou `Delivered` não podem ser cancelados.
- A inativação de cliente é bloqueada se houver pedido cujo status não seja `Delivered` nem `Canceled` (ou seja, pedido ativo segundo `OrderRepository`).

### Concorrência otimista

A configuração de `Stock` declara a propriedade shadow `RowVersion` e a mapeia com `IsRowVersion()`. As migrações incluem essa coluna/tokens de concorrência. O EF Core pode lançar `DbUpdateConcurrencyException` ao detectar conflito; o `GlobalExceptionHandler` converte essa exceção em HTTP 409 Conflict com `ProblemDetails` e orientação para recarregar e tentar novamente. Portanto, o token e o mapeamento global de conflito fazem parte do estado implementado, não de uma funcionalidade ausente do MVP.

## 4. API, Docker, rede e reverse proxy

`docker-compose.yml` define três serviços:

| Serviço | Imagem/construção | Porta no host | Responsabilidade |
|---|---|---:|---|
| `sqlserver` | `mcr.microsoft.com/mssql/server:2025-latest` | `1433` | SQL Server 2025, persistido no volume `loxena_sqlserver_data`. |
| `api` | `backend/Dockerfile` | `8080` | API ASP.NET Core .NET 10, conectada ao banco pelo endereço interno `sqlserver:1433`. Aguarda o healthcheck do banco. |
| `frontend` | `frontend/loxena-web/Dockerfile` | `3000` (container `80`) | Arquivos da SPA servidos pelo Nginx. |

O arquivo `frontend/loxena-web/nginx.conf` configura o Nginx para servir a SPA e usar fallback `index.html` nas rotas do React Router. Para `location /api/`, `proxy_pass http://api:8080/` encaminha as chamadas ao serviço interno `api` e remove o prefixo `/api/` conforme a semântica da barra final do `proxy_pass`. Os controllers usam `[Route("[controller]")]`; por exemplo, a rota externa `/api/Orders` chega à API como `/Orders`.

No Compose, o navegador acessa a interface e a API pelo mesmo host/origem (`http://localhost:3000` e `/api/...`). O proxy evita chamadas cross-origin entre SPA e API nesse modo e, portanto, evita a exigência de CORS do navegador nessa comunicação; não substitui autenticação nem torna segura uma exposição pública. A API ainda configura CORS: por padrão, `http://localhost:5173`; no Compose, também `http://localhost:3000`.

Para acesso remoto temporário, o Cloudflare Tunnel pode expor o frontend/Nginx na porta `3000`; a chamada `/api` permanece encaminhada internamente à API, sob a mesma origem pública do navegador. Em desenvolvimento local, o Vite atua como proxy para a API na porta `8080`.

A API aplica migrações EF Core ao iniciar em banco relacional. A connection string é lida por `ConnectionStrings:DefaultConnection`.

### Seed de demonstração

Após aplicar as migrações, `backend/Loxena.Api/Program.cs` chama `LoxenaDbSeeder.SeedAsync` somente quando `Database:SeedData` está habilitado. O seeder, em `backend/Loxena.Infrastructure/Data/LoxenaDbSeeder.cs`, verifica `Categories.AnyAsync()` e retorna se já houver alguma categoria; assim, não repete a carga completa em um banco já inicializado. A carga inicial cria categorias, localizações, produtos, estoques, clientes e pedidos em diferentes etapas do fluxo.

O controle é configurado por ambiente:

- `backend/Loxena.Api/appsettings.json`: `Database:SeedData` é `false` por padrão, para não interferir nos `IntegrationTests`.
- `backend/Loxena.Api/appsettings.Development.json`: `Database:SeedData` é `true` para facilitar a demonstração durante o desenvolvimento.
- `docker-compose.yml`: a API recebe `Database__SeedData: "true"`, habilitando a carga no Compose.

O seeder cria as entidades pelos construtores de domínio (`Category`, `Location`, `Product`, `Stock` e `Customer`) e constrói os pedidos com operações do domínio, como `AddItem`, `StartPicking`, `ReserveQuantity`, `Pick`, `StartChecking`, `StartPacking`, `Ship`, `FulfillReservation` e `Deliver`. Assim, os dados de exemplo percorrem as regras e transições válidas do domínio em vez de atribuírem diretamente estados finais.

## 5. Testes e pipeline de CI

- **`tests/UnitTests`**: xUnit e Moq; referencia `Loxena.Application`.
- **`tests/IntegrationTests`**: xUnit e `Testcontainers.MsSql`; referencia `Loxena.Application` e `Loxena.Infrastructure`. A execução dos testes que iniciam SQL Server via Testcontainers requer Docker disponível.
- A solução completa pode ser testada com `dotnet test backend/Loxena.slnx` a partir da raiz.

O workflow `.github/workflows/ci.yml` é acionado em `push` e `pull_request`, em runners `ubuntu-24.04`, e possui dois jobs:

1. **Backend (.NET 10)** — working directory `backend`; checkout, setup do SDK `10.0.x`, `dotnet restore Loxena.slnx`, build Release com `--no-restore` e testes com `--no-build --configuration Release`.
2. **Frontend (React)** — working directory `frontend/loxena-web`; checkout, setup Node.js 22 com cache npm, `npm ci` e `npm run build`.

O CI do frontend não executa `npm run lint`; lint está disponível como script local no `package.json`.

## 6. Fronteiras do MVP e evoluções

Não estão implementados atualmente:

- autenticação, login, usuários, papéis ou autorização efetiva;
- fornecedores, recebimento formal e histórico próprio de recebimentos — entradas são lançadas diretamente em `Stock`;
- confirmação/pagamento de pedidos;
- contagem formal de inventário, dashboards e indicadores;
- fluxo específico de retirada pelo cliente.

A concorrência otimista de estoque com `RowVersion` e a resposta de conflito HTTP 409 estão implementadas, conforme descrito acima. Não devem ser listadas como ausentes. Novos fluxos, como recebimento formal, pagamento e autenticação/autorização, exigem modelagem e implementação antes de serem tratados como capacidades disponíveis.

## 7. Diretrizes para manutenção deste contexto

- Confirmar mudanças em controllers, casos de uso, entidades, mapeamentos EF, componentes frontend, Compose e CI antes de atualizar este documento.
- Descrever índices e relacionamentos segundo as configurações EF e migrações; não inferir uma FK de `OrderItem.StockId` que não esteja mapeada.
- Preservar a diferença entre comportamento da imagem Docker (Node 20 no build) e runner do CI (Node 22).
- Não afirmar que há módulos, autenticação, pagamentos ou recebimento formal sem implementação correspondente.
- Manter o Domain sem dependência de HTTP, persistência ou frontend; registrar novas decisões de dependência quando a arquitetura mudar.
