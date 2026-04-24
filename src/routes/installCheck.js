// POST /api/check-install
// -------------------------------------------------------------
// "Second look" install check powered by Claude Vision.
// Takes a photo + mode and returns structured observations a
// parent can use as a checklist while having a real CPST verify.
//
// Three modes:
//   - label           : read the label to identify the seat
//   - empty_install   : seat installed in a vehicle, no child
//   - harness_check   : child is strapped in
//
// IMPORTANT: The product is framed as a "second look" — every
// response repeats that users should verify with a CPST. This
// is non-negotiable for safety reasons and baked into the
// system prompt.
// -------------------------------------------------------------

import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { optionalAuth } from "../lib/auth.js";
import { asyncHandler, AppError } from "../lib/errors.js";

export const installCheckRouter = Router();

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// Max 10 MB image for Anthropic API; most phone photos are 2-5 MB.
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const checkSchema = z.object({
  mode: z.enum(["label", "empty_install", "harness_check"]),
  imageBase64: z.string().min(100),         // raw base64 without data-URL prefix
  mediaType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]).default("image/jpeg"),
  // Optional context — improves the check materially
  seatId: z.string().optional(),            // catalog seat if user identified it first
  childWeightLb: z.number().optional(),
  childHeightIn: z.number().optional(),
  childAgeMonths: z.number().optional()
});

// ============================================================
// Prompts — worded very carefully; these ARE the product.
// ============================================================

const BASE_SYSTEM = `You are a "second look" assistant for SeatCheck, a car seat app used by parents and childcare workers.

Your role is NOT to approve or certify an installation. Your role is to act like a pair of extra eyes — to flag things that LOOK concerning in a photo so the user can investigate further.

NON-NEGOTIABLE RULES:
1. You MUST NOT issue a pass/fail verdict. Never say "this is correct" or "this is safe."
2. You MUST always recommend verifying with a certified CPST (Child Passenger Safety Technician) in person.
3. You MUST state clearly when a photo is ambiguous or doesn't show enough to evaluate something.
4. You MUST be specific: say "the chest clip appears low, near the belly" not "chest clip wrong."
5. You MUST avoid false alarms — if a feature is not clearly visible or is ambiguous, say so rather than guessing.
6. You MUST respond in STRICT JSON matching the requested schema. No prose outside the JSON.

Your tone is calm, specific, and non-alarmist. You are a safety-literate friend looking over a shoulder, not an authority.`;

const MODE_PROMPTS = {
  label: `The user has uploaded a photo of a car seat label or sticker. Your job is to extract readable text that can help identify the seat.

Output JSON:
{
  "mode": "label",
  "extractedText": "<all legible text, normalized>",
  "likelyBrand": "<brand if visible, or null>",
  "likelyModel": "<model name if visible, or null>",
  "modelNumbers": ["<any serial/model/part numbers>"],
  "dateOfManufactureText": "<DOM text if visible, verbatim, or null>",
  "notes": ["<short observations about photo quality, legibility>"],
  "disclaimer": "Verify the identification with the printed label on your seat."
}`,

  empty_install: `The user has uploaded a photo of a car seat installed in a vehicle, with no child in it. Your job is to do a "second look" of the installation from what's visible.

Check for these things when visible:
- Which direction the seat faces (rear/forward)
- Whether LATCH connectors or vehicle seat belt is being used
- Whether the installation appears tight (seat doesn't obviously tilt or rock — though you can't test this from a photo)
- Recline angle — does it look reasonable for the facing direction?
- For forward-facing seats, is there a visible top tether routed to an anchor?
- Anything obviously wrong — belt routing through the wrong path, towels/pool noodles under the base (usually not allowed), a child already in the seat (user said there isn't)

Remember: you can only describe what's VISIBLE. You cannot feel tightness or test angles.

Output JSON:
{
  "mode": "empty_install",
  "whatISee": "<one-sentence description of the setup>",
  "observations": [
    { "feature": "<what you looked at>", "finding": "<what you see>", "concern": "low" | "medium" | "high" | "unclear" }
  ],
  "lookGood": ["<things that appear to be set up correctly>"],
  "worthChecking": ["<specific things the user should verify in-person>"],
  "cantTell": ["<things the photo doesn't show enough of>"],
  "nextSteps": ["<actionable suggestions, e.g. 'retake photo from above', 'check your vehicle manual for tether anchor location'>"],
  "disclaimer": "This is a 'second look' — not a certified check. Please have a CPST verify your installation. Find one at safekids.org or your local hospital/fire station."
}`,

  harness_check: `The user has uploaded a photo of a child strapped into a car seat. Your job is to do a "second look" at the harness from what's visible. BE ESPECIALLY CAREFUL HERE — mistakes in harness assessment can be dangerous.

Check for these when clearly visible:
- Chest clip height: should be at armpit level / across the chest, NOT on the belly and NOT at the neck
- Harness straps: should be smooth and flat against the body, not twisted
- Harness slot height: for rear-facing seats, straps should come from AT or BELOW the child's shoulders. For forward-facing, AT or ABOVE.
- Harness tightness: if bulky clothing (coats, puffy jackets) is visible between the child and harness, flag this — clothing compresses in a crash. You cannot do a pinch test from a photo, so say that.
- Anything obviously wrong: chest clip at belly, strap under armpit, child in wrong direction for size, obvious slack visible

Remember: you can't test harness tightness from a photo. Only mention tightness if something is VISIBLY loose (clearly gapping) or bulky clothing is visible.

Output JSON:
{
  "mode": "harness_check",
  "whatISee": "<one-sentence description of what the photo shows>",
  "observations": [
    { "feature": "<body part / harness component>", "finding": "<what you see>", "concern": "low" | "medium" | "high" | "unclear" }
  ],
  "lookGood": ["<things that appear correct>"],
  "worthChecking": ["<specific things to verify, e.g. 'pinch-test the harness at the collarbone'>"],
  "cantTell": ["<things the photo doesn't show enough of>"],
  "nextSteps": ["<actionable suggestions>"],
  "disclaimer": "Harness fit is tricky to assess from a photo. For any concern, have a certified CPST verify in person. If you see 'high' concerns listed above, do not drive until the seat is checked."
}`
};

function estimateBytes(base64) {
  return Math.floor(base64.length * 0.75);
}

installCheckRouter.post("/", optionalAuth, asyncHandler(async (req, res) => {
  if (!client) {
    throw new AppError(503, "Install check is not configured on this server. ANTHROPIC_API_KEY is missing.");
  }

  const input = checkSchema.parse(req.body);

  if (estimateBytes(input.imageBase64) > MAX_IMAGE_BYTES) {
    throw new AppError(413, "Image too large. Please use a photo under 10 MB.");
  }

  // Build context block if user provided seat/child details
  const context = [];
  if (input.seatId) context.push(`Known seat: ${input.seatId}`);
  if (input.childWeightLb) context.push(`Child weight: ${input.childWeightLb} lb`);
  if (input.childHeightIn) context.push(`Child height: ${input.childHeightIn} in`);
  if (input.childAgeMonths) context.push(`Child age: ${input.childAgeMonths} months`);
  const contextStr = context.length ? `\n\nContext from the user:\n${context.join("\n")}` : "";

  const userPrompt = MODE_PROMPTS[input.mode] + contextStr +
    "\n\nAnalyze the attached image and respond with ONLY the JSON object described above. No prose before or after.";

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 2000,
      system: BASE_SYSTEM,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: input.mediaType, data: input.imageBase64 }
          },
          { type: "text", text: userPrompt }
        ]
      }]
    });

    // Extract the text content
    const text = response.content.find(c => c.type === "text")?.text ?? "";

    // Strip any markdown code fences the model might emit
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      // If the model returned prose instead of JSON, wrap it for the client
      return res.json({
        mode: input.mode,
        error: "parse_failed",
        rawResponse: cleaned,
        disclaimer: "The assistant didn't return structured data. Have a CPST review this photo."
      });
    }

    res.json(parsed);
  } catch (err) {
    console.error("[check-install]", err);
    if (err.status === 400) {
      throw new AppError(400, err.message || "Image could not be analyzed. Try another photo.");
    }
    throw new AppError(502, "Vision service unavailable. Please try again shortly.");
  }
}));
