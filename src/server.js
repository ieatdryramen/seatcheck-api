// SeatCheck API — Express entry point
import "dotenv/config";
import express from "express";
import cors from "cors";
import cron from "node-cron";

import { catalogRouter } from "./routes/catalog.js";
import { authRouter } from "./routes/auth.js";
import { childrenRouter } from "./routes/children.js";
import { savedSeatsRouter } from "./routes/savedSeats.js";
import { recallsRouter } from "./routes/recalls.js";
import { fitCheckRouter } from "./routes/fitCheck.js";
import { identifyRouter } from "./routes/identify.js";
import { installCheckRouter } from "./routes/installCheck.js";
import { syncRecalls } from "./services/recallSync.js";
import { errorHandler } from "./lib/errors.js";

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
// CORS: if CORS_ORIGIN is "*" (or unset) we reflect any origin so credentialed
// requests work. Otherwise only allow origins in the comma-separated list.
const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);
const allowAll = allowedOrigins.length === 0 || allowedOrigins.includes("*");

app.use(cors({
  origin: (origin, callback) => {
    // No origin header (curl, server-to-server) — allow
    if (!origin) return callback(null, true);
    if (allowAll) return callback(null, origin);
    if (allowedOrigins.includes(origin)) return callback(null, origin);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true
}));
app.use(express.json({ limit: "20mb" }));

// --- Health ---
app.get("/", (_req, res) => {
  res.json({ service: "seatcheck-api", version: "0.1.0", status: "ok" });
});
app.get("/health", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// --- Routes ---
app.use("/api/catalog", catalogRouter);
app.use("/api/auth", authRouter);
app.use("/api/children", childrenRouter);
app.use("/api/saved-seats", savedSeatsRouter);
app.use("/api/recalls", recallsRouter);
app.use("/api/fit-check", fitCheckRouter);
app.use("/api/identify", identifyRouter);
app.use("/api/check-install", installCheckRouter);

// --- Errors ---
app.use(errorHandler);

// --- Start ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(`SeatCheck API listening on 0.0.0.0:${PORT}`);
});

// --- Background jobs ---
// Sync NHTSA recalls every night at 3am UTC.
if (process.env.ENABLE_RECALL_CRON === "true") {
  cron.schedule("0 3 * * *", async () => {
    console.log("[cron] Running nightly NHTSA recall sync…");
    try {
      const result = await syncRecalls();
      console.log("[cron] Sync complete:", result);
    } catch (err) {
      console.error("[cron] Sync failed:", err);
    }
  });
  console.log("[cron] NHTSA recall sync scheduled for 03:00 UTC daily");
}
