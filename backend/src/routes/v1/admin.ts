import { Router } from "express";
import type { Env } from "../../config/env.js";
import { createAuthMiddleware, requireRole } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";

export function createAdminRouter(env: Env) {
  const r = Router();
  const auth = createAuthMiddleware(env);

  r.use(auth, requireRole("ADMIN"));

  r.get("/users", async (_req, res, next) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      res.json({ success: true, data: { users } });
    } catch (e) {
      next(e);
    }
  });

  return r;
}
