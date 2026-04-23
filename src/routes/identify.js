import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { optionalAuth } from "../lib/auth.js";
import { asyncHandler } from "../lib/errors.js";

export const identifyRouter = Router();

// The photo-ID feature is phase 4 — for now this endpoint accepts an optional
// OCR text hint (which the phone can extract on-device using Apple Vision or
// ML Kit) and returns candidate seats by scoring brand+model+modelNumber matches
// against the OCR text.
//
// When we add a real vision model, we'll:
//  1. Accept an image upload (multipart or base64)
//  2. Store it in object storage (Railway volume or S3)
//  3. Run CLIP to get an embedding
//  4. Query pgvector for the nearest N catalog seats
//  5. Combine visual score + OCR score → ranked candidates

const identifySchema = z.object({
  ocrText: z.string().optional(),
  imageBase64: z.string().optional()   // accepted but ignored for now
}).refine(v => v.ocrText || v.imageBase64, {
  message: "Provide at least ocrText or imageBase64"
});

identifyRouter.post("/", optionalAuth, asyncHandler(async (req, res) => {
  const { ocrText = "" } = identifySchema.parse(req.body);

  const normalized = ocrText.toLowerCase();
  const seats = await prisma.carSeat.findMany({});
  const scored = seats.map(seat => {
    const haystack = `${seat.brand} ${seat.model} ${seat.modelNumbers.join(" ")}`.toLowerCase();
    let score = 0;

    // Exact model-number hits dominate — those are the "PD348857A"-style codes
    seat.modelNumbers.forEach(mn => {
      if (normalized.includes(mn.toLowerCase())) score += 50;
    });
    // Brand + model hits
    if (normalized.includes(seat.brand.toLowerCase())) score += 10;
    if (normalized.includes(seat.model.toLowerCase())) score += 15;
    // Partial token matches
    for (const token of haystack.split(/\s+/)) {
      if (token.length >= 3 && normalized.includes(token)) score += 2;
    }
    return { seat, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter(s => s.score > 0).slice(0, 3);

  const candidates = top.map((s, i) => ({
    seat: s.seat,
    // Soft confidence from score — real vision model will replace this
    confidence: Math.min(0.98, s.score / (top[0]?.score || 1)) * (i === 0 ? 1 : 0.7 - i * 0.1)
  }));

  res.json({
    candidates,
    method: "ocr-only",
    note: "Visual recognition pending. Currently matches OCR text against the catalog."
  });
}));
