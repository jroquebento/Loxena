# Loxena

**Full Stack Logistics Operations Management System**

Loxena is a full stack web application designed to manage the main logistics operations of a distribution environment, from receiving products to order delivery or customer pickup.

The project is being developed as a portfolio application to demonstrate practical skills in **backend development with .NET and frontend development with React and TypeScript**.

> **Project status:** 🚧 In development

---

## About

Loxena centralizes information and operations related to products, inventory, warehouse locations, receiving, orders, picking, checking, packing, and shipping.

The application is designed around a simplified but realistic logistics workflow:

```text
Receiving
    ↓
Storage
    ↓
Inventory
    ↓
Order
    ↓
Payment Confirmed
    ↓
Picking
    ↓
Checking
    ↓
Packing
    ↓
Shipping
    ↓
Delivery / Pickup
```

The project intentionally focuses on a **manageable MVP**, avoiding unnecessary complexity while maintaining enough business rules to represent a realistic system.

---

## Main Features

### Authentication & Access

- User authentication
- Role-based access
- Administrative user management

### Products

- Product management
- Category management
- Product activation/deactivation

### Warehouse & Inventory

- Warehouse locations
- Product storage locations
- Inventory quantities
- Stock reservations
- Stock movements
- Inventory counting
- Inventory adjustments

### Receiving

- Supplier management
- Receiving records
- Received items
- Product storage

### Orders

- Customer management
- Order creation
- Order items
- Payment confirmation
- Stock reservation
- Order cancellation

### Logistics Operations

- Picking
- Order checking
- Packing
- Shipping
- Delivery
- Customer pickup

### Dashboard

Planned operational indicators include:

- Orders in progress
- Priority orders
- Low-stock products
- Best-selling products
- Least-selling products

---

## Order Workflow

The main order lifecycle is:

```text
Created
   ↓
Payment Confirmed
   ↓
Picking
   ↓
Checking
   ↓
Packing
   ↓
Shipping
   ↓
Delivered / Picked Up
```

Orders may be cancelled before shipping.

When a paid order is cancelled, its stock reservation is released.

---

## Technology Stack

### Backend

- C#
- .NET 10
- ASP.NET Core
- Entity Framework Core
- SQL Server
- REST API
- JWT
- Swagger / OpenAPI

### Frontend

- React
- TypeScript
- JavaScript
- HTML
- CSS
- React Router

### Testing

- xUnit
- Moq

### Infrastructure & Tools

- Git
- GitHub
- Docker
- Docker Compose
- GitHub Actions

Additional libraries will only be introduced when they solve an actual project requirement.

---

## Architecture

The application will follow a separated frontend/backend architecture.

```text
                 Loxena

        ┌─────────────────────┐
        │ React + TypeScript  │
        │      Frontend       │
        └──────────┬──────────┘
                   │
                HTTP/JSON
                   │
                   ▼
        ┌─────────────────────┐
        │     Loxena.Api      │
        ├─────────────────────┤
        │ Loxena.Application  │
        ├─────────────────────┤
        │   Loxena.Domain     │
        ├─────────────────────┤
        │Loxena.Infrastructure│
        └──────────┬──────────┘
                   │
                   ▼
               SQL Server
```

The backend will be organized around API, application, domain, and infrastructure responsibilities.

The architecture will remain intentionally pragmatic. Patterns and abstractions will be introduced when they provide meaningful value rather than simply increasing the number of projects, folders, or classes.

---

## Development Approach

Loxena is being developed incrementally.

The project prioritizes:

- understanding before implementation;
- realistic business rules;
- small functional increments;
- maintainable code;
- meaningful tests;
- practical use of modern development tools;
- avoiding unnecessary complexity.

The goal is:

> **Finish a good project rather than start an oversized one that never gets completed.**

---

## AI-Assisted Development

AI tools may be used throughout development for:

- research;
- learning and explanations;
- repetitive code generation;
- debugging;
- testing;
- code review;
- documentation;
- comparing alternative solutions.

Possible tools include ChatGPT, GitHub Copilot, and Gemini.

AI-generated code will only be incorporated after its purpose and behavior are understood.

---

## Roadmap

- [ ] Project foundation
- [ ] Authentication and users
- [ ] Products and categories
- [ ] Warehouse locations
- [ ] Inventory
- [ ] Receiving
- [ ] Customers and orders
- [ ] Picking and checking
- [ ] Packing and shipping
- [ ] Delivery / pickup
- [ ] Dashboard
- [ ] Testing and quality improvements
- [ ] Docker and CI/CD
- [ ] Documentation and portfolio preparation

---

## Project Goal

Loxena is primarily a learning and portfolio project.

It aims to demonstrate the ability to build and integrate:

**ASP.NET Core + REST API + SQL Server + React + TypeScript**

while applying authentication, business rules, testing, Git, Docker, CI/CD, and AI-assisted development in a practical application.

---

## License

This project is developed for educational and portfolio purposes.