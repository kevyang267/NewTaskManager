# Task Manager

> A full-stack enterprise application built with .NET 10, Angular, and Docker.

This repository contains a containerized web application designed for performance and scalability. The backend is powered by a **.NET 10** Web API, the frontend is a modern **Angular** application, and the entire stack (including the database) is orchestrated using **Docker Compose**.

---

## 🛠️ Tech Stack

* **Backend:** .NET 10 (Web API), Entity Framework Core
* **Frontend:** Angular, TypeScript, TailwindCSS / Angular Material
* **Database:** PostgreSQL *(Update as needed)*
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
├── api/                  # .NET 10 Web API project
│   ├── Controllers/      # API Endpoints
│   ├── Data/             # EF Core DbContext & Migrations
│   └── Dockerfile        # Backend container configuration
├── client/               # Angular frontend project
│   ├── src/              # Angular source code
│   └── Dockerfile        # Frontend container configuration
├── docker-compose.yml    # Orchestrates the API, Client, and Database
└── README.md             # Project documentation
