import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import type { Role } from "@prisma/client";

export async function listTasksForUser(userId: string, role: Role) {
  if (role === "ADMIN") {
    return prisma.task.findMany({
      orderBy: { updatedAt: "desc" },
      include: { user: { select: { id: true, email: true } } },
    });
  }
  return prisma.task.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getTaskById(
  id: string,
  userId: string,
  role: Role
) {
  const task = await prisma.task.findUnique({
    where: { id },
    include: role === "ADMIN" ? { user: { select: { id: true, email: true } } } : undefined,
  });
  if (!task) {
    throw new AppError(404, "Task not found", "NOT_FOUND");
  }
  if (role !== "ADMIN" && task.userId !== userId) {
    throw new AppError(403, "You cannot access this task", "FORBIDDEN");
  }
  return task;
}

export async function createTask(
  userId: string,
  data: { title: string; description?: string | null; completed?: boolean }
) {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      completed: data.completed ?? false,
      userId,
    },
  });
}

export async function updateTask(
  id: string,
  userId: string,
  role: Role,
  data: { title?: string; description?: string | null; completed?: boolean }
) {
  await assertCanModifyTask(id, userId, role);
  return prisma.task.update({
    where: { id },
    data,
  });
}

export async function deleteTask(id: string, userId: string, role: Role) {
  await assertCanModifyTask(id, userId, role);
  await prisma.task.delete({ where: { id } });
}

async function assertCanModifyTask(id: string, userId: string, role: Role) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    throw new AppError(404, "Task not found", "NOT_FOUND");
  }
  if (role !== "ADMIN" && task.userId !== userId) {
    throw new AppError(403, "You cannot modify this task", "FORBIDDEN");
  }
}
