# Scalability & deployment readiness

This project is structured so new modules (e.g. `notifications`, `billing`) can be added as separate route folders under `src/routes/v1` (or future `v2`) with their own services and validators.

## Short-term scaling (single codebase)

- **Stateless API:** JWT in `Authorization` header allows multiple API instances behind a load balancer; no server-side session store required.
- **Database:** PostgreSQL handles concurrent connections; use connection pooling (e.g. PgBouncer) in production and tune Prisma’s pool settings.
- **Caching:** Add Redis for hot reads (e.g. user profile, feature flags) or rate-limit counters shared across instances.
- **Background work:** Move slow or unreliable operations (email, webhooks) to a queue (BullMQ + Redis, or cloud queues) and return `202 Accepted` where appropriate.

## Medium-term: service boundaries

- Split **auth** into a dedicated service if many clients (mobile, third parties) need independent scaling or token formats.
- Extract **read models** (e.g. task list projections) if reporting or search load grows; consider read replicas or Elasticsearch for full-text search on task content.

## Infrastructure

- **Containers:** Docker images for API + migrations; orchestrate with Kubernetes or ECS/Fargate; run DB as managed PostgreSQL.
- **Observability:** Centralize structured logs (JSON), trace IDs, and metrics (latency, error rate, DB pool usage) for each route.

## Trade-offs chosen here

- Monolith + modular folders keeps the assignment small while demonstrating clear boundaries.
- JWT avoids sticky sessions and fits horizontal scaling; refresh tokens and revocation lists can be added if product requirements demand shorter-lived access tokens.
