import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import type { Role } from "@prisma/client";

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
};

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; role: Role };
    }
  }
}

export function createAuthMiddleware(env: Env) {
  return async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return next(new AppError(401, "Missing or invalid Authorization header", "UNAUTHORIZED"));
    }
    const token = header.slice(7);
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        select: { id: true, email: true, role: true },
      });
      if (!user) {
        return next(new AppError(401, "User no longer exists", "UNAUTHORIZED"));
      }
      req.user = user;
      next();
    } catch {
      next(new AppError(401, "Invalid or expired token", "UNAUTHORIZED"));
    }
  };
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Unauthorized", "UNAUTHORIZED"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "Forbidden", "FORBIDDEN"));
    }
    next();
  };
}
