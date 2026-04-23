import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../lib/auth.js";
import { asyncHandler, AppError } from "../lib/errors.js";

export const fitCheckRouter = Router();

// Given a child's numeric weight/height, test a seat's modes.
// Each parsed mode has: { weightMin, weightMax, heightMax } (nullables allowed).
// A child "fits" a mode if every defined bound is satisfied.
const modeLabels = {
  rearFacing: "Rear-facing",
  forwardFacing: "Forward-facing",
  booster: "Booster",
  highbackBooster: "High-back booster",
  backlessBooster: "Backless booster"
};

function evaluateSeatForChild(seat, { weightLb, heightIn, ageMonths }) {
  const fittingModes = [];
  const nearMissModes = [];

  for (const [mode, spec] of Object.entries(seat.modes ?? {})) {
    // The seed writes parsed numeric bounds alongside the display strings.
    const {
      weightMin, weightMax, heightMax, ageMinMonths
    } = spec;

    const reasons = [];
    let fits = true;

    if (weightLb != null) {
      if (weightMin != null && weightLb < weightMin) {
        fits = false; reasons.push(`child is under ${weightMin} lb minimum`);
      }
      if (weightMax != null && weightLb > weightMax) {
        fits = false; reasons.push(`child is over ${weightMax} lb maximum`);
      }
    }
    if (heightIn != null && heightMax != null && heightIn > heightMax) {
      fits = false; reasons.push(`child is over ${heightMax}″ maximum`);
    }
    if (ageMonths != null && ageMinMonths != null && ageMonths < ageMinMonths) {
      fits = false; reasons.push(`child is under ${Math.round(ageMinMonths / 12)} years minimum`);
    }

    const entry = { mode, label: modeLabels[mode] ?? mode, display: spec, fits, reasons };
    if (fits) fittingModes.push(entry);
    else nearMissModes.push(entry);
  }

  return {
    seatId: seat.id,
    brand: seat.brand,
    model: seat.model,
    type: seat.type,
    fits: fittingModes.length > 0,
    fittingModes,
    nearMissModes
  };
}

function monthsBetween(a, b) {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}

// ============================================================
// POST /api/fit-check  — ad-hoc: pass child stats directly
// ============================================================
const adhocSchema = z.object({
  weightLb: z.number().positive().max(200).optional(),
  heightIn: z.number().positive().max(100).optional(),
  ageMonths: z.number().nonnegative().max(300).optional()
}).refine(v => v.weightLb != null || v.heightIn != null || v.ageMonths != null, {
  message: "Provide at least one of weightLb, heightIn, ageMonths"
});

fitCheckRouter.post("/", asyncHandler(async (req, res) => {
  const input = adhocSchema.parse(req.body);
  const seats = await prisma.carSeat.findMany({});
  const results = seats.map(seat => evaluateSeatForChild(seat, input));
  const fitting = results.filter(r => r.fits).sort(sortByBestFit);
  const notFitting = results.filter(r => !r.fits);
  res.json({ input, fitting, notFitting });
}));

// ============================================================
// GET /api/fit-check/child/:id — uses stored child record
// ============================================================
fitCheckRouter.get("/child/:id", requireAuth, asyncHandler(async (req, res) => {
  const child = await prisma.child.findUnique({ where: { id: req.params.id } });
  if (!child || child.userId !== req.userId) throw new AppError(404, "Child not found");

  const ageMonths = child.dob ? monthsBetween(child.dob, new Date()) : undefined;
  const input = {
    weightLb: child.weightLb ?? undefined,
    heightIn: child.heightIn ?? undefined,
    ageMonths
  };

  const seats = await prisma.carSeat.findMany({});
  const results = seats.map(seat => evaluateSeatForChild(seat, input));
  const fitting = results.filter(r => r.fits).sort(sortByBestFit);
  const notFitting = results.filter(r => !r.fits);

  res.json({ child, input, fitting, notFitting });
}));

// Prefer seats the child fits with more modes (more life left before outgrowing)
function sortByBestFit(a, b) {
  return b.fittingModes.length - a.fittingModes.length;
}
