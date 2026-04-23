import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, AppError } from "../lib/errors.js";

export const catalogRouter = Router();

// GET /api/catalog — list seats with filters
// Query params: type, brand, q (search), limit, offset
catalogRouter.get("/", asyncHandler(async (req, res) => {
  const { type, brand, q, limit = "50", offset = "0" } = req.query;

  const where = {};
  if (type && type !== "all") where.type = { contains: type, mode: "insensitive" };
  if (brand) where.brand = { equals: brand, mode: "insensitive" };
  if (q) {
    where.OR = [
      { brand: { contains: q, mode: "insensitive" } },
      { model: { contains: q, mode: "insensitive" } },
      { modelNumbers: { has: q } }
    ];
  }

  const [seats, total] = await Promise.all([
    prisma.carSeat.findMany({
      where,
      orderBy: [{ brand: "asc" }, { model: "asc" }],
      take: Math.min(parseInt(limit, 10) || 50, 200),
      skip: parseInt(offset, 10) || 0
    }),
    prisma.carSeat.count({ where })
  ]);

  res.json({ seats, total, limit: parseInt(limit, 10), offset: parseInt(offset, 10) });
}));

// GET /api/catalog/search?q=...
// More aggressive scoring for the search bar (prefix + model-number matches)
catalogRouter.get("/search", asyncHandler(async (req, res) => {
  const q = (req.query.q ?? "").trim().toLowerCase();
  if (!q) return res.json({ seats: [] });

  // Fetch candidates (Postgres full-text would be better at scale; this is fine <500 seats)
  const candidates = await prisma.carSeat.findMany({
    where: {
      OR: [
        { brand: { contains: q, mode: "insensitive" } },
        { model: { contains: q, mode: "insensitive" } },
        { modelNumbers: { has: q } }
      ]
    },
    take: 200
  });

  // Score matches like the frontend does — exact model number hits rank highest
  const scored = candidates.map(seat => {
    const haystack = `${seat.brand} ${seat.model} ${seat.type} ${seat.modelNumbers.join(" ")}`.toLowerCase();
    let score = 0;
    if (haystack.includes(q)) score += 10;
    q.split(/\s+/).forEach(t => {
      if (t.length >= 2 && haystack.includes(t)) score += 3;
    });
    if (seat.modelNumbers.some(mn => mn.toLowerCase().includes(q))) score += 20;
    return { seat, score };
  });
  scored.sort((a, b) => b.score - a.score);

  res.json({ seats: scored.map(s => s.seat) });
}));

// GET /api/catalog/:id — one seat, with recalls attached
catalogRouter.get("/:id", asyncHandler(async (req, res) => {
  const seat = await prisma.carSeat.findUnique({
    where: { id: req.params.id },
    include: {
      recalls: { orderBy: { datePublished: "desc" } }
    }
  });
  if (!seat) throw new AppError(404, "Seat not found");
  res.json(seat);
}));

// GET /api/catalog/meta/brands — distinct brand list for filters
catalogRouter.get("/meta/brands", asyncHandler(async (_req, res) => {
  const rows = await prisma.carSeat.findMany({
    select: { brand: true },
    distinct: ["brand"],
    orderBy: { brand: "asc" }
  });
  res.json({ brands: rows.map(r => r.brand) });
}));
