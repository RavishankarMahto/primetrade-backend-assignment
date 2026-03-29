import { Router } from "express";
import type { Env } from "../../config/env.js";
import { createAuthMiddleware } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { loginUser, registerUser } from "../../services/authService.js";
import { loginSchema, registerSchema } from "../../validators/auth.js";

export function createAuthRouter(env: Env) {
  const r = Router();
  const auth = createAuthMiddleware(env);

  r.post("/register", validateBody(registerSchema), async (req, res, next) => {
    try {
      const { user, token } = await registerUser(env, req.body);
      res.status(201).json({ success: true, data: { user, token } });
    } catch (e) {
      next(e);
    }
  });

  r.post("/login", validateBody(loginSchema), async (req, res, next) => {
    try {
      const { user, token } = await loginUser(env, req.body);
      res.json({ success: true, data: { user, token } });
    } catch (e) {
      next(e);
    }
  });

  r.get("/me", auth, async (req, res) => {
    res.json({ success: true, data: { user: req.user } });
  });

  return r;
}
