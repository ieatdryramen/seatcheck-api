// Feedback routes
// ------------------------------------------------------------
// POST /api/feedback                 (public) submit feedback
// GET  /api/feedback                 (admin)  list feedback
// PATCH /api/feedback/:id            (admin)  update status/notes
//
// Admin routes require X-Admin-Token header in production.
// ------------------------------------------------------------

import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { optionalAuth } from "../lib/auth.js";
import { asyncHandler, AppError } from "../lib/errors.js";

export const feedbackRouter = Router();

const submitSchema = z.object({
  category: z.enum(["bug", "missing_seat", "wrong_info", "feature_request", "other"]),
  message: z.string().min(3).max(5000),
  screen: z.string().max(40).optional(),
  seatId: z.string().max(64).optional(),
  userAgent: z.string().max(500).optional(),
  viewport: z.string().max(40).optional(),
  contactEmail: z.string().email().max(200).optional()
});

feedbackRouter.post("/", optionalAuth, asyncHandler(async (req, res) => {
  const input = submitSchema.parse(req.body);
  const fb = await prisma.feedback.create({
    data: {
      ...input,
      userId: req.userId ?? null
    }
  });
  res.status(201).json({ ok: true, id: fb.id });
}));

function requireAdmin(req) {
  if (process.env.NODE_ENV === "production") {
    const token = req.headers["x-admin-token"];
    if (!token || token !== process.env.ADMIN_TOKEN) {
      throw new AppError(401, "Unauthorized");
    }
  }
}

feedbackRouter.get("/", asyncHandler(async (req, res) => {
  requireAdmin(req);
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const limit = Math.min(parseInt(req.query.limit) || 100, 500);
  const feedback = await prisma.feedback.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit
  });
  // Summary buckets
  const counts = await prisma.feedback.groupBy({
    by: ["status"],
    _count: { _all: true }
  });
  const summary = {
    total: feedback.length,
    byStatus: Object.fromEntries(counts.map(c => [c.status, c._count._all]))
  };
  res.json({ feedback, summary });
}));

const patchSchema = z.object({
  status: z.enum(["new", "triaged", "resolved", "dismissed"]).optional(),
  adminNotes: z.string().max(5000).nullable().optional()
});

feedbackRouter.patch("/:id", asyncHandler(async (req, res) => {
  requireAdmin(req);
  const patch = patchSchema.parse(req.body);
  const updates = { ...patch };
  if (patch.status === "resolved" || patch.status === "dismissed") {
    updates.resolvedAt = new Date();
  } else if (patch.status === "new" || patch.status === "triaged") {
    updates.resolvedAt = null;
  }
  try {
    const fb = await prisma.feedback.update({
      where: { id: req.params.id },
      data: updates
    });
    res.json({ feedback: fb });
  } catch (err) {
    throw new AppError(404, "Feedback not found");
  }
}));
