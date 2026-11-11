# Loxena

<p align="right"><a href="README.md">🇧🇷 Leia em português</a></p>

## Full-Stack Logistics Operations and WMS System

**Loxena** is a portfolio web application representing essential distribution-center operations: product and warehouse-location management, stock and reservation control, order fulfillment, and execution of the steps from picking through delivery.

The MVP focuses on concrete operational rules and frontend/API integration. It is intentionally not a complete enterprise WMS.

> **Status:** in development. The API and frontend currently cover catalogs, stock, customers, and the order workflow described below.

## Implemented operational workflow

```text
Simplified receiving
(manual stock entry)
			↓
Storage by location
(stock and transfer operations)
			↓
Physical and available stock
			↓
Order creation: Pending
(immediate stock reservation)
		  ↓
Picking → Checking → Packing
		  ↓
Shipped
(physical stock deducted and reservation released)
		  ↓
Delivered
```

Receiving has no dedicated module or record: incoming quantities are entered directly into stock. There is no payment-confirmation step; stock is reserved when an order is created. Customer pickup is not represented as a separate state or workflow in the current implementation.

## Features

- **Products and categories:** create, retrieve, update, and inactivate.
- **Locations:** create and maintain warehouse locations; inactivation is blocked while physical stock remains at a location.
- **Stock:** retrieve stock by product and add, remove, or transfer quantities between locations.
- **Customers:** create, retrieve, update, and inactivate.
- **Orders:** create orders with items, retrieve orders, cancel, and track operational progress.
- **Warehouse operations:** start picking, record picked quantities per item, start checking and packing, ship, and confirm delivery.

Order items are managed within an order rather than as a separate module. Catalog entities are inactivated instead of physically deleted.

## Key business rules

### Stock balance

Each stock record associates a product with a location and tracks physical and reserved quantities:

```text
Available quantity = PhysicalQuantity - ReservedQuantity
```

A reservation requires sufficient available quantity. Manual stock removal cannot reduce physical stock below reserved quantities. When an order is shipped, its reservation is fulfilled: physical stock decreases and the corresponding reserved quantity is released.

### Order lifecycle

```text
Pending → Picking → Checking → Packing → Shipped → Delivered
     └──────────── Canceled before shipment ────────────────┘
```

- An order starts as `Pending` and reserves stock immediately.
- Checking can begin only after every order item has been fully picked.
- Shipping requires the `Packing` state and fulfills the reserved stock.
- Cancellation releases reservations and is not allowed after `Shipped` or `Delivered`.

## Technology and architecture

**Backend:** C#, .NET 10, ASP.NET Core Web API, Entity Framework Core, SQL Server, Mapster, and built-in dependency injection.

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Fetch API, React-Toastify, and SweetAlert2.

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

The backend separates API, use-case, domain, and persistence responsibilities. API exceptions are returned as `ProblemDetails`; the frontend displays user-facing error messages. The configured database is `LoxenaDb`.

## MVP scope

**Implemented:** products, categories, locations, stock, customers, orders, and picking, checking, packing, shipping, and delivery operations.

**Simplified or currently out of scope:** authentication/JWT and user roles; suppliers and formal receiving records; payment confirmation; formal inventory counting; dashboards and metrics; and a dedicated pickup workflow. These should not be presented as currently available features.

For demonstration data, the latest project context describes straightforward categories (such as Ferramentas and Eletrônicos), everyday products, and short location codes such as `A1`, `B1`, and `EXP`.

## Run locally

The backend requires the .NET 10 SDK and a SQL Server instance configured through the `DefaultConnection` connection string. The frontend uses Vite; from `frontend/loxena-web`, install dependencies with `npm install` and start the development server with `npm run dev`. The frontend is configured to use the local API at `https://localhost:7175`.

## Project goal

Demonstrate full-stack development skills through a coherent logistics domain: stock rules, state transitions, a REST API, relational persistence, and an integrated React interface. The priority is to keep the MVP understandable, testable, and evolvable.
