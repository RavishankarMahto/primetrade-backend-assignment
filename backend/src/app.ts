import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { createAdminRouter } from "./routes/v1/admin.js";
import { createAuthRouter } from "./routes/v1/auth.js";
import { createTasksRouter } from "./routes/v1/tasks.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadOpenApiSpec() {
  const path = join(__dirname, "swagger", "openapi.json");
  return JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
}

export function createApp(env: Env) {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((s) => s.trim()),
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: env.NODE_ENV === "production" ? 300 : 2000,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", limiter);

  app.get("/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok" } });
  });

  const openApi = loadOpenApiSpec();
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApi, { customSiteTitle: "API Docs" }));
  app.get("/openapi.json", (_req, res) => {
    res.json(openApi);
  });

  app.use("/api/v1/auth", createAuthRouter(env));
  app.use("/api/v1/tasks", createTasksRouter(env));
  app.use("/api/v1/admin", createAdminRouter(env));

  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Route not found" },
    });
  });

  app.use(errorHandler);

  return app;
}
