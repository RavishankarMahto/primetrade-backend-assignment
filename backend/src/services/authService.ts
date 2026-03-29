import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { Env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import type { JwtPayload } from "../middleware/auth.js";
import { AppError } from "../utils/errors.js";
import type { Role } from "@prisma/client";

const SALT_ROUNDS = 12;

export async function registerUser(
  env: Env,
  data: { email: string; password: string; role?: Role }
) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError(409, "Email already registered", "EMAIL_EXISTS");
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      role: data.role ?? "USER",
    },
    select: { id: true, email: true, role: true, createdAt: true },
  });

  const token = signToken(env, user);
  return { user, token };
}

export async function loginUser(env: Env, data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }
  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) {
    throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  const safe = { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt };
  const token = signToken(env, safe);
  return { user: safe, token };
}

function signToken(
  env: Env,
  user: { id: string; email: string; role: Role }
): string {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
  const signOpts: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    issuer: "primetrade-assignment-api",
  };
  return jwt.sign(payload, env.JWT_SECRET, signOpts);
}
