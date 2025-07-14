# Moyo Case Study
# 🛒 Online Order Solution

This repository contains a simple online order solution developed for a Moyo interview. It includes:

- **Online-Order**: Angular front-end application for placing and managing orders.
- **OnlineOrderAPI**: C# .NET back-end API for authentication and CRUD operations on orders.

This project was created for a presentation at **Moyo**.

## Features

- User authentication (login)
- Create, read, update, delete (CRUD) operations on orders

## Prerequisites

- Node.js (v16+)
- Angular CLI (v16.1.5) citeturn3view0
- .NET SDK (v7.0 or later) citeturn1view0

## Setup

### Front-end (Online-Order)

```bash
cd Online-Order
npm install
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Back-end (OnlineOrderAPI)

```bash
cd OnlineOrderAPI
dotnet restore
dotnet run
```

By default, the API listens on `http://localhost:5000`. It exposes endpoints for authentication and orders (e.g., `GET /api/orders`, `POST /api/orders`, etc.).

## Environment Configuration

- **AppSettings**: Update the `appsettings.Development.json` in the `OnlineOrderAPI` folder with your database connection string under `"ConnectionStrings"`.

## API Endpoints

- `POST /api/auth/login` – Authenticate user, returns JWT token.
- `GET /api/orders` – Retrieve all orders (requires auth).
- `GET /api/orders/{id}` – Retrieve a specific order by ID.
- `POST /api/orders` – Create a new order.
- `PUT /api/orders/{id}` – Update an existing order.
- `DELETE /api/orders/{id}` – Delete an order.


## Technologies Used

- Angular 16 (TypeScript)
- .NET 7 (C#)
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server

## License

This project is licensed under the MIT License.
