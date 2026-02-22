# Task Manager
> A full-stack enterprise application built with .NET 10, Angular, and Docker.

This repository contains a containerized web application designed for performance and scalability. The backend is powered by a **.NET 10** Web API, the frontend is a modern **Angular** application, and the entire stack (including the database) is orchestrated using **Docker Compose**.

![Alt text](Login.png)

---

## Tech Stack

* **Backend:** .NET 10 (MVC), Entity Framework Core
* **Frontend:** Angular, TypeScript, TailwindCSS
* **Database:** PostgreSQL
* **Infrastructure:** Docker, Docker Compose

---

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

* [Docker Desktop](https://www.docker.com/products/docker-desktop)
* [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
* [Node.js](https://nodejs.org/) (v20+ recommended)
* [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

---

## Project Structure

```text
NewTaskManager/
├── TaskManager/                    # .NET Backend
│   ├── TaskManager/                # Main project
│   │   ├── Controllers/            # API controllers
│   │   ├── Data/                   # DbContext
│   │   ├── Middleware/             # Global exception handler
│   │   ├── Migrations/             # EF Core migrations
│   │   ├── Models/                 # Entity models
│   │   ├── Properties/             # Launch settings
│   │   ├── Security/               # Auth interfaces & token service
│   │   ├── Services/               # Business logic
│   │   ├── appsettings.json        # App configuration
│   │   ├── Program.cs              # Entry point & DI setup
│   │   └── TaskManager.csproj      # Project file
│   ├── TaskManager.Tests/          # Unit tests
│   └── Dockerfile                  # Backend Docker build
├── TaskManagerUI/                  # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/               # Auth service, interceptor & guard
│   │   │   ├── components/         # Login & task manager components
│   │   │   ├── models/             # Task & DTO models
│   │   │   ├── services/           # Task service
│   │   │   ├── app.config.ts       # App providers
│   │   │   ├── app.routes.ts       # Route definitions
│   │   │   ├── app.ts              # Root component
│   │   │   └── app.html            # Root template
│   │   ├── environments/
│   │   │   ├── environment.ts          # Local dev config
│   │   │   └── environment.production.ts  # Production config
│   │   └── main.ts                 # Browser entry point
│   └── Dockerfile                  # Frontend Docker build
├── .dockerignore
├── .env                            # Environment variables (do not commit)
├── docker-compose.yml              # Multi-container setup
└── README.md
```

---

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/taskmanager.git
    cd taskmanager
    ```

2. Create a `.env` file in the root directory:

    ```env
    DB_CONNECTION=Host=postgres;Database=TaskManagerDb;Username=dbadmin;Password=yourpassword
    Username=dbadmin
    Password=yourpassword
    Database=TaskManagerDb
    ```

3. Start the application:

    ```bash
    docker compose up --build
    ```

4. Access the app at `http://localhost:4000`

The API will be available at `http://localhost:5000` and Swagger at `http://localhost:5000/swagger`.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_CONNECTION` | Full EF Core connection string for the backend |
| `Username` | PostgreSQL username |
| `Password` | PostgreSQL password |
| `Database` | PostgreSQL database name |

> **Note:** Never commit your `.env` file. It is listed in `.dockerignore` to prevent it from being included in Docker builds.

---

## API Endpoints

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register a new user | No |
| POST | `/api/v1/auth/login` | Login | No |
| POST | `/api/v1/auth/logout` | Logout | No |
| GET | `/api/v1/auth/me` | Get current user | Yes |
| GET | `/api/v1/taskmanager` | Get all tasks | Yes |
| GET | `/api/v1/taskmanager/{id}` | Get task by ID | Yes |
| POST | `/api/v1/taskmanager` | Create a task | Yes |
| PATCH | `/api/v1/taskmanager/{id}` | Update a task | Yes |
| DELETE | `/api/v1/taskmanager/{id}` | Delete a task | Yes |

---

## Security

Authentication is handled via **httpOnly cookies**, which are set server-side on login and cleared on logout. Tokens are never exposed to JavaScript, protecting against XSS attacks. All protected API routes require a valid session cookie and will return `401 Unauthorized` if one is not present.

---

## Running Tests

**Backend:**

```bash
cd TaskManager
dotnet test
```

**Frontend:**

```bash
cd TaskManagerUI
ng test
```

---

## Configuration

Application settings are managed via `appsettings.json`. Environment-specific overrides can be placed in `appsettings.Production.json`, which ASP.NET Core will automatically merge at runtime based on the `ASPNETCORE_ENVIRONMENT` variable.

Key settings:

| Key | Description |
|-----|-------------|
| `Jwt:Key` | Secret key used to sign JWT tokens (min. 32 characters) |
| `Jwt:Issuer` | JWT issuer |
| `Jwt:Audience` | JWT audience |
| `Jwt:ExpiryMinutes` | Token expiry duration in minutes |
| `AllowedOrigins` | CORS allowed origin for the frontend |
