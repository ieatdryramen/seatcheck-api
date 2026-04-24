import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { syncRecalls } from "../services/recallSync.js";
import { asyncHandler } from "../lib/errors.js";

export const recallsRouter = Router();

// GET /api/recalls — latest recalls across all seats (for a "what's new" feed)
recallsRouter.get("/", asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 30, 100);
  const recalls = await prisma.recall.findMany({
    orderBy: { datePublished: "desc" },
    take: limit,
    include: { carSeat: { select: { id: true, brand: true, model: true } } }
  });
  res.json({ recalls });
}));

// GET /api/recalls/for-seat/:carSeatId — recalls for one catalog seat
recallsRouter.get("/for-seat/:carSeatId", asyncHandler(async (req, res) => {
  const recalls = await prisma.recall.findMany({
    where: { carSeatId: req.params.carSeatId },
    orderBy: { datePublished: "desc" }
  });
  res.json({ recalls });
}));

// POST /api/recalls/sync — manually trigger NHTSA sync (protected in prod via ADMIN_TOKEN)
// Use ?full=true to force a full history resync (also re-links existing recalls to catalog seats)
recallsRouter.post("/sync", asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    const token = req.headers["x-admin-token"];
    if (!token || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }
  const full = req.query.full === "true";
  const result = await syncRecalls({ full });
  res.json(result);
}));
