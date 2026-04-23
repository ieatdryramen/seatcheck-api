import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { signToken, requireAuth } from "../lib/auth.js";
import { asyncHandler, AppError } from "../lib/errors.js";

export const authRouter = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().trim().min(1).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// POST /api/auth/signup
authRouter.post("/signup", asyncHandler(async (req, res) => {
  const { email, password, name } = signupSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) throw new AppError(409, "Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email: email.toLowerCase(), passwordHash, name },
    select: { id: true, email: true, name: true, createdAt: true }
  });

  const token = signToken(user.id);
  res.status(201).json({ user, token });
}));

// POST /api/auth/login
authRouter.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) throw new AppError(401, "Invalid email or password");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AppError(401, "Invalid email or password");

  const token = signToken(user.id);
  res.json({
    user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
    token
  });
}));

// GET /api/auth/me — current user + prefs
authRouter.get("/me", requireAuth, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true, email: true, name: true, createdAt: true,
      wantsRecallAlerts: true, wantsExpirationWarnings: true, wantsInstallTips: true
    }
  });
  if (!user) throw new AppError(404, "User not found");
  res.json({ user });
}));

// PATCH /api/auth/me — update profile + notification prefs
const patchMeSchema = z.object({
  name: z.string().trim().min(1).optional(),
  wantsRecallAlerts: z.boolean().optional(),
  wantsExpirationWarnings: z.boolean().optional(),
  wantsInstallTips: z.boolean().optional()
});
authRouter.patch("/me", requireAuth, asyncHandler(async (req, res) => {
  const data = patchMeSchema.parse(req.body);
  const user = await prisma.user.update({
    where: { id: req.userId },
    data,
    select: {
      id: true, email: true, name: true, createdAt: true,
      wantsRecallAlerts: true, wantsExpirationWarnings: true, wantsInstallTips: true
    }
  });
  res.json({ user });
}));
