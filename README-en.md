# WMS Loxena

<p align="right"><a href="README.md">🇧🇷 Português</a></p>

![GitHub Actions CI](https://github.com/jroquebento/Loxena/actions/workflows/ci.yml/badge.svg?branch=main)
![.NET 10](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?logo=csharp&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![SQL Server 2025](https://img.shields.io/badge/SQL_Server-2025-CC2927?logo=microsoftsqlserver&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

**Loxena** is a portfolio Warehouse Management System (WMS) inspired by real logistics operations. It models location-based inventory and order fulfillment, connecting an ASP.NET Core API to a responsive React interface.

## Overview and business context

The system covers product, category, location, and customer records; inventory lookup and movements; and order creation and fulfillment. The goal is to demonstrate practical logistics rules in an MVP, not to claim a complete enterprise WMS.

- **Location-based inventory:** each `Stock` record associates a product with a location and calculates available quantity as `PhysicalQuantity - ReservedQuantity`. The application validates reservations, removals, and shipment fulfillment to preserve committed stock.
- **Optimistic concurrency:** EF Core `RowVersion` detects conflicting simultaneous stock reservations and returns HTTP `409 Conflict` to prevent inconsistencies.
- **Occupied locations:** a location with physical stock cannot be inactivated. A filtered index also prevents more than one product with positive physical stock from occupying the same location.
- **Orders and picking:** creating an order reserves stock. The workflow requires all items to be picked before checking, then advances through packing, shipment, and delivery. Shipment consumes physical stock and its reservation.
- **Customer protection:** a customer with active orders cannot be inactivated.

An order moves through `Pending → Picking → Checking → Packing → Shipped → Delivered`; it can also be canceled before shipment. Formal receiving, payment confirmation, authentication, and a dedicated pickup workflow are not implemented in this MVP.

## Architecture and technical decisions

### Docker topology

In Compose, Nginx serves the frontend on port `3000` and forwards `/api/` to the API over the internal Docker network. The API connects to SQL Server 2025 through the `sqlserver` service.

```mermaid
flowchart LR
    Browser[Browser]
    Nginx[Nginx Reverse Proxy<br/>Frontend container :80<br/>host :3000]
    Api[ASP.NET Core Web API<br/>.NET 10 :8080]
    Db[(SQL Server 2025<br/>LoxenaDb :1433)]

    Browser -->|HTTP :3000| Nginx
    Nginx -->|SPA assets| Browser
    Nginx -->|/api/* → API routes| Api
    Api -->|EF Core| Db
```

### Domain model

The diagram represents the entities registered in `LoxenaDbContext`. `OrderItem.StockId` identifies the stock record associated with an item; the entity has no explicit EF navigation to `Stock`.

```mermaid
erDiagram
    CATEGORY ||--o{ PRODUCT : categorizes
    PRODUCT ||--o{ STOCK : stored_as
    LOCATION ||--o{ STOCK : contains
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : references
    STOCK ||..o{ ORDER_ITEM : "StockId reference"

    CATEGORY {
        Guid Id PK
        string Name
        bool IsActive
    }
    PRODUCT {
        Guid Id PK
        string Name
        decimal Price
        Guid CategoryId FK
        bool IsActive
    }
    LOCATION {
        Guid Id PK
        string Code
        string Description
        bool IsActive
    }
    STOCK {
        Guid Id PK
        Guid ProductId FK
        Guid LocationId FK
        int PhysicalQuantity
        int ReservedQuantity
    }
    CUSTOMER {
        Guid Id PK
        string Name
        string Email
        string Document
        string Phone
        bool IsActive
    }
    ORDER {
        Guid Id PK
        Guid CustomerId FK
        datetime CreatedAt
        OrderStatus Status
    }
    ORDER_ITEM {
        Guid Id PK
        Guid OrderId FK
        Guid ProductId FK
        Guid StockId
        int Quantity
        decimal UnitPrice
        int PickedQuantity
    }
```

### Clean Architecture and frontend

The backend separates responsibilities into `Loxena.Domain` (entities and rules), `Loxena.Application` (use cases and contracts), `Loxena.Infrastructure` (EF Core and persistence), and `Loxena.Api` (controllers, HTTP configuration, and global error handling). Test projects are in `tests/UnitTests` and `tests/IntegrationTests`.

The frontend uses React 19, TypeScript, Vite, and Tailwind CSS 4. Operational lists combine desktop tables with mobile cards and instant client-side search; navigation and controls adapt to smaller screens.

Key API routes include `/Orders`, `/Stocks`, `/Customers`, `/Products`, `/Categories`, and `/Locations`. Through Nginx, they are available under `/api/` (for example, `/api/Orders`).

## Visual demo

Screenshots and GIFs will be added later. Place them in `docs/images/` and remove the corresponding HTML comments to display them:

<!-- ![Desktop order management](docs/images/orders-desktop.png) -->
<!-- ![Order picking workflow](docs/images/order-picking.gif) -->
<!-- ![Responsive mobile interface](docs/images/mobile-responsive.png) -->

## Getting started

### Docker Compose (recommended)

Requirements: Docker Engine or Docker Desktop with the `docker compose` plugin.

From the repository root, run:

```bash
docker compose up --build -d
```

Open **http://localhost:3000**. Compose starts SQL Server 2025, the API, and the frontend; the API applies EF Core migrations at startup.

```bash
docker compose ps
docker compose down
```

`docker compose down` preserves the database volume. Use `docker compose down -v` only if you also intend to delete persisted data.

### Local development (optional)

Requirements: .NET 10 SDK, Node.js 22+, and Docker to provide SQL Server. `appsettings.Development.json` expects SQL Server at `localhost:1433` with the `LoxenaDb` database; start only the database service from Compose:

```bash
docker compose up -d sqlserver
```

In one terminal, from the repository root, run the API on port `8080`, which is the Vite proxy target:

```bash
dotnet run --project backend/Loxena.Api/Loxena.Api.csproj --urls http://localhost:8080
```

In a second terminal:

```bash
cd frontend/loxena-web
npm ci
npm run dev
```

Open **http://localhost:5173**. Vite forwards `/api` requests to `http://localhost:8080`.

### Temporary access with Cloudflare Tunnel

To expose the Docker Compose version, use port `3000`:

```bash
cloudflared tunnel --url http://localhost:3000
```

If you are using the Vite development server, expose port `5173`:

```bash
cloudflared tunnel --url http://localhost:5173
```

Use the temporary HTTPS URL printed by `cloudflared`. The tunnel makes the app publicly accessible; do not expose real data, credentials, or environments that should remain private.

## Tests and CI

Run the .NET tests from the repository root:

```bash
dotnet test backend/Loxena.slnx
```

The `UnitTests` and `IntegrationTests` projects use xUnit; integration tests require Docker/Testcontainers for SQL Server.

The [GitHub Actions CI workflow](.github/workflows/ci.yml) runs on `push` and `pull_request` and has two jobs:

- **Backend (.NET 10):** restore, Release build, and tests for `backend/Loxena.slnx`.
- **Frontend (Node.js 22):** `npm ci` and `npm run build` in `frontend/loxena-web`.

The frontend also provides `npm run lint` for local static analysis.

## Repository structure

```text
backend/
  Loxena.Api/
  Loxena.Application/
  Loxena.Domain/
  Loxena.Infrastructure/
  Loxena.slnx
tests/
  UnitTests/
  IntegrationTests/
frontend/
  loxena-web/
docker-compose.yml
README.md
README-en.md
```

See also the [project technical context](docs/project_context.md).
