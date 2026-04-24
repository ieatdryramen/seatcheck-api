// NHTSA recall sync
// --------------------------------------------------------------
// Source: data.transportation.gov Socrata dataset `6axg-epim`
// (NHTSA Office of Defects Investigation recalls, updated daily).
//
// Strategy:
//   1. Fetch child-seat recalls (component contains "CHILD SEAT" or
//      product_type = "Child Seat") that are newer than our last sync.
//   2. Upsert each by the NHTSA campaign id (stable primary key).
//   3. Fuzzy-match the recall's manufacturer + product name against
//      our catalog to link Recall.carSeatId where we can. Unmatched
//      recalls still get stored (carSeatId null) so they show up in
//      the general feed.
// --------------------------------------------------------------

import "dotenv/config";
import { prisma } from "../lib/prisma.js";

const SOCRATA_ENDPOINT = "https://data.transportation.gov/resource/6axg-epim.json";
const APP_TOKEN = process.env.SOCRATA_APP_TOKEN; // optional — higher rate limits if set
const PAGE_SIZE = 1000;

function normalize(s) {
  return (s ?? "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

// Score how well a recall row matches a catalog seat.
function matchScore(recall, seat) {
  const mfr = normalize(recall.manufacturer);
  const name = normalize(recall.subject ?? recall.product_description ?? recall.component);
  const brand = normalize(seat.brand);
  const model = normalize(seat.model);
  const modelNumbers = (seat.modelNumbers ?? []).map(normalize);

  let score = 0;

  // Brand hit — required signal
  if (mfr.includes(brand) || name.includes(brand)) score += 10;

  // Model hit
  if (name.includes(model)) score += 20;

  // Model words (helps with multi-word model names like "4Ever DLX")
  const modelTokens = model.split(" ").filter(t => t.length >= 3);
  modelTokens.forEach(t => { if (name.includes(t)) score += 3; });

  // Model number exact hit — strongest signal
  modelNumbers.forEach(mn => { if (mn && name.includes(mn)) score += 40; });

  return score;
}

async function fetchRecalls({ since }) {
  const headers = {};
  if (APP_TOKEN) headers["X-App-Token"] = APP_TOKEN;

  // Filter server-side. recall_type='Child Seat' captures actual child-seat
  // product recalls (not vehicle recalls that happen to mention child seats).
  let whereClause = `recall_type='Child Seat'`;
  if (since) {
    const iso = new Date(since).toISOString().split("T")[0];
    whereClause += ` AND report_received_date > '${iso}'`;
  }

  const results = [];
  let offset = 0;
  // Paginate defensively in case someone re-runs this against years of history
  for (let page = 0; page < 20; page++) {
    const url = `${SOCRATA_ENDPOINT}?$where=${encodeURIComponent(whereClause)}&$order=report_received_date DESC&$limit=${PAGE_SIZE}&$offset=${offset}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`NHTSA fetch failed: ${res.status} ${res.statusText}`);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    results.push(...batch);
    if (batch.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return results;
}

export async function syncRecalls({ full = false } = {}) {
  const startedAt = new Date();

  // Default to "since most recent recall in our DB" so nightly syncs are cheap.
  let since = null;
  if (!full) {
    const latest = await prisma.recall.findFirst({
      orderBy: { datePublished: "desc" },
      select: { datePublished: true }
    });
    // Go back a few days to catch late-entered records
    if (latest) {
      const dt = new Date(latest.datePublished);
      dt.setDate(dt.getDate() - 7);
      since = dt;
    }
  }

  console.log(`[recallSync] Fetching recalls${since ? ` since ${since.toISOString().slice(0,10)}` : " (full history)"}…`);
  const rows = await fetchRecalls({ since });
  console.log(`[recallSync] Got ${rows.length} rows from NHTSA`);

  const seats = await prisma.carSeat.findMany({});
  let upsertedCount = 0;
  let matchedCount = 0;

  for (const row of rows) {
    const nhtsaId = row.nhtsa_id ?? row.nhtsa_campaign_number ?? row.campaign_number;
    if (!nhtsaId) continue;

    // Try to match this recall to a catalog seat
    let bestSeat = null;
    let bestScore = 0;
    for (const seat of seats) {
      const s = matchScore(row, seat);
      if (s > bestScore) { bestScore = s; bestSeat = seat; }
    }
    // Require at least a brand+model signal to link
    const linkedSeatId = bestScore >= 25 ? bestSeat.id : null;
    if (linkedSeatId) matchedCount++;

    const datePublished = row.report_received_date
      ? new Date(row.report_received_date)
      : new Date();

    const payload = {
      carSeatId: linkedSeatId,
      manufacturer: row.manufacturer ?? "Unknown",
      productName: row.subject ?? row.product_description ?? "Unknown product",
      componentDesc: row.component ?? null,
      summary: row.defect_summary ?? row.consequence_summary ?? row.summary ?? "",
      remedy: row.corrective_action ?? row.remedy ?? null,
      datePublished,
      affectedUnitsText: row.potentially_affected
        ? String(row.potentially_affected)
        : (row.potential_units_affected ? String(row.potential_units_affected) : null),
      rawPayload: row
    };

    await prisma.recall.upsert({
      where: { nhtsaId },
      update: payload,
      create: { nhtsaId, ...payload }
    });
    upsertedCount++;
  }

  // Stamp all currently-saved seats so users see "checked recently"
  await prisma.savedSeat.updateMany({
    data: { lastRecallCheckAt: new Date() }
  });

  const durationMs = Date.now() - startedAt.getTime();
  const result = {
    fetched: rows.length,
    upserted: upsertedCount,
    matchedToCatalog: matchedCount,
    durationMs,
    since: since?.toISOString() ?? null
  };
  console.log(`[recallSync] Done:`, result);
  return result;
}

// Run directly with `node src/services/recallSync.js` or `npm run recall:sync`
if (import.meta.url === `file://${process.argv[1]}`) {
  const full = process.argv.includes("--full");
  syncRecalls({ full })
    .then(r => { console.log(r); process.exit(0); })
    .catch(err => { console.error(err); process.exit(1); });
}
