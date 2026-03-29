import { Router, type Request } from "express";
import type { Env } from "../../config/env.js";
import { createAuthMiddleware } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasksForUser,
  updateTask,
} from "../../services/taskService.js";
import { createTaskSchema, updateTaskSchema } from "../../validators/task.js";

function paramId(req: Request): string {
  const raw = req.params.id;
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (!v) throw new Error("Missing route id");
  return v;
}

export function createTasksRouter(env: Env) {
  const r = Router();
  const auth = createAuthMiddleware(env);

  r.use(auth);

  r.get("/", async (req, res, next) => {
    try {
      const { id: userId, role } = req.user!;
      const tasks = await listTasksForUser(userId, role);
      res.json({ success: true, data: { tasks } });
    } catch (e) {
      next(e);
    }
  });

  r.get("/:id", async (req, res, next) => {
    try {
      const { id: userId, role } = req.user!;
      const task = await getTaskById(paramId(req), userId, role);
      res.json({ success: true, data: { task } });
    } catch (e) {
      next(e);
    }
  });

  r.post("/", validateBody(createTaskSchema), async (req, res, next) => {
    try {
      const task = await createTask(req.user!.id, req.body);
      res.status(201).json({ success: true, data: { task } });
    } catch (e) {
      next(e);
    }
  });

  r.patch("/:id", validateBody(updateTaskSchema), async (req, res, next) => {
    try {
      const { id: userId, role } = req.user!;
      const task = await updateTask(paramId(req), userId, role, req.body);
      res.json({ success: true, data: { task } });
    } catch (e) {
      next(e);
    }
  });

  r.delete("/:id", async (req, res, next) => {
    try {
      const { id: userId, role } = req.user!;
      await deleteTask(paramId(req), userId, role);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  });

  return r;
}
