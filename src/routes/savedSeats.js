import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../lib/auth.js";
import { asyncHandler, AppError } from "../lib/errors.js";

export const savedSeatsRouter = Router();
savedSeatsRouter.use(requireAuth);

const savedSchema = z.object({
  carSeatId: z.string(),
  nickname: z.string().trim().optional(),
  dateOfManufacture: z.string().datetime().or(z.string().date())
});

// GET /api/saved-seats — returns each saved seat with its catalog entry, expiration, and any recalls
savedSeatsRouter.get("/", asyncHandler(async (req, res) => {
  const saved = await prisma.savedSeat.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "asc" },
    include: {
      carSeat: {
        include: {
          recalls: { orderBy: { datePublished: "desc" }, take: 5 }
        }
      }
    }
  });

  // Compute expiration status + recall flag server-side so the client is dumb
  const enriched = saved.map(s => {
    const expiresAt = new Date(s.dateOfManufacture);
    expiresAt.setFullYear(expiresAt.getFullYear() + s.carSeat.expirationYears);
    const monthsLeft = (expiresAt - Date.now()) / (1000 * 60 * 60 * 24 * 30.44);
    const expirationStatus =
      monthsLeft < 0 ? "expired" :
      monthsLeft < 12 ? "expiring_soon" :
      "ok";

    return {
      ...s,
      expiresAt,
      expirationStatus,
      hasOpenRecall: s.carSeat.recalls.length > 0
    };
  });

  res.json({ savedSeats: enriched });
}));

// POST /api/saved-seats — register a seat
savedSeatsRouter.post("/", asyncHandler(async (req, res) => {
  const data = savedSchema.parse(req.body);

  const seat = await prisma.carSeat.findUnique({ where: { id: data.carSeatId } });
  if (!seat) throw new AppError(404, "Car seat not found in catalog");

  const saved = await prisma.savedSeat.upsert({
    where: { userId_carSeatId: { userId: req.userId, carSeatId: data.carSeatId } },
    update: {
      nickname: data.nickname,
      dateOfManufacture: new Date(data.dateOfManufacture)
    },
    create: {
      userId: req.userId,
      carSeatId: data.carSeatId,
      nickname: data.nickname,
      dateOfManufacture: new Date(data.dateOfManufacture)
    },
    include: { carSeat: true }
  });

  res.status(201).json({ savedSeat: saved });
}));

// DELETE /api/saved-seats/:id
savedSeatsRouter.delete("/:id", asyncHandler(async (req, res) => {
  const existing = await prisma.savedSeat.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.userId) throw new AppError(404, "Saved seat not found");
  await prisma.savedSeat.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));
