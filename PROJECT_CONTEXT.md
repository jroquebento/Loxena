# Loxena — Project Context

> Contexto técnico e histórico para outra IA continuar o desenvolvimento do projeto sem depender do histórico da conversa original.

## 1. Identidade do projeto

**Nome:** Loxena  
**Tipo:** aplicação Full Stack de gestão de operações logísticas / centro de distribuição  
**Objetivo:** projeto de portfólio para complementar o projeto anterior TaskManager.

O Loxena foi escolhido para demonstrar competências que não aparecem tanto no TaskManager, principalmente:

- React
- TypeScript
- JavaScript moderno
- HTML/CSS
- consumo de API
- integração frontend/backend
- CRUD Full Stack
- autenticação no frontend
- dashboards
- filtros e busca
- regras de negócio mais próximas de um sistema operacional real
- desenvolvimento assistido por IA, mas com entendimento do código
- testes estratégicos
- Docker/CI/CD posteriormente

O projeto é inspirado genericamente em experiências anteriores do autor em logística, mas **não deve reproduzir processos, nomes, regras internas ou informações de empresas reais**.

---

# 2. Objetivo de portfólio

O TaskManager já demonstra principalmente:

- C#/.NET
- ASP.NET Core
- REST API
- EF Core
- SQL Server
- autenticação JWT
- autorização
- Argon2
- testes unitários e de integração
- Docker
- GitHub Actions
- arquitetura em camadas

O Loxena deve complementar isso demonstrando:

- frontend moderno;
- React + TypeScript;
- integração real com API;
- fluxo operacional;
- regras de negócio;
- CRUD;
- estoque;
- pedidos;
- operações de picking/conferência/embalagem/expedição;
- interface de usuário;
- eventualmente dashboard, filtros e relatórios.

**Não transformar o Loxena em um projeto gigantesco.** O objetivo é demonstrar amplitude e qualidade suficiente para portfólio, não reproduzir um WMS empresarial completo.

---

# 3. Perfil do desenvolvedor

O autor é estudante de ADS e está buscando estágio em desenvolvimento de software.

Experiência e conhecimentos relevantes:

- C#
- .NET / ASP.NET Core
- SQL / SQL Server
- Entity Framework Core
- REST APIs
- POO
- HTML
- CSS
- JavaScript
- Bootstrap
- jQuery
- Git/GitHub
- testes com xUnit e Moq
- Docker
- GitHub Actions

O foco atual é consolidar desenvolvimento backend/full-stack e aprender React/TypeScript através do próprio projeto.

O autor prefere:

- explicações didáticas;
- implementação gradual;
- entender o motivo das decisões;
- arquitetura simples e realista;
- código que possa explicar em entrevista;
- projetos práticos em vez de cursos intermináveis;
- evitar "tutorial hell";
- evitar overengineering;
- avançar o projeto continuamente.

---

# 4. Princípios de desenvolvimento

## 4.1 Não fazer overengineering

Não introduzir abstrações, padrões, bibliotecas ou camadas apenas porque "seria mais profissional".

Antes de adicionar algo, perguntar:

1. Existe um problema real?
2. O projeto precisa disso agora?
3. Isso melhora significativamente a manutenção?
4. O autor conseguirá explicar essa decisão em uma entrevista?

Se a resposta for não, manter simples.

## 4.2 Implementação incremental

Não criar toda a arquitetura futura antecipadamente.

A estrutura deve crescer conforme as funcionalidades aparecem.

Exemplo:

Não criar dezenas de pastas React vazias apenas porque existe um planejamento futuro.

## 4.3 Entendimento antes da implementação

Quando uma tecnologia ou conceito novo aparecer, explicar brevemente:

- o que é;
- por que está sendo usado;
- como se encaixa no Loxena;
- só então implementar.

Não entregar grandes blocos de código sem contexto.

## 4.4 IA como ferramenta

O autor usa IA como ferramenta de desenvolvimento, mas não quer simplesmente copiar código.

Fluxo desejado:

> problema → conceito → documentação/explicação → implementação pequena → teste → entendimento → commit → próximo passo

Quando houver uma decisão relevante, pode ser útil comparar uma segunda opinião de Gemini/Copilot, mas isso não deve virar burocracia.

---

# 5. Domínio do Loxena

O sistema representa operações de um centro de distribuição.

Fluxo geral:

1. Recebimento
2. Armazenamento
3. Estoque
4. Pedido
5. Separação (picking)
6. Conferência
7. Embalagem
8. Expedição
9. Entrega ou retirada

---

# 6. Fluxo do pedido

Estado planejado:

```text
Criado
  ↓
Pagamento confirmado
  ↓
Separando
  ↓
Conferência
  ↓
Embalagem
  ↓
Expedição
  ↓
Entrega
```

Regras importantes:

- pedido precisa ter pagamento confirmado antes da reserva de estoque;
- cancelamento é permitido antes da expedição;
- cancelamento antes da expedição deve liberar a reserva de estoque;
- depois da expedição o pedido não deve simplesmente voltar ao estoque;
- estoque insuficiente deve impedir operações que dependam daquela quantidade;
- futuramente, as transições de estado devem ser controladas por regras de negócio.

Essas regras são mais importantes para testes do que validar cada propriedade trivial de cada classe.

# 7. Funcionalidades

## Essenciais

- usuários e acesso;
- produtos;
- categorias;
- estoque;
- frontend;
- pedidos;
- picking;
- conferência;
- embalagem;
- expedição;
- recebimento;
- armazenamento.

## Importantes

- dashboard;
- relatórios;
- alertas;
- estrutura do armazém;
- funcionalidades técnicas/infrastrutura.

## Futuras

- inteligência/IA.

A parte de IA não é prioridade do MVP.

# 8. Usuários e papéis

**Papéis planejados:**

- Administrator
- Operator
- Coordinator

Todos terão login/senha.

As permissões determinarão quais operações cada papel pode realizar.

A autenticação completa pode ser implementada mais adiante; não deve bloquear o desenvolvimento atual do domínio.

# 9. Entidades planejadas

### Product

Representa o produto comercializado.

Campos atuais:

```text
Id: Guid
Name: string
Description: string
Price: decimal
CategoryId: Guid
IsActive: bool
```

Quantidade não pertence ao Product.

Quantidade e localização pertencem ao domínio de Stock.

### Category

Representa a categoria do produto.

```text
Id: Guid
Name: string
```

### Stock

Implementado. Representa:

```text
Product
Location
Quantity
```

Possui métodos de negócio para `AddQuantity`, `RemoveQuantity` e a complexa operação de `Transfer` (que afeta saldos na origem e no destino validando disponibilidade física e limites).

### Order

Pertence a um Customer e possui vários OrderItems.

### OrderItem

Representa um Product dentro de um Order, incluindo quantidade.

### Customer

Representa o cliente do pedido.

### Receiving

Representa o recebimento de mercadorias.

### ReceivingItem

Representa os produtos/quantidades recebidos.

### Location

Representa uma localização dentro do centro de distribuição.

O MVP trabalha com um único centro de distribuição.

### Histórico/auditoria

Pode ser adicionado posteriormente para rastreabilidade.

Não antecipar essa funcionalidade sem necessidade.

# 10. Estrutura atual do repositório

**Raiz:**

```text
C:\Projetos\Loxena\
├── backend\
│   └── Loxena.slnx
├── tests\
│   └── UnitTests\
├── frontend\
│   └── loxena-web\
├── README.md
├── PROJECT_CONTEXT.md
└── .gitignore
```

# 11. Arquitetura atual

```text
React/TypeScript (Tailwind, SweetAlert2)
       ↓
HTTP/JSON (Fetch API utilitária)
       ↓
ASP.NET Core API (GlobalExceptionHandler -> ProblemDetails)
       ↓
Application (UseCases)
       ↓
Domain (Validações Core)
       ↑
Infrastructure (Repositories)
       ↓
EF Core
       ↓
SQL Server
```

**Dependências:**

```text
Api → Application
Api → Infrastructure
Application → Domain
Infrastructure → Application
Infrastructure → Domain
```

### Domain

Contém regras centrais do negócio. Não deve depender de HTTP, banco, React, controllers ou infraestrutura.

### Application

Contém casos de uso e orquestração. Validações de duplicidade de banco (ex: `ExistsByNameAsync`) ocorrem aqui.

### Infrastructure

Contém implementações de persistência e integração. Usa Entity Framework Core e SQL Server.

### Api

Responsável por HTTP/controllers/OpenAPI/Swagger e tratamento global de erros.

# 12. Convenções de idioma

**Código:**

Inglês (ex: Product, Category, CreateProductUseCase).

**Conteúdo para o Usuário Final (Frontend / Mensagens de Erro):**

Português (ex: `throw new Exception("Categoria não encontrada.");`).

**Documentação de negócio e explicações:**

Português.

# 13. Category — estado atual

Category CRUD concluído com validações de domínio.

**Entity:**

```csharp
public class Category
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }
}
```

**Repository possui verificação de duplicidade:**

```csharp
Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null);
```

**Regras de negócio adicionadas:**

O nome da Categoria deve ser único. O CreateCategoryUseCase e o UpdateCategoryUseCase validam isso com o banco.

Exclusão (Delete) foi implementada, mas é bloqueada caso a categoria possua produtos ativos vinculados.

# 14. Product — estado atual

Product CRUD concluído e integrado ao frontend.

A validação estrutural (tamanho de string, preço negativo) está propositalmente dentro da própria entidade. A validação de relacionamento (Categoria existe?) está no UseCase.

# 15. Frontend React — estado atual

O desenvolvimento do frontend (loxena-web) possui uma base limpa e escalável.

**Tecnologias utilizadas:**

- React + TypeScript (Vite)
- Tailwind CSS (Estilização sem CSS externo)
- React-Toastify (Notificações de sucesso e erro)
- SweetAlert2 (Modais e popups via utils)
- Fetch API (com função utilitária `tratarErro` para ler ProblemDetails)

**Padrão Arquitetural do Frontend:**

Separation of Concerns (Custom Hooks): As regras de negócio complexas, o gerenciamento de estado (`useState`, `useEffect`) e as chamadas à API são isolados em Custom Hooks (como `useCrud` e `useStockMovements`). As páginas visuais (ex: StocksPage, CategoriesPage) permanecem enxutas, atuando apenas como "vitrines" e recebendo os dados e funções que precisam.

**Dívida Técnica Consciente (Design System):**

A criação de um "Design System" próprio (extrair formulários para micro-componentes genéricos como `<Input>`, `<Select>`, `<Button>`) foi adiada. Formulários com dezenas de linhas são mantidos por serem altamente coesos e claros. O foco está na entrega de valor e de regras de negócio, evitando over-engineering prematuro. A UI prioriza código limpo e delega tratamento de erros e modais (como Transferência de Estoque) para funções utilitárias isoladas (`alertUtils.ts`).

**Páginas atuais:**

- CategoriesPage
- ProductsPage
- StocksPage

# 16. Tratamento de Erros

O projeto implementa um fluxo Full Stack padronizado para erros:

**Backend:**

As exceções lançadas nos UseCases ou Entidades são interceptadas por um GlobalExceptionHandler no C#.

**ProblemDetails:**

O erro é convertido para o padrão RFC ProblemDetails, enviando a mensagem traduzida (em Português) para o frontend.

**Frontend:**

O utilitário `apiUtils.ts` do React lê a resposta, identifica o ProblemDetails e exibe o erro em um Toast vermelho amigável para o usuário.

# 17. Testes — decisão atual

Criar uma suíte enxuta e estratégica, cobrindo comportamentos importantes. Não testar exaustivamente cada linha ou cada validação de cada Use Case no CRUD inicial.

As regras de negócio mais interessantes aparecerão em:

- Stock;
- Orders;
- Picking;
- Packing;

# 18. Estado atual exato

**No momento da transferência:**

- Category CRUD: Concluído (Frontend e Backend integrados).
- Product CRUD: Concluído (Frontend e Backend integrados).
- Global Exception Handler: Concluído.
- UI/UX: Padronizada com Toasts e SweetAlert2.
- Validação de Nomes Únicos: Concluída (Categorias).
- Módulo de Estoque (Stock): Concluído. Fluxos de Entrada, Baixa e Transferência de Estoque implementados (com modal integrado no `alertUtils.ts`). Padrão Master-Detail para entrada/baixa na UI.
- Frontend (React): Refatorado. Hooks isolando regras de negócio (`useCrud`, `useStockMovements`).
- Product tests: Iniciados e estáveis.
- Orders: Ainda não implementado.
- Operações de Armazém: Ainda não implementadas.
- Autenticação frontend/backend: Ainda não implementada.

# 19. Próxima rota

Sequência planejada:

```text
CRUD Base (Produtos e Categorias) - CONCLUÍDO
        ↓
Início do Frontend (React + Integração Base) - CONCLUÍDO
        ↓
Módulo de Estoque (Stock) - CONCLUÍDO
        ↓
Módulo de Pedidos (Orders) - PRÓXIMO PASSO (Ou Filtros/Dashboard)
        ↓
Operações Logísticas (Picking, Checking, Packing, Shipping)
        ↓
Autenticação
        ↓
Integração frontend completa e Dashboard
```

O Stock (Estoque) é a evolução natural do Produto, transformando o Loxena de um simples cadastro para um sistema operacional que responde: "Quanto desse produto existe e onde ele está?".

# 20. Decisões que não devem ser revertidas sem motivo

- Não transformar Product em responsável por quantidade.
- Manter as mensagens de exceção do C# em português para facilitar o envio via Toast no Frontend.
- Manter a extração de funções utilitárias no Frontend (como `apiUtils` e `alertUtils`) para não poluir as páginas com boilerplates do SweetAlert2 ou Fetch.
- Manter as páginas React (UI) enxutas, delegando lógica pesada, transações e chamadas de rede para Custom Hooks (`useStockMovements`, `useCrud`).
- Não criar abstração prematura de UI (micro-componentes/Design System) até que o MVP de negócio operante do Loxena esteja finalizado.
- Não introduzir bibliotecas complexas de estado no React (Redux) sem necessidade.
- Não abandonar as regras de negócio simples em favor de arquitetura excessivamente abstrata.

# 21. Como continuar a conversa

A próxima IA deve primeiro considerar este documento como a fonte de contexto do projeto.

Antes de propor código:

1. identificar o estado atual;
2. confirmar qual é o próximo pequeno passo;
3. explicar por que ele existe;
4. implementar somente o necessário;
5. testar;
6. revisar o resultado;
7. fazer commit quando fizer sentido;
8. só então avançar.
