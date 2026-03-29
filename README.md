# Backend + Frontend Assignment — REST API (Auth, RBAC, Tasks)

Monorepo:

- **`backend/`** — Node.js + Express + TypeScript + Prisma + PostgreSQL, JWT auth, role-based access (`USER` | `ADMIN`), CRUD for **tasks**, API versioning (`/api/v1`), validation (Zod), Swagger UI, rate limiting, Helmet.
- **`frontend/`** — React (Vite + TypeScript): register, login, JWT in `localStorage`, protected dashboard, task CRUD, admin “list users” when role is `ADMIN`.
- **`postman/`** — Postman collection for quick API testing.

## Prerequisites

- Node.js 20+
- PostgreSQL 14+ (local or Docker)

## Quick start

### 1. Database

Create a database (example name: `primetrade_assignment`).

Optional Docker:

```bash
docker run --name pg-assign -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=primetrade_assignment -p 5432:5432 -d postgres:16
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set DATABASE_URL and JWT_SECRET (min 32 characters)

npm install
npx prisma generate
npx prisma db push
npm run dev
```

- API: `http://localhost:4000`
- Health: `GET /health`
- **Swagger UI:** `http://localhost:4000/docs`
- OpenAPI JSON: `http://localhost:4000/openapi.json`

**Seed an admin user (optional):**

```bash
# Defaults: admin@example.com / Admin12345 — override with env vars if needed
npx prisma db seed
```

Set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in the environment when running seed if you want custom credentials.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` and `/health` to `http://localhost:4000`.

**Production / separate hosts:** build the frontend and set `VITE_API_BASE` to your API origin (e.g. `https://api.example.com`).

## API overview (v1)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | — | Register (password hashed with bcrypt) |
| POST | `/api/v1/auth/login` | — | Login, returns JWT |
| GET | `/api/v1/auth/me` | JWT | Current user |
| GET/POST | `/api/v1/tasks` | JWT | List (user: own tasks; admin: all) / Create |
| GET/PATCH/DELETE | `/api/v1/tasks/:id` | JWT | Read / update / delete (admin can access any) |
| GET | `/api/v1/admin/users` | JWT + `ADMIN` | List users |

Responses use `{ success: true, data: ... }` or `{ success: false, error: { code, message, ... } }` with appropriate HTTP status codes.

## Postman

Import `postman/Primetrade-Assignment.postman_collection.json`. Run **Login** to auto-save `token` for protected routes.

## Scalability & operations

See [SCALABILITY.md](./SCALABILITY.md) for notes on horizontal scaling, caching, queues, and deployment.

## Project structure (backend)

- `src/config` — environment validation
- `src/middleware` — auth, RBAC, errors, validation
- `src/routes/v1` — versioned routes
- `src/services` — business logic
- `src/validators` — Zod schemas
- `prisma/schema.prisma` — database schema

## Security notes

- Passwords: bcrypt (cost factor 12)
- JWT: signed with `JWT_SECRET`, configurable expiry
- Input validation and trimming via Zod; JSON body size limited
- Helmet + rate limiting on `/api/*`

## Note on the assignment email

The instructions mention both “Backend Developer” and “Frontend Developer” in places; mirror the role you are applying for in your email subject line, and attach any **log files** they requested when you submit.

## License

Provided as a sample assignment project; adjust as needed for your submission.
