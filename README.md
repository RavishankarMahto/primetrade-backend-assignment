<div align="center">

```
██████╗ ██████╗ ██╗███╗   ███╗███████╗████████╗██████╗  █████╗ ██████╗ ███████╗
██╔══██╗██╔══██╗██║████╗ ████║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔════╝
██████╔╝██████╔╝██║██╔████╔██║█████╗     ██║   ██████╔╝███████║██║  ██║█████╗  
██╔═══╝ ██╔══██╗██║██║╚██╔╝██║██╔══╝     ██║   ██╔══██╗██╔══██║██║  ██║██╔══╝  
██║     ██║  ██║██║██║ ╚═╝ ██║███████╗   ██║   ██║  ██║██║  ██║██████╔╝███████╗
╚═╝     ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝
```

### Scalable REST API · JWT Authentication · Role-Based Access Control · Task Management

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Swagger](https://img.shields.io/badge/Swagger-UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-Sample%20Assignment-orange?style=for-the-badge)](./LICENSE)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Core Features](#-core-features)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
  - [Database Setup](#1-database-setup)
  - [Backend](#2-backend)
  - [Frontend](#3-frontend)
- [API Reference](#-api-reference-v1)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Scalability](#-scalability--operations)
- [Postman Collection](#-postman-collection)
- [Assignment Checklist](#-assignment-checklist)

---

## 🚀 Overview

A **production-grade monorepo** built for the PrimeTrade.ai Backend Developer Intern assignment. It demonstrates a secure, scalable REST API with JWT-based authentication, role-based access control (`USER` | `ADMIN`), and full CRUD for a **Tasks** entity — paired with a React frontend that consumes every endpoint.

```
monorepo/
├── backend/     → Node.js + Express + TypeScript + Prisma + PostgreSQL
├── frontend/    → React + Vite + TypeScript
└── postman/     → Postman collection for API testing
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                       │
│          React 18 · Vite · TypeScript · JWT in localStorage   │
└────────────────────────┬─────────────────────────────────────┘
                         │  HTTP / REST
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    BACKEND  (Port 4000)                        │
│  Express · TypeScript · /api/v1 versioning                    │
│  ┌───────────┐  ┌────────────┐  ┌──────────────────────────┐ │
│  │  Auth     │  │  Tasks     │  │  Admin                   │ │
│  │ /register │  │ GET  POST  │  │  GET /admin/users        │ │
│  │ /login    │  │ PATCH DEL  │  │  (ADMIN role only)       │ │
│  │ /me       │  └────────────┘  └──────────────────────────┘ │
│  └───────────┘                                                │
│  Middleware: Helmet · Rate Limit · Zod Validation · JWT       │
└────────────────────────┬─────────────────────────────────────┘
                         │  Prisma ORM
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    PostgreSQL 14+                              │
│          Users ←── Tasks   (role: USER | ADMIN)               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js 20+ | Server runtime |
| **Language** | TypeScript 5.x | Type safety across the stack |
| **Framework** | Express.js | REST API server |
| **ORM** | Prisma | Database access & migrations |
| **Database** | PostgreSQL 14+ | Primary data store |
| **Auth** | JWT + bcrypt | Secure authentication (cost factor 12) |
| **Validation** | Zod | Schema validation & sanitization |
| **Docs** | Swagger UI | Interactive API documentation |
| **Security** | Helmet + Rate Limiter | HTTP hardening |
| **Frontend** | React 18 + Vite | UI layer |
| **Styling** | TailwindCSS / CSS Modules | Component styling |
| **API Testing** | Postman Collection | Endpoint testing & token management |

---

## ✅ Core Features

### 🔐 Authentication & Authorization
- **User Registration** — email + password with bcrypt hashing (cost factor 12)
- **JWT Login** — returns signed token, configurable expiry
- **Role-Based Access Control** — `USER` and `ADMIN` roles with middleware guards
- **Protected Routes** — JWT required on all `/tasks` and `/admin` endpoints
- **Admin Privileges** — admins can view all tasks and list all users; users see only their own

### 📋 Task Management (CRUD)
- Create, read, update, delete tasks
- Users access only their own tasks; admins access all
- Tasks linked to owning user via foreign key
- Full validation on every request (title, status, etc.)

### 🌐 API Design
- **Versioned** at `/api/v1` for backward-compatible future evolution
- **Consistent response envelope**: `{ success: true, data: ... }` or `{ success: false, error: { code, message } }`
- Appropriate HTTP status codes on all responses
- **Swagger UI** at `/docs` with full schema documentation
- **OpenAPI JSON** at `/openapi.json` for tooling/import

### 🖥️ Frontend
- Register & login forms with error/success feedback
- JWT stored in `localStorage`, attached to every API request
- Protected dashboard — redirects unauthenticated users to login
- Full task CRUD UI (create, view, edit, delete)
- **Admin panel**: "List Users" visible only when role is `ADMIN`
- Error/success messages surfaced from API responses

### 🔒 Security & Scalability
- Helmet for HTTP header hardening
- Rate limiting on `/api/*` to prevent brute-force
- Input sanitization & trimming via Zod
- JSON body size capped
- Scalable project structure — new modules drop into `src/routes/v1` + `src/services`

---

## 📦 Prerequisites

| Requirement | Version |
|------------|---------|
| [Node.js](https://nodejs.org/) | 20+ |
| [PostgreSQL](https://www.postgresql.org/) | 14+ (local or Docker) |
| npm / yarn | Latest |

---

## ⚡ Quick Start

### 1. Database Setup

**Option A — Local PostgreSQL:**

Create a database named `primetrade_assignment` in your local PostgreSQL instance.

**Option B — Docker (recommended for quick start):**

```bash
docker run --name pg-assign \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=primetrade_assignment \
  -p 5432:5432 \
  -d postgres:16
```

---

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and configure:

```env
# Required
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/primetrade_assignment"
JWT_SECRET="your-super-secret-key-minimum-32-characters"

# Optional
JWT_EXPIRES_IN="7d"
PORT=4000
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="Admin12345"
```

```bash
npm install
npx prisma generate       # generate Prisma client
npx prisma db push        # sync schema to database
npm run dev               # start dev server with hot-reload
```

**Endpoints after startup:**

| URL | Description |
|-----|-------------|
| `http://localhost:4000/health` | Health check |
| `http://localhost:4000/docs` | **Swagger UI** |
| `http://localhost:4000/openapi.json` | OpenAPI spec |

**Seed an admin user (optional):**

```bash
npx prisma db seed
# Creates: admin@example.com / Admin12345 (override via SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD)
```

---

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:5173`**

> The Vite dev server proxies `/api` and `/health` to `http://localhost:4000` automatically — no CORS config needed during development.

**Production / separate hosts:**

```bash
# Set your API base URL, then build
VITE_API_BASE=https://api.yourdomain.com npm run build
```

---

## 📖 API Reference (v1)

Base URL: `http://localhost:4000/api/v1`

### Auth

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/auth/register` | ❌ | Register new user (bcrypt hashed password) |
| `POST` | `/auth/login` | ❌ | Login, returns signed JWT |
| `GET` | `/auth/me` | ✅ JWT | Get current authenticated user |

### Tasks

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `/tasks` | ✅ JWT | List tasks (USER: own only · ADMIN: all) |
| `POST` | `/tasks` | ✅ JWT | Create a new task |
| `GET` | `/tasks/:id` | ✅ JWT | Get single task (ADMIN can access any) |
| `PATCH` | `/tasks/:id` | ✅ JWT | Update task (ADMIN can update any) |
| `DELETE` | `/tasks/:id` | ✅ JWT | Delete task (ADMIN can delete any) |

### Admin

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `/admin/users` | ✅ JWT + `ADMIN` | List all registered users |

### Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

---

## 🗂️ Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema (User, Task, Role enum)
│   └── seed.ts                # Admin user seeder
└── src/
    ├── config/                # Environment validation (Zod)
    ├── middleware/
    │   ├── auth.ts            # JWT verification middleware
    │   ├── rbac.ts            # Role-based access guard
    │   ├── errorHandler.ts    # Global error handler
    │   └── validate.ts        # Zod request validation
    ├── routes/
    │   └── v1/
    │       ├── auth.routes.ts
    │       ├── tasks.routes.ts
    │       └── admin.routes.ts
    ├── services/
    │   ├── auth.service.ts    # Registration, login, token logic
    │   ├── tasks.service.ts   # Task CRUD business logic
    │   └── admin.service.ts   # Admin operations
    ├── validators/
    │   ├── auth.validator.ts  # Zod schemas for auth
    │   └── tasks.validator.ts # Zod schemas for tasks
    └── app.ts                 # Express app setup (Helmet, rate limit, Swagger)

frontend/
├── src/
│   ├── api/                   # Axios client + endpoint functions
│   ├── components/            # Reusable UI components
│   ├── pages/
│   │   ├── Register.tsx
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx      # Protected — task CRUD
│   │   └── AdminPanel.tsx     # ADMIN only — user list
│   ├── context/               # Auth context (JWT, user role)
│   └── App.tsx

postman/
└── Primetrade-Assignment.postman_collection.json
```

---

## 🔒 Security

| Concern | Implementation |
|---------|---------------|
| **Password Storage** | bcrypt with cost factor **12** |
| **Token Signing** | JWT signed with `JWT_SECRET` (min 32 chars), configurable expiry |
| **Input Validation** | Zod schemas on every endpoint; strings trimmed, types enforced |
| **HTTP Hardening** | Helmet sets secure headers (CSP, HSTS, X-Frame-Options, etc.) |
| **Rate Limiting** | Express rate-limit on `/api/*` — prevents brute-force attacks |
| **Body Size** | JSON body size capped to prevent payload attacks |
| **RBAC** | Middleware-level role checks — users cannot escalate privileges |

---

## 📈 Scalability & Operations

See [`SCALABILITY.md`](./SCALABILITY.md) for a detailed write-up. Summary:

- **Horizontal Scaling** — Stateless JWT means any backend instance can verify tokens; run multiple instances behind a load balancer (nginx / AWS ALB)
- **Caching** — Redis layer for frequently-read data (e.g., user profile, task lists) — reduces DB load
- **Database** — Read replicas for query offloading; connection pooling via PgBouncer
- **Queue / Background Jobs** — BullMQ + Redis for async operations (emails, notifications)
- **Containerization** — Dockerfile + docker-compose ready for Docker / Kubernetes deployment
- **Microservices Path** — `auth`, `tasks`, and `admin` services are already module-separated and can be extracted into independent services

---

## 📬 Postman Collection

1. Open Postman → **Import**
2. Select `postman/Primetrade-Assignment.postman_collection.json`
3. Run the **Login** request — the collection automatically saves the returned JWT as the `token` environment variable
4. All protected requests use `Bearer {{token}}` automatically

---

## ✅ Assignment Checklist

| Requirement | Status |
|-------------|:------:|
| User registration & login with bcrypt + JWT | ✅ |
| Role-based access (`USER` \| `ADMIN`) | ✅ |
| CRUD APIs for Tasks entity | ✅ |
| API versioning (`/api/v1`) | ✅ |
| Error handling & Zod validation | ✅ |
| Swagger UI + OpenAPI JSON | ✅ |
| PostgreSQL schema via Prisma | ✅ |
| React frontend (register, login, dashboard) | ✅ |
| Protected dashboard (JWT required) | ✅ |
| Task CRUD on frontend | ✅ |
| Admin user list (ADMIN role only) | ✅ |
| Error/success messages from API | ✅ |
| Helmet + rate limiting | ✅ |
| Input sanitization & trimming | ✅ |
| Postman collection | ✅ |
| Scalability notes | ✅ |
| GitHub README | ✅ |

---

## 📧 Submission

- joydip@primetrade.ai
- hello@primetrade.ai
- chetan@primetrade.ai
- sonika@primetrade.ai

---

<div align="center">

Built with ❤️ for the **PrimeTrade.ai** Backend Developer Intern Assignment

*First come, first served — get it done!*

</div>
