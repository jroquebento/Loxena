# Loxena

<p align="right"><a href="README-en.md">🇺🇸 Read in English</a></p>

## Sistema Full Stack de Operações Logísticas e WMS

O **Loxena** é uma aplicação web de portfólio para representar operações essenciais de um centro de distribuição: cadastro de produtos e endereços, controle de saldo e reservas, atendimento de pedidos e execução das etapas de separação até a entrega.

O MVP prioriza regras operacionais concretas, integração entre API e interface e uma implementação incremental, sem tentar reproduzir toda a complexidade de um WMS empresarial.

> **Status:** em desenvolvimento. A API e o frontend já cobrem cadastros, estoque, clientes e o fluxo operacional de pedidos descrito abaixo.

## Fluxo operacional implementado

```text
Recebimento simplificado
(entrada manual de estoque)
          ↓
Armazenamento por localização
(estoque e transferência)
          ↓
Saldo físico e disponível
          ↓
Criação do pedido: Pending
(reserva imediata do saldo)
          ↓
Picking → Checking → Packing
          ↓
Shipped
(baixa física e liberação da reserva)
          ↓
Delivered
```

O recebimento não possui módulo ou registro próprio: a entrada é lançada diretamente no estoque. Também não há etapa de confirmação de pagamento; a reserva acontece ao criar o pedido. A retirada pelo cliente não está representada como estado/fluxo próprio na implementação atual.

## Funcionalidades

- **Produtos e categorias:** criação, consulta, atualização e inativação.
- **Localizações:** cadastro e manutenção de endereços do armazém; a inativação é impedida quando há saldo físico na localização.
- **Estoque:** consulta por produto e operações de entrada, baixa e transferência entre localizações.
- **Clientes:** criação, consulta, atualização e inativação.
- **Pedidos:** criação com itens, consulta, cancelamento e acompanhamento operacional.
- **Operações:** início de picking, registro da quantidade separada por item, conferência, embalagem, expedição e confirmação de entrega.

Os itens são administrados dentro do pedido, não como módulo isolado. Cadastros com exclusão lógica são inativados, em vez de removidos fisicamente.

## Regras de negócio em destaque

### Saldo de estoque

Cada registro de estoque associa um produto a uma localização e mantém as quantidades física e reservada:

```text
Saldo disponível = PhysicalQuantity - ReservedQuantity
```

Uma reserva exige saldo disponível suficiente. Uma baixa manual não pode comprometer quantidades reservadas. Ao expedir um pedido, a quantidade reservada é atendida: diminui o saldo físico e a reserva correspondente.

### Ciclo de vida do pedido

```text
Pending → Picking → Checking → Packing → Shipped → Delivered
     └──────────────── Cancelado antes da expedição ──────────┘
```

- O pedido nasce em `Pending` e reserva estoque imediatamente.
- A conferência só pode começar depois que todos os itens tiverem sido integralmente separados.
- A expedição requer o estado `Packing` e consome o estoque reservado.
- O cancelamento libera as reservas e não é permitido após `Shipped` ou `Delivered`.

## Tecnologias e arquitetura

**Backend:** C#, .NET 10, ASP.NET Core Web API, Entity Framework Core, SQL Server, Mapster e injeção de dependência nativa.

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Fetch API, React-Toastify e SweetAlert2.

```text
React + TypeScript
        │ HTTP/JSON
        ▼
Loxena.Api → Loxena.Application → Loxena.Domain
        │              ▲
        └── Loxena.Infrastructure
                       │ EF Core
                       ▼
                   SQL Server
```

O backend separa responsabilidades entre API, casos de uso, domínio e persistência. A API converte exceções em respostas `ProblemDetails`; o frontend apresenta mensagens de erro ao usuário. O banco configurado é `LoxenaDb`.

## Escopo do MVP

**Implementado:** produtos, categorias, localizações, estoque, clientes, pedidos e etapas de picking, checking, packing, shipping e delivery.

**Simplificado ou fora do escopo atual:** autenticação/JWT e papéis; fornecedores e recebimentos formais; confirmação de pagamento; contagem formal de inventário; dashboard e indicadores; fluxo específico de retirada. Esses itens não devem ser interpretados como funcionalidades disponíveis na versão atual.

Para o cenário de demonstração, o contexto atualizado registra categorias diretas (como Ferramentas e Eletrônicos), produtos cotidianos e localizações curtas, como `A1`, `B1` e `EXP`.

## Executar localmente

O backend requer o SDK do .NET 10 e uma instância de SQL Server configurada pela connection string `DefaultConnection`. O frontend usa Vite; em `frontend/loxena-web`, instale as dependências com `npm install` e inicie o ambiente com `npm run dev`. A URL local da API configurada no frontend é `https://localhost:7175`.

## Objetivo do projeto

Demonstrar competências de desenvolvimento full stack por meio de um domínio logístico coerente: modelagem de regras de estoque, transições de estado, API REST, persistência relacional e interface React integrada. A prioridade é manter um MVP compreensível, testável e evolutivo.
