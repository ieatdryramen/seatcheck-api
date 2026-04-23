import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../lib/auth.js";
import { asyncHandler, AppError } from "../lib/errors.js";

export const childrenRouter = Router();
childrenRouter.use(requireAuth);

const childSchema = z.object({
  name: z.string().trim().min(1),
  dob: z.string().datetime().optional().or(z.string().date().optional()),
  weightLb: z.number().positive().max(200).optional(),
  heightIn: z.number().positive().max(100).optional()
});

// GET /api/children
childrenRouter.get("/", asyncHandler(async (req, res) => {
  const children = await prisma.child.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "asc" }
  });
  res.json({ children });
}));

// POST /api/children
childrenRouter.post("/", asyncHandler(async (req, res) => {
  const data = childSchema.parse(req.body);
  const child = await prisma.child.create({
    data: {
      userId: req.userId,
      name: data.name,
      dob: data.dob ? new Date(data.dob) : null,
      weightLb: data.weightLb,
      heightIn: data.heightIn
    }
  });
  res.status(201).json({ child });
}));

// PATCH /api/children/:id
childrenRouter.patch("/:id", asyncHandler(async (req, res) => {
  const data = childSchema.partial().parse(req.body);
  // Confirm ownership
  const existing = await prisma.child.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.userId) throw new AppError(404, "Child not found");

  const child = await prisma.child.update({
    where: { id: req.params.id },
    data: {
      ...data,
      dob: data.dob ? new Date(data.dob) : undefined
    }
  });
  res.json({ child });
}));

// DELETE /api/children/:id
childrenRouter.delete("/:id", asyncHandler(async (req, res) => {
  const existing = await prisma.child.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.userId) throw new AppError(404, "Child not found");
  await prisma.child.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));
