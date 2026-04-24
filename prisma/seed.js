// Seeds the catalog with 60 real seats.
// Each mode carries both display strings AND parsed numeric bounds:
//   { weight: "4–35 lb", height: "up to 32″",
//     weightMin: 4, weightMax: 35, heightMax: 32, ageMinMonths: 0 }
// Fit-check reads the numeric fields; the UI reads the strings.

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper to build a mode with numeric + display fields together
const M = (display, { wMin, wMax, hMax, ageMin } = {}) => ({
  ...display,
  weightMin: wMin ?? null,
  weightMax: wMax ?? null,
  heightMax: hMax ?? null,
  ageMinMonths: ageMin ?? null
});

const SITES = {
  graco: "gracobaby.com", chicco: "chiccousa.com", britax: "us.britax.com",
  evenflo: "evenflo.com", safety1st: "safety1st.com", cybex: "cybex-online.com",
  nuna: "nunababy.com", maxicosi: "maxicosi.com", clek: "clekinc.com",
  diono: "diono.com", cosco: "coscokids.com", uppababy: "uppababy.com",
  peg: "pegperego.com"
};

const CATALOG = [
  // ========== INFANT ==========
  {
    id: "chicco-keyfit-35", brand: "Chicco", model: "KeyFit 35", type: "Infant",
    modelNumbers: ["04079828", "05079828"], msrp: "$259", year: 2020, color: "#8b2332", site: SITES.chicco,
    productUrl: "https://www.chiccousa.com/shop-our-products/car-seats/infant/keyfit-35-cleartex-infant-car-seat/79737.html",
    modes: {
      rearFacing: M({ weight: "4–35 lb", height: "up to 32″" }, { wMin: 4, wMax: 35, hMax: 32 })
    },
    expirationYears: 6, faaApproved: true, latchWeightMax: "35 lb",
    dimensions: "27″ D × 17″ W × 24″ H", seatWeight: "10 lb carrier / 7 lb base",
    installSteps: [
      { title: "Install the base first", body: "LATCH or seat belt. Integrated lock-off holds the belt." },
      { title: "Level the base", body: "ReclineSure foot + both bubble levels in target zones." },
      { title: "Tighten with SuperCinch", body: "Less than 1″ movement at the belt path." },
      { title: "Click in the carrier", body: "One solid click. Pull up to confirm." },
      { title: "Newborn positioner", body: "Required for 4–11 lb; remove after 11 lb." }
    ],
    commonMistakes: ["Forgetting to remove the newborn positioner after 11 lb", "Using the KeyFit 35 carrier on a KeyFit 30 base", "Handle not locked while carrying"],
    notes: "Integrated anti-rebound bar. Top-rated for install ease."
  },
  {
    id: "chicco-keyfit-30", brand: "Chicco", model: "KeyFit 30", type: "Infant",
    modelNumbers: ["04061472", "05061472"], msrp: "$219", year: 2008, color: "#a83241", site: SITES.chicco,
    productUrl: "https://www.chiccousa.com/shop-our-products/car-seats/infant/",
    modes: { rearFacing: M({ weight: "4–30 lb", height: "up to 30″" }, { wMin: 4, wMax: 30, hMax: 30 }) },
    expirationYears: 6, faaApproved: true, latchWeightMax: "30 lb",
    dimensions: "25.5″ D × 17″ W × 24″ H", seatWeight: "9.5 lb carrier / 7 lb base",
    installSteps: [
      { title: "LATCH or seat belt", body: "Both safe. LATCH auto-locks; base has belt lock-off." },
      { title: "Level the base", body: "ReclineSure foot + both bubble levels must be in range." },
      { title: "SuperCinch tightener", body: "Pull the tail with force-multiplying leverage." },
      { title: "Click in the carrier", body: "One solid click; tug up to verify." },
      { title: "Remove infant insert at 11 lb", body: "Positioner is for newborns only." }
    ],
    commonMistakes: ["Keeping infant insert past 11 lb", "LATCH cord dangling (use storage pockets)", "Skipping level re-check after cover removal"],
    notes: "Industry workhorse for over a decade."
  },
  {
    id: "graco-snugride-snuglock-35", brand: "Graco", model: "SnugRide SnugLock 35", type: "Infant",
    modelNumbers: ["1963477", "1963478"], msrp: "$179", year: 2017, color: "#3a3a5f", site: SITES.graco,
    productUrl: "https://www.gracobaby.com/shop/car-seats/infant-car-seats/",
    modes: { rearFacing: M({ weight: "4–35 lb", height: "up to 32″" }, { wMin: 4, wMax: 35, hMax: 32 }) },
    expirationYears: 7, faaApproved: true, latchWeightMax: "35 lb",
    dimensions: "26″ D × 17″ W × 23.5″ H", seatWeight: "8 lb carrier / 8 lb base",
    installSteps: [
      { title: "Choose install mode", body: "SnugLock lock-off or LATCH. SnugLock is hassle-free." },
      { title: "Thread the belt", body: "No over-tightening needed." },
      { title: "Close the SnugLock arm", body: "Push down until it latches — locks the belt." },
      { title: "Level the base", body: "Level line parallel with ground." },
      { title: "Click in the carrier", body: "Listen for the click; pull up to confirm." }
    ],
    commonMistakes: ["Skipping recline adjustment for reclined vehicle seats", "Handle unlocked when carrying", "Using carrier on a non-SnugLock base"],
    notes: "Among the easiest belt-path installs on the market."
  },
  {
    id: "cybex-cloud-g-lux", brand: "Cybex", model: "Cloud G Lux", type: "Infant",
    modelNumbers: ["520004415", "520004416"], msrp: "$499", year: 2022, color: "#1a1a1a", site: SITES.cybex,
    productUrl: "https://www.cybex-online.com/en/us/gold-cloud-g-lux.html",
    modes: { rearFacing: M({ weight: "4–35 lb", height: "up to 35″" }, { wMin: 4, wMax: 35, hMax: 35 }) },
    expirationYears: 7, faaApproved: true, latchWeightMax: "35 lb",
    dimensions: "26″ D × 17.3″ W × 23.6″ H", seatWeight: "11 lb carrier / 12 lb base",
    installSteps: [
      { title: "Extend the load leg", body: "Indicator must show green." },
      { title: "LATCH or belt install", body: "Ratcheting connectors; green indicator when tight." },
      { title: "Set load leg length", body: "Foot on vehicle floor — not on a storage compartment." },
      { title: "Lie-flat is stroller-only", body: "Never use flat while driving." },
      { title: "Click carrier into base", body: "Green indicator on carrier confirms." }
    ],
    commonMistakes: ["Load leg on a storage door", "Using lie-flat mode while driving", "Skipping registration for recall alerts"],
    notes: "Load leg + lie-flat stroller mode. Premium end."
  },
  {
    id: "nuna-pipa-rx", brand: "Nuna", model: "Pipa RX", type: "Infant",
    modelNumbers: ["CS18106GLBUS", "CS18106GLVUS"], msrp: "$550", year: 2023, color: "#2d4a3d", site: SITES.nuna,
    productUrl: "https://nunababy.com/usa/car-seats",
    modes: { rearFacing: M({ weight: "4–32 lb", height: "up to 32″" }, { wMin: 4, wMax: 32, hMax: 32 }) },
    expirationYears: 7, faaApproved: true, latchWeightMax: "32 lb",
    dimensions: "28″ D × 17″ W × 23″ H", seatWeight: "9.5 lb carrier / 15 lb base",
    installSteps: [
      { title: "Attach RELX base", body: "Rigid LATCH — push until it clicks." },
      { title: "Deploy load leg", body: "Extend until firm on floor; green indicator." },
      { title: "Check level", body: "Dynamic stability indicator across 3 lights." },
      { title: "Click in carrier", body: "Upward tug to verify." },
      { title: "Belt install option", body: "European-style belt routing on the carrier." }
    ],
    commonMistakes: ["Skipping the load leg", "Using center seat without LATCH", "Missing harness height adjustment"],
    notes: "Rigid LATCH + load leg. Frequent top pick."
  },
  {
    id: "uppababy-mesa-v2", brand: "UPPAbaby", model: "Mesa V2", type: "Infant",
    modelNumbers: ["1019-MSA", "1021-MSA"], msrp: "$349", year: 2022, color: "#2a3a5a", site: SITES.uppababy,
    productUrl: "https://uppababy.com/car-seats/",
    modes: { rearFacing: M({ weight: "4–35 lb", height: "up to 32″" }, { wMin: 4, wMax: 35, hMax: 32 }) },
    expirationYears: 7, faaApproved: true, latchWeightMax: "35 lb",
    dimensions: "28″ D × 17″ W × 25″ H", seatWeight: "9.9 lb carrier / 9 lb base",
    installSteps: [
      { title: "Auto-retracting LATCH", body: "Pull red release; connectors ratchet automatically." },
      { title: "SmartSecure indicator", body: "Green means tight enough." },
      { title: "Adjust the foot", body: "4-position base foot." },
      { title: "Click in carrier", body: "Straight down, firm click." },
      { title: "No-rethread harness", body: "Squeeze button behind headrest." }
    ],
    commonMistakes: ["Not checking SmartSecure before driving", "Old Mesa base with V2 carrier", "Missed harness adjustment"],
    notes: "Self-tightening LATCH. Very easy to install correctly."
  },
  {
    id: "maxicosi-mico-max-plus", brand: "Maxi-Cosi", model: "Mico Max Plus", type: "Infant",
    modelNumbers: ["IC236ETG", "IC236ETA"], msrp: "$249", year: 2019, color: "#4a4a2a", site: SITES.maxicosi,
    productUrl: "https://www.maxicosi.com/us-en/",
    modes: { rearFacing: M({ weight: "4–30 lb", height: "up to 32″" }, { wMin: 4, wMax: 30, hMax: 32 }) },
    expirationYears: 10, faaApproved: true, latchWeightMax: "30 lb",
    dimensions: "28″ D × 17.5″ W × 23.75″ H", seatWeight: "9.6 lb carrier / 8 lb base",
    installSteps: [
      { title: "Install the base", body: "LATCH or seat belt with lock-off." },
      { title: "Moisture-wicking fabric", body: "Installs the same regardless." },
      { title: "Level indicator", body: "Single-line indicator on side." },
      { title: "Click in carrier", body: "Listen for click; flush with base." },
      { title: "Side-impact cushions", body: "Air Protect cushions adjust with the headrest." }
    ],
    commonMistakes: ["Skipping infant insert under 12 lb", "Ignoring level indicator", "Missing registration"],
    notes: "Lightweight carrier. Good for frequent in-and-out use."
  },
  {
    id: "peg-perego-primo-viaggio", brand: "Peg Perego", model: "Primo Viaggio 4-35 Nido", type: "Infant",
    modelNumbers: ["IMUN000000BA53RO54"], msrp: "$399", year: 2020, color: "#4a2a2a", site: SITES.peg,
    productUrl: "https://www.pegperego.com/",
    modes: { rearFacing: M({ weight: "4–35 lb", height: "up to 32″" }, { wMin: 4, wMax: 35, hMax: 32 }) },
    expirationYears: 7, faaApproved: true, latchWeightMax: "35 lb",
    dimensions: "29″ D × 17″ W × 25″ H", seatWeight: "11 lb carrier / 11.5 lb base",
    installSteps: [
      { title: "Base with RIGID-LATCH", body: "Metal hooks clamp to anchors." },
      { title: "Deploy kickstand base", body: "4 positions — match to vehicle recline." },
      { title: "Push until green", body: "Indicator turns green when correct." },
      { title: "Click in carrier", body: "Carrier-to-base indicator on side." },
      { title: "Anti-rebound bar", body: "Integrated into the base." }
    ],
    commonMistakes: ["Baseless install without European routing", "Not switching indicator to green", "Missing recall registration"],
    notes: "Rigid LATCH + anti-rebound bar. Italian design."
  },

  // ========== CONVERTIBLE / ALL-IN-ONE ==========
  {
    id: "graco-extend2fit", brand: "Graco", model: "Extend2Fit Convertible", type: "Convertible",
    modelNumbers: ["1963179", "1963181", "1969046"], msrp: "$199", year: 2014, color: "#1f3a5f", site: SITES.graco,
    productUrl: "https://www.gracobaby.com/shop/car-seats/toddler-car-seats/convertible-car-seats/extend2fit-convertible-car-seat/SP_93668.html",
    modes: {
      rearFacing: M({ weight: "4–50 lb", height: "head at least 1″ below handle" }, { wMin: 4, wMax: 50, hMax: 49 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 24 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "45 lb",
    dimensions: "21.5″ D × 19.5″ W × 23.5″ H", seatWeight: "19.3 lb",
    installSteps: [
      { title: "Choose install method", body: "LATCH up to 45 lb child; over 45 lb → seat belt." },
      { title: "Set the recline", body: "4-position rear; upright for forward. Match indicator." },
      { title: "Route the belt", body: "Blue for rear; red for forward. Always use top tether forward-facing." },
      { title: "Inch test", body: "Seat should not move more than 1″ at the belt path." },
      { title: "Pinch-test the harness", body: "Snug at collarbone. No pinchable slack." }
    ],
    commonMistakes: ["Extension panel forward-facing (not permitted)", "LATCH over 45 lb child", "Skipping top tether forward-facing"],
    notes: "50 lb rear-facing — among the highest available."
  },
  {
    id: "britax-marathon-clicktight", brand: "Britax", model: "Marathon ClickTight", type: "Convertible",
    modelNumbers: ["E9LY45Q", "E9LY46A"], msrp: "$329", year: 2015, color: "#2a4a3a", site: SITES.britax,
    productUrl: "https://us.britax.com/shop/retired/britax-marathon-clicktight-convertible-car-seat",
    modes: {
      rearFacing: M({ weight: "5–40 lb", height: "up to 49″" }, { wMin: 5, wMax: 40, hMax: 49 }),
      forwardFacing: M({ weight: "20–65 lb", height: "up to 49″" }, { wMin: 20, wMax: 65, hMax: 49, ageMin: 24 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "32 lb rear / 40 lb forward",
    dimensions: "23″ D × 20.5″ W × 23.5″ H", seatWeight: "27 lb",
    installSteps: [
      { title: "Open ClickTight", body: "Lift pad; pull handle forward." },
      { title: "Route belt", body: "Correct path; buckle it. No tightening needed." },
      { title: "Close ClickTight", body: "Firm push until it clicks — install complete." },
      { title: "V-strap rear-facing", body: "To lower anchors for rebound." },
      { title: "Top tether forward-facing", body: "Always." }
    ],
    commonMistakes: ["Over-tightening belt before closing", "Skipping V-strap rear-facing", "Not re-verifying after long trips"],
    notes: "ClickTight makes correct install nearly foolproof."
  },
  {
    id: "britax-one4life", brand: "Britax", model: "One4Life ClickTight", type: "All-in-One",
    modelNumbers: ["E1C186Q", "E1C185R"], msrp: "$379", year: 2020, color: "#2a4a3a", site: SITES.britax,
    productUrl: "https://us.britax.com/shop/car-seats/one4life-clicktight-all-in-one-car-seat",
    modes: {
      rearFacing: M({ weight: "5–50 lb", height: "up to 49″" }, { wMin: 5, wMax: 50, hMax: 49 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 24 }),
      booster: M({ weight: "40–120 lb", height: "44–63″" }, { wMin: 40, wMax: 120, hMax: 63, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "35 lb rear / 40 lb forward",
    dimensions: "23″ D × 20.5″ W × 23.5″ H", seatWeight: "28.4 lb",
    installSteps: [
      { title: "Open ClickTight", body: "Lift seat pad; pull handle forward." },
      { title: "Thread seat belt", body: "Correct path for mode; buckle it." },
      { title: "Close ClickTight", body: "Firm push until it clicks. No yanking." },
      { title: "V-strap rear-facing", body: "To lower anchors." },
      { title: "Top tether forward-facing", body: "Always." }
    ],
    commonMistakes: ["Tightening belt before closing", "V-strap skipped rear-facing", "Booster with child who won't sit properly"],
    notes: "Machine-wash cover without uninstalling. Newborn to ~10 years."
  },
  {
    id: "graco-4ever-dlx", brand: "Graco", model: "4Ever DLX", type: "All-in-One",
    modelNumbers: ["2003565", "2003566"], msrp: "$329", year: 2019, color: "#3d2f5f", site: SITES.graco,
    productUrl: "https://www.gracobaby.com/shop/car-seats/toddler-car-seats/all-in-one-car-seats/4ever-dlx-4-in-1-car-seat/SP_155249.html",
    modes: {
      rearFacing: M({ weight: "4–40 lb", height: "up to 40″" }, { wMin: 4, wMax: 40, hMax: 40 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 24 }),
      highbackBooster: M({ weight: "40–100 lb", height: "43–57″" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 }),
      backlessBooster: M({ weight: "40–120 lb", height: "43–57″" }, { wMin: 40, wMax: 120, hMax: 57, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "45 lb",
    dimensions: "21.5″ D × 19″ W × 24″ H", seatWeight: "23 lb",
    installSteps: [
      { title: "Identify belt path", body: "Rear: blue. Forward: red (behind pad)." },
      { title: "InRight LATCH or belt", body: "Push-button LATCH clicks. Belt uses built-in lock-off." },
      { title: "Use level indicator", body: "Must match child's weight range." },
      { title: "Top tether forward-facing", body: "Always. Check vehicle manual." },
      { title: "No-rethread harness", body: "Button at headrest adjusts height." }
    ],
    commonMistakes: ["Harness covers off forward-facing (required)", "Wrong headrest height for shoulder", "Skipping top tether"],
    notes: "4-in-1. Good value for single seat newborn to ~10."
  },
  {
    id: "evenflo-revolve360", brand: "Evenflo", model: "Revolve360 Extend", type: "Convertible (Rotating)",
    modelNumbers: ["39212471", "39212472"], msrp: "$449", year: 2021, color: "#4a3a2a", site: SITES.evenflo,
    productUrl: "https://www.evenflo.com/shop/",
    modes: {
      rearFacing: M({ weight: "4–50 lb", height: "up to 49″" }, { wMin: 4, wMax: 50, hMax: 49 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 24 }),
      booster: M({ weight: "40–120 lb", height: "44–57″" }, { wMin: 40, wMax: 120, hMax: 57, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: false, latchWeightMax: "35 lb rear / 40 lb forward",
    dimensions: "24″ D × 20.5″ W × 26″ H", seatWeight: "30 lb",
    installSteps: [
      { title: "SensorSafe setup", body: "Pair receiver with key fob." },
      { title: "Install the base", body: "Rigid LATCH rear; traditional LATCH forward." },
      { title: "Level indicator", body: "Adjusts per mode." },
      { title: "Rotate to load", body: "Press side button, turn 90° toward door." },
      { title: "Lock before driving", body: "Must be rear- or forward-facing. Never drive sideways." }
    ],
    commonMistakes: ["Driving with seat rotated sideways", "Ignoring SensorSafe chime", "Bringing on plane (not FAA-approved)"],
    notes: "Rotating base makes loading much easier. Heavy (30 lb)."
  },
  {
    id: "safety1st-grow-and-go", brand: "Safety 1st", model: "Grow and Go All-in-One", type: "All-in-One",
    modelNumbers: ["CC138", "CC198"], msrp: "$199", year: 2018, color: "#2a5f7a", site: SITES.safety1st,
    productUrl: "https://www.safety1st.com/",
    modes: {
      rearFacing: M({ weight: "5–40 lb", height: "up to 40″" }, { wMin: 5, wMax: 40, hMax: 40 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 24 }),
      booster: M({ weight: "40–100 lb", height: "43–52″" }, { wMin: 40, wMax: 100, hMax: 52, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "35 lb rear / 40 lb forward",
    dimensions: "19″ D × 19″ W × 23.5″ H", seatWeight: "17.6 lb",
    installSteps: [
      { title: "Route LATCH strap", body: "From storage; attach; tighten." },
      { title: "Or seat belt", body: "Blue rear, red forward." },
      { title: "Check level line", body: "Parallel with ground rear-facing." },
      { title: "Top tether forward-facing", body: "Always." },
      { title: "Adjust harness height", body: "Rear: at/below shoulders. Forward: at/above." }
    ],
    commonMistakes: ["LATCH not tight (< 1″ movement)", "Wrong belt path", "Harness height wrong after mode change"],
    notes: "Budget all-in-one. Narrower for 3-across."
  },
  {
    id: "diono-radian-3rxt", brand: "Diono", model: "Radian 3RXT", type: "All-in-One",
    modelNumbers: ["50610", "50620"], msrp: "$369", year: 2019, color: "#3a2a4a", site: SITES.diono,
    productUrl: "https://diono.com/",
    modes: {
      rearFacing: M({ weight: "5–50 lb", height: "up to 44″" }, { wMin: 5, wMax: 50, hMax: 44 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 57″" }, { wMin: 22, wMax: 65, hMax: 57, ageMin: 24 }),
      booster: M({ weight: "50–120 lb", height: "up to 57″" }, { wMin: 50, wMax: 120, hMax: 57, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "35 lb rear / 40 lb forward",
    dimensions: "17″ D × 17″ W × 29″ H", seatWeight: "29 lb",
    installSteps: [
      { title: "Choose mode", body: "Rear, forward, or booster — no disassembly." },
      { title: "Thread belt or LATCH", body: "Correct path per mode. Rigid steel frame." },
      { title: "Angle adjuster rear-facing", body: "Tuck under base for recline if needed." },
      { title: "Install tight", body: "Push down while tightening to compress seat cushion." },
      { title: "Top tether forward-facing", body: "Always; height demands a reliable anchor." }
    ],
    commonMistakes: ["Underestimating 29 lb weight for trips", "Fit issues in shorter vehicles (29″ H)", "Forgetting angle wedge on mode change"],
    notes: "Steel frame. Famous for 3-across fit."
  },
  {
    id: "clek-foonf", brand: "Clek", model: "Foonf", type: "Convertible",
    modelNumbers: ["FO23U2-BK", "FO23U2-HR"], msrp: "$579", year: 2012, color: "#1a1a1a", site: SITES.clek,
    productUrl: "https://clekinc.com/collections/car-seats",
    modes: {
      rearFacing: M({ weight: "14–50 lb", height: "25–43″" }, { wMin: 14, wMax: 50, hMax: 43 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 24 })
    },
    expirationYears: 9, faaApproved: true, latchWeightMax: "48 lb",
    dimensions: "18.5″ D × 17″ W × 28″ H", seatWeight: "38 lb",
    installSteps: [
      { title: "Rigid LATCH forward-facing", body: "Metal arms extend to anchors." },
      { title: "Rear-facing: flexible LATCH", body: "Rigid is forward-only; use flex tether rear." },
      { title: "Adjust recline foot", body: "Ratchets out for precise angle." },
      { title: "Preserve crumple zone", body: "Don't put towels under base." },
      { title: "Anti-rebound bar", body: "Under seat rear-facing." }
    ],
    commonMistakes: ["Rear-facing under 14 lb minimum", "Rigid LATCH rear-facing (not permitted)", "Pool noodle under base disables crumple zone"],
    notes: "REACT aluminum crumple system. Safety-first premium."
  },
  {
    id: "cybex-sirona-s", brand: "Cybex", model: "Sirona S SensorSafe", type: "Convertible (Rotating)",
    modelNumbers: ["519002845", "519002846"], msrp: "$499", year: 2019, color: "#1a1a1a", site: SITES.cybex,
    productUrl: "https://www.cybex-online.com/en/us/",
    modes: {
      rearFacing: M({ weight: "5–40 lb", height: "up to 42″" }, { wMin: 5, wMax: 40, hMax: 42 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 24 })
    },
    expirationYears: 10, faaApproved: false, latchWeightMax: "40 lb",
    dimensions: "24″ D × 19.5″ W × 24.5″ H", seatWeight: "26 lb",
    installSteps: [
      { title: "Load leg deployment", body: "To floor; green indicator." },
      { title: "LATCH or belt install", body: "Ratcheting LATCH; lock-off for belt." },
      { title: "Rotate to load", body: "90° turn; return to travel position." },
      { title: "SensorSafe clip", body: "Monitors buckle + temp; pairs with key fob." },
      { title: "Check harness and level", body: "Auto-adjusting with multi-position headrest." }
    ],
    commonMistakes: ["Driving with seat rotated", "Load leg on storage compartment", "Attempted airline use (not FAA)"],
    notes: "Rotating + load leg + SensorSafe. Premium rotating convertible."
  },
  {
    id: "graco-contender-slim", brand: "Graco", model: "Contender Slim", type: "Convertible",
    modelNumbers: ["1875748", "1875749"], msrp: "$129", year: 2017, color: "#2a4a5f", site: SITES.graco,
    productUrl: "https://www.gracobaby.com/shop/car-seats/toddler-car-seats/convertible-car-seats/",
    modes: {
      rearFacing: M({ weight: "5–40 lb", height: "up to 40″" }, { wMin: 5, wMax: 40, hMax: 40 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 24 })
    },
    expirationYears: 7, faaApproved: true, latchWeightMax: "45 lb",
    dimensions: "17″ D × 17″ W × 24.5″ H", seatWeight: "15 lb",
    installSteps: [
      { title: "InRight LATCH", body: "Push-button connectors click into anchors." },
      { title: "Belt path per mode", body: "Blue rear, red forward." },
      { title: "Level indicator", body: "Single line parallel with ground." },
      { title: "Top tether forward-facing", body: "Always." },
      { title: "No-rethread harness", body: "10 positions." }
    ],
    commonMistakes: ["Skipping harness pads", "Tight 3-across fit — check your vehicle", "Mistaking level line for recline indicator"],
    notes: "Narrow (17″). Best for 3-across. Budget."
  },
  {
    id: "evenflo-symphony-all-in-one", brand: "Evenflo", model: "Symphony DLX All-in-One", type: "All-in-One",
    modelNumbers: ["34812033", "34812034"], msrp: "$249", year: 2018, color: "#4a3a5a", site: SITES.evenflo,
    productUrl: "https://www.evenflo.com/shop/",
    modes: {
      rearFacing: M({ weight: "5–40 lb", height: "up to 37″" }, { wMin: 5, wMax: 40, hMax: 37 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 50″" }, { wMin: 22, wMax: 65, hMax: 50, ageMin: 24 }),
      booster: M({ weight: "40–110 lb", height: "44–57″" }, { wMin: 40, wMax: 110, hMax: 57, ageMin: 48 })
    },
    expirationYears: 8, faaApproved: true, latchWeightMax: "35 lb rear / 40 lb forward",
    dimensions: "23″ D × 20″ W × 26″ H", seatWeight: "22 lb",
    installSteps: [
      { title: "SureLATCH base", body: "Push down on seat to engage auto-tighten." },
      { title: "Or seat belt", body: "Through correct path; lock-off secures." },
      { title: "Level indicator", body: "Color-coded per mode." },
      { title: "Top tether forward", body: "Required." },
      { title: "Infinite slide harness", body: "Slides with headrest — no rethread." }
    ],
    commonMistakes: ["Not pressing down firmly on SureLATCH", "Skipping top tether after mode switch", "Using cup holder as handle (bends)"],
    notes: "SureLATCH self-tightens. Good mid-range all-in-one."
  },
  {
    id: "nuna-rava", brand: "Nuna", model: "Rava", type: "Convertible",
    modelNumbers: ["CS15101GLBUS"], msrp: "$499", year: 2016, color: "#2d4a3d", site: SITES.nuna,
    productUrl: "https://nunababy.com/usa/car-seats",
    modes: {
      rearFacing: M({ weight: "5–50 lb", height: "up to 49″" }, { wMin: 5, wMax: 50, hMax: 49 }),
      forwardFacing: M({ weight: "25–65 lb", height: "up to 57″" }, { wMin: 25, wMax: 65, hMax: 57, ageMin: 24 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "35 lb rear / 40 lb forward",
    dimensions: "21″ D × 19″ W × 27″ H", seatWeight: "24 lb",
    installSteps: [
      { title: "True tension door", body: "Open, belt routes through, cinches easily." },
      { title: "LATCH or belt", body: "Both via the tension door system." },
      { title: "Set the recline", body: "10 rear; 6 forward." },
      { title: "Talk-to-me indicator", body: "Dynamic level per mode." },
      { title: "Top tether forward-facing", body: "Always." }
    ],
    commonMistakes: ["Closing tension door before belt is in final position", "Misreading dynamic indicator", "Loose harness covers"],
    notes: "True tension door install. 50 lb rear-facing."
  },

  // ========== BOOSTERS ==========
  {
    id: "chicco-kidfit-cleartex", brand: "Chicco", model: "KidFit ClearTex Plus", type: "Booster",
    modelNumbers: ["05079857", "05079858"], msrp: "$149", year: 2021, color: "#5a4a3a", site: SITES.chicco,
    productUrl: "https://www.chiccousa.com/shop-our-products/car-seats/booster/",
    modes: {
      highbackBooster: M({ weight: "40–100 lb", height: "38–57″", age: "at least 4 years" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 }),
      backlessBooster: M({ weight: "40–110 lb", height: "40–57″", age: "at least 4 years" }, { wMin: 40, wMax: 110, hMax: 57, ageMin: 48 })
    },
    expirationYears: 8, faaApproved: false, latchWeightMax: "Rigid LATCH anchors booster only",
    dimensions: "19.5″ D × 18.5″ W × 28–33″ H", seatWeight: "11 lb",
    installSteps: [
      { title: "Attach LATCH to anchor", body: "Optional — holds booster in place when empty." },
      { title: "Check seat belt fit", body: "Lap on upper thighs; shoulder middle of shoulder." },
      { title: "Adjust headrest", body: "Belt guide at/above child's shoulder." },
      { title: "Child sits properly", body: "Full ride, back against seat." },
      { title: "Remove back when ready", body: "Only when child sits properly consistently." }
    ],
    commonMistakes: ["Using before age 4", "Shoulder belt under arm or behind back", "Backless mode too early"],
    notes: "Top-rated by CR for belt fit. FR-free fabric."
  },
  {
    id: "graco-turbobooster", brand: "Graco", model: "TurboBooster", type: "Booster",
    modelNumbers: ["1894630", "1894631"], msrp: "$49", year: 2008, color: "#5a2a2a", site: SITES.graco,
    productUrl: "https://www.gracobaby.com/shop/car-seats/booster-car-seats/",
    modes: {
      highbackBooster: M({ weight: "40–100 lb", height: "43–57″", age: "at least 4 years" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 }),
      backlessBooster: M({ weight: "40–100 lb", height: "40–57″", age: "at least 4 years" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: false, latchWeightMax: "Not equipped",
    dimensions: "16.5″ D × 17″ W × 27.5–31″ H", seatWeight: "9 lb",
    installSteps: [
      { title: "Place on vehicle seat", body: "No installation required." },
      { title: "Adjust headrest", body: "Belt guide at/just above shoulder." },
      { title: "Buckle correctly", body: "Lap low on thighs; shoulder through guide." },
      { title: "Remove back when ready", body: "Only when child sits properly consistently." }
    ],
    commonMistakes: ["Unoccupied in crash — becomes projectile", "Shoulder belt not through guide", "Backless too early"],
    notes: "Industry standard affordable booster."
  },
  {
    id: "clek-oobr", brand: "Clek", model: "Oobr", type: "Booster",
    modelNumbers: ["OO23U1-BK"], msrp: "$299", year: 2013, color: "#1a1a1a", site: SITES.clek,
    productUrl: "https://clekinc.com/collections/car-seats",
    modes: {
      highbackBooster: M({ weight: "40–100 lb", height: "40–57″", age: "at least 4 years" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 }),
      backlessBooster: M({ weight: "40–120 lb", height: "up to 57″", age: "at least 4 years" }, { wMin: 40, wMax: 120, hMax: 57, ageMin: 48 })
    },
    expirationYears: 9, faaApproved: false, latchWeightMax: "Rigid LATCH to anchor",
    dimensions: "18″ D × 17″ W × 27–30″ H", seatWeight: "17 lb",
    installSteps: [
      { title: "Rigid LATCH install", body: "Push back into anchors; anchors even when empty." },
      { title: "Recline as needed", body: "Matches vehicle seat angle." },
      { title: "Check belt fit", body: "Shoulder through guide; lap low." },
      { title: "Remove back for transition", body: "Base works as backless booster." },
      { title: "Headrest adjustment", body: "Raises with child's shoulder height." }
    ],
    commonMistakes: ["Ignoring recline adjustment", "Shoulder belt outside headrest guide", "Using XL on small kids"],
    notes: "Rigid LATCH on a booster — uncommon and useful."
  },
  {
    id: "britax-highpoint", brand: "Britax", model: "Highpoint 2-Stage", type: "Booster",
    modelNumbers: ["E1C089J"], msrp: "$229", year: 2021, color: "#2a4a3a", site: SITES.britax,
    productUrl: "https://us.britax.com/shop/car-seats",
    modes: {
      highbackBooster: M({ weight: "40–120 lb", height: "44–63″", age: "at least 4 years" }, { wMin: 40, wMax: 120, hMax: 63, ageMin: 48 }),
      backlessBooster: M({ weight: "40–120 lb", height: "44–63″", age: "at least 4 years" }, { wMin: 40, wMax: 120, hMax: 63, ageMin: 48 })
    },
    expirationYears: 9, faaApproved: false, latchWeightMax: "SecureGuard lap belt clip",
    dimensions: "19″ D × 19″ W × 28–33″ H", seatWeight: "13 lb",
    installSteps: [
      { title: "Place on seat", body: "No base install — place and adjust." },
      { title: "Route shoulder belt", body: "Through headrest guide." },
      { title: "SecureGuard clip", body: "Pulls lap belt down onto thighs." },
      { title: "Headrest height", body: "10 positions. Guide at/above shoulder." },
      { title: "Backless mode", body: "Press release to remove back." }
    ],
    commonMistakes: ["Skipping SecureGuard (it's the key feature)", "Shoulder belt not through guide", "Slouched child posture"],
    notes: "SecureGuard lap belt positioner. 120 lb max."
  },
  {
    id: "cosco-topside", brand: "Cosco", model: "Topside Backless Booster", type: "Booster",
    modelNumbers: ["BC029DJF"], msrp: "$20", year: 2005, color: "#5a3a5a", site: SITES.cosco,
    productUrl: "https://www.coscokids.com/",
    modes: {
      backlessBooster: M({ weight: "40–100 lb", height: "43–57″", age: "at least 4 years" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 })
    },
    expirationYears: 8, faaApproved: false, latchWeightMax: "Not equipped",
    dimensions: "14″ D × 14″ W × 7″ H", seatWeight: "2.2 lb",
    installSteps: [
      { title: "Place on vehicle seat", body: "No installation." },
      { title: "Armrests up or down", body: "Per preference." },
      { title: "Route seat belt correctly", body: "Lap low; shoulder middle — never behind back." },
      { title: "Child sits back", body: "Back against vehicle seat for full ride." }
    ],
    commonMistakes: ["Using before age 4", "Shoulder belt under arm", "Vehicle seat without proper headrest"],
    notes: "Extremely lightweight budget booster."
  },
  {
    id: "evenflo-gotime", brand: "Evenflo", model: "GoTime LX", type: "Booster",
    modelNumbers: ["30812403"], msrp: "$79", year: 2020, color: "#2a5f4a", site: SITES.evenflo,
    productUrl: "https://www.evenflo.com/shop/",
    modes: {
      highbackBooster: M({ weight: "40–120 lb", height: "44–57″", age: "at least 4 years" }, { wMin: 40, wMax: 120, hMax: 57, ageMin: 48 }),
      backlessBooster: M({ weight: "40–120 lb", height: "44–57″", age: "at least 4 years" }, { wMin: 40, wMax: 120, hMax: 57, ageMin: 48 })
    },
    expirationYears: 6, faaApproved: false, latchWeightMax: "Not equipped",
    dimensions: "19″ D × 18″ W × 29–32″ H", seatWeight: "10 lb",
    installSteps: [
      { title: "Place on seat", body: "No installation." },
      { title: "Adjust headrest", body: "8 positions; guide at/above shoulder." },
      { title: "Belt routing", body: "Through the headrest guide." },
      { title: "Remove back when ready", body: "Only when child sits properly." }
    ],
    commonMistakes: ["Shoulder belt not through guide", "Back-removal too early", "Forcing cup holder sliders"],
    notes: "Mid-range booster. Good fit for most kids."
  },
  {
    id: "graco-tranzitions", brand: "Graco", model: "Tranzitions 3-in-1", type: "Harness Booster",
    modelNumbers: ["1959240"], msrp: "$129", year: 2016, color: "#4a4a2a", site: SITES.graco,
    productUrl: "https://www.gracobaby.com/shop/car-seats/booster-car-seats/harness-booster-car-seats/",
    modes: {
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 12 }),
      highbackBooster: M({ weight: "40–100 lb", height: "43–57″", age: "at least 4 years" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 }),
      backlessBooster: M({ weight: "40–100 lb", height: "43–57″", age: "at least 4 years" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 })
    },
    expirationYears: 8, faaApproved: true, latchWeightMax: "45 lb harness mode",
    dimensions: "18″ D × 18.7″ W × 25″ H", seatWeight: "10 lb",
    installSteps: [
      { title: "Forward-facing harness", body: "LATCH or belt; top tether always." },
      { title: "Transition to highback", body: "Remove harness, store; use vehicle belt." },
      { title: "Belt fit check", body: "Shoulder through guide; lap low." },
      { title: "Backless conversion", body: "Remove back when ready." },
      { title: "Store harness safely", body: "Stored properly for future kids." }
    ],
    commonMistakes: ["Not storing harness properly after transition", "Skipping top tether in harness mode", "Over 65 lb in harness mode"],
    notes: "Grows from harness to backless. Affordable."
  },
  {
    id: "graco-slimfit", brand: "Graco", model: "SlimFit 3-in-1", type: "All-in-One",
    modelNumbers: ["1963212"], msrp: "$229", year: 2016, color: "#4a5a3a", site: SITES.graco,
    productUrl: "https://www.gracobaby.com/shop/car-seats/toddler-car-seats/all-in-one-car-seats/slimfit-3-in-1-car-seat/SP_81228.html",
    modes: {
      rearFacing: M({ weight: "5–40 lb", height: "up to 40″" }, { wMin: 5, wMax: 40, hMax: 40 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 24 }),
      highbackBooster: M({ weight: "40–100 lb", height: "43–57″" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "45 lb",
    dimensions: "21.5″ D × 17″ W × 24″ H", seatWeight: "19 lb",
    installSteps: [
      { title: "Rotating cup holders", body: "Fold in for narrow fit — saves up to 10% width." },
      { title: "InRight LATCH or belt", body: "Standard belt path by mode." },
      { title: "Level check", body: "Indicator matches mode." },
      { title: "Top tether forward", body: "Always." },
      { title: "No-rethread harness", body: "10-position adjust." }
    ],
    commonMistakes: ["Cup holders extended when 3-across is tight", "Harness covers missing forward-facing", "Expecting 4-in-1 (it's 3-in-1)"],
    notes: "Slim design + rotating cup holders for 3-across."
  },
  {
    id: "evenflo-sonus", brand: "Evenflo", model: "Sonus Convertible", type: "Convertible",
    modelNumbers: ["34711934"], msrp: "$99", year: 2016, color: "#3a4a5a", site: SITES.evenflo,
    productUrl: "https://www.evenflo.com/shop/",
    modes: {
      rearFacing: M({ weight: "5–40 lb", height: "up to 37″" }, { wMin: 5, wMax: 40, hMax: 37 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 50″" }, { wMin: 22, wMax: 65, hMax: 50, ageMin: 24 })
    },
    expirationYears: 6, faaApproved: true, latchWeightMax: "35 lb rear / 40 lb forward",
    dimensions: "21.5″ D × 19″ W × 25″ H", seatWeight: "11 lb",
    installSteps: [
      { title: "LATCH or seat belt", body: "Color-coded belt path." },
      { title: "Level line parallel", body: "Rear-facing check." },
      { title: "Top tether forward", body: "Always." },
      { title: "Harness height", body: "Adjust per mode." },
      { title: "Recline", body: "Two positions." }
    ],
    commonMistakes: ["Only two recline positions — check compatibility", "Mistaking for long-life (only 6-year)", "Skipping top tether"],
    notes: "Budget entry convertible. Lightweight; good for travel."
  },
  {
    id: "chicco-nextfit-zip", brand: "Chicco", model: "NextFit Zip", type: "Convertible",
    modelNumbers: ["06079627"], msrp: "$379", year: 2015, color: "#6a2a32", site: SITES.chicco,
    productUrl: "https://www.chiccousa.com/shop-our-products/car-seats/rotating/",
    modes: {
      rearFacing: M({ weight: "5–40 lb", height: "up to 43″" }, { wMin: 5, wMax: 40, hMax: 43 }),
      forwardFacing: M({ weight: "25–65 lb", height: "up to 49″" }, { wMin: 25, wMax: 65, hMax: 49, ageMin: 24 })
    },
    expirationYears: 8, faaApproved: true, latchWeightMax: "40 lb",
    dimensions: "22″ D × 19″ W × 26″ H", seatWeight: "25 lb",
    installSteps: [
      { title: "SuperCinch LATCH", body: "Force-multiplying tightener." },
      { title: "Ride Right bubble levels", body: "9 recline positions — match to mode." },
      { title: "Zip-off seat pad", body: "Removes for cleaning without uninstalling." },
      { title: "Top tether forward", body: "Always." },
      { title: "Steel-reinforced frame", body: "Part of the crash structure — don't modify." }
    ],
    commonMistakes: ["Bubble not in mode-specific range", "Harness twisted during install", "Skipping LATCH storage pockets"],
    notes: "Steel frame. Zip-off cover is standout convenience."
  },
  // ========================================================
  // EXPANSION PACK — 30 more popular seats (batch 2)
  // Covers: Doona, Nuna Pipa variants, UPPAbaby Aria, Cybex
  // Aton, Britax Boulevard/Advocate/Poplar, Graco Turn2Me/
  // Grows4Me/EasyTurn 360, Chicco Fit4/OneFit/MyFit, Nuna
  // Exec, Diono Radian 3R, Evenflo LiteMax, more boosters.
  // ========================================================

  // ==== INFANT (batch 2) ====
  {
    id: "doona", brand: "Doona", model: "Doona Car Seat & Stroller", type: "Infant",
    modelNumbers: ["SP150-20-004", "SP150-20-033"], msrp: "$550", year: 2015, color: "#2a2a2a", site: "doona.com",
    productUrl: "https://us.doona.com/",
    modes: { rearFacing: M({ weight: "4–35 lb", height: "up to 32″" }, { wMin: 4, wMax: 35, hMax: 32 }) },
    expirationYears: 7, faaApproved: true, latchWeightMax: "35 lb",
    dimensions: "26″ D × 17.4″ W × 26.4″ H (car mode)", seatWeight: "16.5 lb",
    installSteps: [
      { title: "Retract wheels fully", body: "Car mode only. Never drive with wheels extended — check the locked position." },
      { title: "LATCH or seat belt", body: "Base optional (sold separately). Without base: use European routing." },
      { title: "Recline check", body: "Level line must be parallel — push handle forward if needed." },
      { title: "Harness smooth and snug", body: "No twists. Pinch-test at collarbone." },
      { title: "Chest clip at armpit", body: "Not belly, not neck." }
    ],
    commonMistakes: ["Driving with wheels still extended", "Using European routing when the base is installed", "Not re-tightening after cover cleaning"],
    notes: "Converts from car seat to stroller in seconds. Heavier than comparable infant seats."
  },
  {
    id: "nuna-pipa-lite-rx", brand: "Nuna", model: "Pipa Lite RX", type: "Infant",
    modelNumbers: ["CS18100CVRUS"], msrp: "$450", year: 2022, color: "#3d4a5a", site: SITES.nuna,
    productUrl: "https://nunababy.com/usa/car-seats",
    modes: { rearFacing: M({ weight: "4–32 lb", height: "up to 32″" }, { wMin: 4, wMax: 32, hMax: 32 }) },
    expirationYears: 7, faaApproved: true, latchWeightMax: "32 lb",
    dimensions: "26.6″ D × 16.9″ W × 22.2″ H", seatWeight: "5.3 lb carrier",
    installSteps: [
      { title: "Extend the load leg on the RELX base", body: "Indicator green." },
      { title: "RIGID LATCH install", body: "Base clicks directly to LATCH anchors; no belt needed." },
      { title: "Check base recline", body: "Must be level." },
      { title: "Click carrier in", body: "Solid click; green indicator visible." },
      { title: "Harness at/below shoulders", body: "Newborn — use lowest setting." }
    ],
    commonMistakes: ["Load leg resting on a floor hump, not flat", "Handle unlocked during travel", "Using Pipa Lite without a base (not allowed in US)"],
    notes: "Lightest Nuna infant seat. Requires base — cannot install belt-only."
  },
  {
    id: "cybex-aton-g", brand: "Cybex", model: "Aton G", type: "Infant",
    modelNumbers: ["520004468"], msrp: "$329", year: 2023, color: "#2a2a2a", site: SITES.cybex,
    productUrl: "https://www.cybex-online.com/en/us/",
    modes: { rearFacing: M({ weight: "4–35 lb", height: "up to 32″" }, { wMin: 4, wMax: 35, hMax: 32 }) },
    expirationYears: 7, faaApproved: true, latchWeightMax: "35 lb",
    dimensions: "26.2″ D × 17.3″ W × 24″ H", seatWeight: "7.3 lb carrier",
    installSteps: [
      { title: "Extend load leg on base", body: "Green indicator shows." },
      { title: "LATCH or belt base install", body: "Press firmly; tension indicator must be green." },
      { title: "L.S.P. (Linear Side Impact) deploy", body: "Flip out on door side." },
      { title: "Click carrier", body: "Listen for double-click; check green." },
      { title: "Harness check", body: "Straps from or below shoulders." }
    ],
    commonMistakes: ["Forgetting to extend L.S.P. on door side", "Load leg on floor storage compartment", "Using without newborn insert on tiny babies"],
    notes: "Lightweight relative to other load-leg seats. SensorSafe chest clip optional."
  },
  {
    id: "uppababy-aria", brand: "UPPAbaby", model: "Aria", type: "Infant",
    modelNumbers: ["0030", "0031"], msrp: "$349", year: 2024, color: "#2a3a5a", site: SITES.uppababy,
    productUrl: "https://uppababy.com/car-seats/",
    modes: { rearFacing: M({ weight: "4–35 lb", height: "up to 32″" }, { wMin: 4, wMax: 35, hMax: 32 }) },
    expirationYears: 7, faaApproved: true, latchWeightMax: "35 lb",
    dimensions: "26″ D × 17″ W × 22.5″ H", seatWeight: "6.3 lb carrier",
    installSteps: [
      { title: "Anti-rebound panel on base", body: "Unfold to deploy." },
      { title: "RIGID LATCH click install", body: "Direct connection to anchors." },
      { title: "Recline adjust", body: "Match baby's size — lowest recline for newborns." },
      { title: "Click carrier", body: "Audible click; visual check for green." },
      { title: "Harness low + tight", body: "Straps from or below shoulders." }
    ],
    commonMistakes: ["Skipping anti-rebound panel deployment", "Aria carrier on Mesa base (not compatible)", "Infant insert removed too early"],
    notes: "UPPAbaby's lightest infant seat. Works with Vista, Cruz, Minu strollers."
  },
  {
    id: "evenflo-litemax-35", brand: "Evenflo", model: "LiteMax 35", type: "Infant",
    modelNumbers: ["30512396"], msrp: "$109", year: 2018, color: "#5a3a2a", site: SITES.evenflo,
    productUrl: "https://www.evenflo.com/shop/",
    modes: { rearFacing: M({ weight: "4–35 lb", height: "17–32″" }, { wMin: 4, wMax: 35, hMax: 32 }) },
    expirationYears: 6, faaApproved: true, latchWeightMax: "35 lb",
    dimensions: "26″ D × 17″ W × 22.5″ H", seatWeight: "8.5 lb carrier",
    installSteps: [
      { title: "Base or baseless install", body: "Base: LATCH or belt. Baseless: European routing." },
      { title: "Level line parallel", body: "Adjust base foot angle." },
      { title: "Lock-off belt clamp", body: "Close the lock-off over the vehicle belt." },
      { title: "Click carrier to base", body: "One click per side." },
      { title: "Check both sides", body: "Pull up on carrier." }
    ],
    commonMistakes: ["Skipping lock-off clamp", "Carrier mis-click on one side only", "Using with expired base past DOM"],
    notes: "Budget-friendly. Commonly in rental cars and baby shower registries."
  },
  {
    id: "graco-snugride-snuglock-dlx", brand: "Graco", model: "SnugRide SnugLock 35 DLX", type: "Infant",
    modelNumbers: ["2083255", "2087123"], msrp: "$229", year: 2019, color: "#3a3a5f", site: SITES.graco,
    productUrl: "https://www.gracobaby.com/shop/car-seats/infant-car-seats/",
    modes: { rearFacing: M({ weight: "4–35 lb", height: "up to 32″" }, { wMin: 4, wMax: 35, hMax: 32 }) },
    expirationYears: 7, faaApproved: true, latchWeightMax: "35 lb",
    dimensions: "26.5″ D × 17″ W × 23.5″ H", seatWeight: "9 lb carrier",
    installSteps: [
      { title: "SnugLock belt routing", body: "Hassle-free — no harness tightening needed." },
      { title: "Close SnugLock arm", body: "Latches the belt automatically." },
      { title: "Level indicator", body: "Base foot adjusts for reclined vehicle seats." },
      { title: "Click carrier", body: "One solid click; tug to confirm." },
      { title: "Harness from the shoulders", body: "Re-thread as baby grows (12 positions)." }
    ],
    commonMistakes: ["Over-tightening SnugLock arm against the belt", "Missing level adjustment", "Keeping infant insert past 11 lb"],
    notes: "DLX adds removable head support, upgraded fabric over base SnugRide SnugLock 35."
  },
  {
    id: "britax-willow-s", brand: "Britax", model: "Willow S", type: "Infant",
    modelNumbers: ["E1E035K"], msrp: "$349", year: 2023, color: "#2a4a3a", site: SITES.britax,
    productUrl: "https://us.britax.com/shop/car-seats",
    modes: { rearFacing: M({ weight: "4–30 lb", height: "up to 32″" }, { wMin: 4, wMax: 30, hMax: 32 }) },
    expirationYears: 7, faaApproved: true, latchWeightMax: "30 lb",
    dimensions: "25″ D × 17″ W × 23″ H", seatWeight: "9 lb carrier",
    installSteps: [
      { title: "Extend load leg on base", body: "Green indicator required." },
      { title: "LATCH or seat belt install", body: "Base anchors click; auto belt tensioner." },
      { title: "Recline angle", body: "Must be green." },
      { title: "Click carrier", body: "Audible click + visible green." },
      { title: "Newborn insert mandatory below 11 lb", body: "Contour supports head." }
    ],
    commonMistakes: ["Load leg on vehicle floor storage", "Insert used past 11 lb", "Carrier installed baseless without European belt path"],
    notes: "Britax's newer load-leg infant seat. Released 2023."
  },

  // ==== CONVERTIBLE (batch 2) ====
  {
    id: "nuna-exec", brand: "Nuna", model: "Exec", type: "All-in-One",
    modelNumbers: ["CS20050CVRUS"], msrp: "$650", year: 2021, color: "#2d4a3d", site: SITES.nuna,
    productUrl: "https://nunababy.com/usa/car-seats",
    modes: {
      rearFacing: M({ weight: "5–50 lb", height: "up to 49″" }, { wMin: 5, wMax: 50, hMax: 49 }),
      forwardFacing: M({ weight: "25–65 lb", height: "up to 49″" }, { wMin: 25, wMax: 65, hMax: 49, ageMin: 24 }),
      highbackBooster: M({ weight: "40–120 lb", height: "38–57″" }, { wMin: 40, wMax: 120, hMax: 57, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "50 lb",
    dimensions: "24.5″ D × 18.5″ W × 27″ H", seatWeight: "30 lb",
    installSteps: [
      { title: "RIGID LATCH or True Tension belt", body: "Both are self-tensioning — no heavy pulling needed." },
      { title: "Anti-rebound panel (rear-facing)", body: "Deploy for rear-facing use." },
      { title: "Five-position recline", body: "Match to child size." },
      { title: "Top tether forward-facing only", body: "Not rear-facing with Exec." },
      { title: "Calf support", body: "Extend for older kids for comfort." }
    ],
    commonMistakes: ["Anti-rebound panel not deployed rear-facing", "Skipping True Tension in belt mode", "Top tether used rear-facing (not needed)"],
    notes: "Premium all-in-one. Heavy but longest-lasting in lineup."
  },
  {
    id: "diono-radian-3r", brand: "Diono", model: "Radian 3R", type: "All-in-One",
    modelNumbers: ["50611"], msrp: "$269", year: 2020, color: "#3a2a4a", site: SITES.diono,
    productUrl: "https://diono.com/",
    modes: {
      rearFacing: M({ weight: "5–45 lb", height: "up to 44″" }, { wMin: 5, wMax: 45, hMax: 44 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 57″" }, { wMin: 22, wMax: 65, hMax: 57, ageMin: 24 }),
      highbackBooster: M({ weight: "50–120 lb", height: "38–57″" }, { wMin: 50, wMax: 120, hMax: 57, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "45 lb",
    dimensions: "17″ D × 17″ W × 28.5″ H", seatWeight: "25 lb",
    installSteps: [
      { title: "SuperLATCH or belt install", body: "Steel-reinforced frame; press firmly." },
      { title: "Super-slim 17″ width", body: "Fits 3-across in most midsize vehicles." },
      { title: "Rear-facing angle adjusters", body: "Use for reclined vehicle seats." },
      { title: "Top tether forward-facing", body: "Always." },
      { title: "Side wings deploy", body: "Unfold for booster mode." }
    ],
    commonMistakes: ["Skipping angle adjusters when needed", "Using in booster without removing harness properly", "Not reading the lengthy manual"],
    notes: "Famous for 3-across fit. Steel frame makes it heavy — less travel-friendly."
  },
  {
    id: "graco-turn2me", brand: "Graco", model: "Turn2Me 3-in-1", type: "Convertible (Rotating)",
    modelNumbers: ["2194826"], msrp: "$399", year: 2023, color: "#1f3a5f", site: SITES.graco,
    productUrl: "https://www.gracobaby.com/shop/car-seats/convertible-car-seats/",
    modes: {
      rearFacing: M({ weight: "4–40 lb", height: "up to 43″" }, { wMin: 4, wMax: 40, hMax: 43 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 24 }),
      highbackBooster: M({ weight: "40–100 lb", height: "43–57″" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: false, latchWeightMax: "45 lb",
    dimensions: "22″ D × 19″ W × 25″ H", seatWeight: "31 lb",
    installSteps: [
      { title: "Install base first with SnugLock", body: "Only rotates while installed." },
      { title: "Rotate only while rear-facing", body: "Forward-facing — locks in place." },
      { title: "Top tether forward-facing", body: "Always." },
      { title: "Harness no-rethread", body: "10-position adjust." },
      { title: "Check tightness after every rotation", body: "Re-verify belt path if base shifts." }
    ],
    commonMistakes: ["Forgetting to lock the rotation before driving", "Attempting to rotate while forward-facing", "Top tether unattached"],
    notes: "Graco's flagship rotating seat. Heavy — plan for permanent install."
  },
  {
    id: "graco-easyturn-360", brand: "Graco", model: "EasyTurn 360", type: "Convertible (Rotating)",
    modelNumbers: ["2202195"], msrp: "$299", year: 2024, color: "#1f3a5f", site: SITES.graco,
    productUrl: "https://www.gracobaby.com/shop/car-seats/convertible-car-seats/",
    modes: {
      rearFacing: M({ weight: "4–40 lb", height: "up to 43″" }, { wMin: 4, wMax: 40, hMax: 43 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 24 })
    },
    expirationYears: 10, faaApproved: false, latchWeightMax: "45 lb",
    dimensions: "22″ D × 18.5″ W × 25″ H", seatWeight: "25 lb",
    installSteps: [
      { title: "One-time install", body: "Install once; rotate between modes without reinstalling." },
      { title: "SnugLock belt or LATCH", body: "Belt auto-locks when SnugLock closes." },
      { title: "Rotate rear-to-forward lock", body: "Audible click confirms direction." },
      { title: "Top tether forward", body: "Always." },
      { title: "Headrest + harness adjust together", body: "10 positions, no rethread." }
    ],
    commonMistakes: ["Forgetting tether when switching to forward", "Not hearing the rotation lock click", "Trying to rotate partway (must fully lock)"],
    notes: "Slimmer and lighter than Turn2Me. 2-in-1 only — no booster mode."
  },
  {
    id: "britax-boulevard-clicktight", brand: "Britax", model: "Boulevard ClickTight", type: "Convertible",
    modelNumbers: ["E1C186L"], msrp: "$379", year: 2018, color: "#2a4a3a", site: SITES.britax,
    productUrl: "https://us.britax.com/shop/car-seats",
    modes: {
      rearFacing: M({ weight: "5–40 lb", height: "up to 49″" }, { wMin: 5, wMax: 40, hMax: 49 }),
      forwardFacing: M({ weight: "20–65 lb", height: "up to 49″" }, { wMin: 20, wMax: 65, hMax: 49, ageMin: 24 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "40 lb",
    dimensions: "23″ D × 18.5″ W × 25.5″ H", seatWeight: "29 lb",
    installSteps: [
      { title: "Open ClickTight panel", body: "Push button + twist." },
      { title: "Thread belt through open path", body: "Full access to belt path." },
      { title: "Close ClickTight", body: "Button pops up when fully closed." },
      { title: "Top tether forward-facing", body: "Always." },
      { title: "SafeCell crumple zone", body: "Built in — don't modify base." }
    ],
    commonMistakes: ["Button not popping up fully — indicates incomplete close", "Twisted harness after install", "Using tether rear-facing (Britax doesn't require)"],
    notes: "ClickTight makes belt install very reliable. Middle tier between Marathon and Advocate."
  },
  {
    id: "britax-advocate-clicktight", brand: "Britax", model: "Advocate ClickTight", type: "Convertible",
    modelNumbers: ["E1C187F"], msrp: "$429", year: 2018, color: "#2a4a3a", site: SITES.britax,
    productUrl: "https://us.britax.com/shop/car-seats",
    modes: {
      rearFacing: M({ weight: "5–40 lb", height: "up to 49″" }, { wMin: 5, wMax: 40, hMax: 49 }),
      forwardFacing: M({ weight: "20–65 lb", height: "up to 49″" }, { wMin: 20, wMax: 65, hMax: 49, ageMin: 24 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "40 lb",
    dimensions: "23″ D × 20.5″ W × 25.5″ H", seatWeight: "31 lb",
    installSteps: [
      { title: "Open ClickTight panel", body: "Button + twist." },
      { title: "Thread belt through open path", body: "No over-tightening needed." },
      { title: "Close ClickTight", body: "Button pops when fully latched." },
      { title: "Top tether forward-facing", body: "Always." },
      { title: "Triple-layer side impact protection", body: "Widest side wings in lineup." }
    ],
    commonMistakes: ["Wider body — check 3-across fit first", "Wings blocking seat belt buckle access", "Foam padding compressed (replace)"],
    notes: "Most side-impact protection in Britax ClickTight lineup. Wider than Boulevard."
  },
  {
    id: "britax-poplar-s", brand: "Britax", model: "Poplar S", type: "Convertible",
    modelNumbers: ["E1E044K"], msrp: "$349", year: 2023, color: "#2a4a3a", site: SITES.britax,
    productUrl: "https://us.britax.com/shop/car-seats",
    modes: {
      rearFacing: M({ weight: "5–50 lb", height: "up to 49″" }, { wMin: 5, wMax: 50, hMax: 49 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 24 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "50 lb",
    dimensions: "23″ D × 17″ W × 25″ H", seatWeight: "23 lb",
    installSteps: [
      { title: "ClickTight install", body: "Open, thread, close." },
      { title: "Check ClickTight button", body: "Must pop up — confirms latched." },
      { title: "Anti-rebound bar", body: "Built into rear-facing base." },
      { title: "Top tether forward-facing", body: "Always." },
      { title: "17″ slim design", body: "Fits 3-across in most midsize vehicles." }
    ],
    commonMistakes: ["Button unpopped = unsafe install", "Believing it's all-in-one (it's 2-in-1)", "Skipping tether forward-facing"],
    notes: "Slim 17″ width. Britax's newer extended rear-facing convertible."
  },
  {
    id: "chicco-fit4", brand: "Chicco", model: "Fit4 4-in-1", type: "All-in-One",
    modelNumbers: ["05079847"], msrp: "$449", year: 2020, color: "#8b2332", site: SITES.chicco,
    productUrl: "https://www.chiccousa.com/shop-our-products/car-seats/",
    modes: {
      rearFacing: M({ weight: "4–50 lb", height: "up to 49″" }, { wMin: 4, wMax: 50, hMax: 49 }),
      forwardFacing: M({ weight: "25–65 lb", height: "up to 54″" }, { wMin: 25, wMax: 65, hMax: 54, ageMin: 24 }),
      highbackBooster: M({ weight: "40–100 lb", height: "38–57″" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "40 lb",
    dimensions: "22.5″ D × 20″ W × 27″ H", seatWeight: "33 lb",
    installSteps: [
      { title: "Stage-adjusting base", body: "Re-shape base for each mode — 4 stages built in." },
      { title: "SuperCinch LATCH", body: "Force-multiplying tightener." },
      { title: "Recline per stage", body: "Each mode has distinct recline range." },
      { title: "Headrest + harness adjust together", body: "No-rethread." },
      { title: "Top tether forward-facing", body: "Always." }
    ],
    commonMistakes: ["Not re-configuring base for new stage (each transition requires setup)", "Skipping SuperCinch tension", "Harness in wrong position for stage"],
    notes: "Chicco's all-in-one flagship. Heavy but high-quality; NextFit Sport is the slimmer sibling."
  },
  {
    id: "chicco-onefit", brand: "Chicco", model: "OneFit ClearTex", type: "All-in-One",
    modelNumbers: ["05079848"], msrp: "$279", year: 2022, color: "#8b2332", site: SITES.chicco,
    productUrl: "https://www.chiccousa.com/shop-our-products/car-seats/",
    modes: {
      rearFacing: M({ weight: "5–40 lb", height: "up to 43″" }, { wMin: 5, wMax: 40, hMax: 43 }),
      forwardFacing: M({ weight: "25–65 lb", height: "up to 49″" }, { wMin: 25, wMax: 65, hMax: 49, ageMin: 24 }),
      highbackBooster: M({ weight: "40–100 lb", height: "38–57″" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "40 lb",
    dimensions: "22″ D × 18.5″ W × 25.5″ H", seatWeight: "23 lb",
    installSteps: [
      { title: "LeverLock install", body: "Single lever tightens both LATCH and belt paths." },
      { title: "LATCH or belt", body: "Color-coded paths per mode." },
      { title: "Recline per mode", body: "4 positions." },
      { title: "Top tether forward", body: "Always." },
      { title: "No-rethread harness", body: "11-position adjust." }
    ],
    commonMistakes: ["LeverLock not fully engaged (must click)", "Using LATCH past 40 lb (switch to belt)", "Flame-retardant chemicals concern — ClearTex is non-FR fabric"],
    notes: "Slimmer, lighter alternative to Fit4. Same ClearTex non-chemical-FR fabric."
  },
  {
    id: "chicco-myfit", brand: "Chicco", model: "MyFit Harness + Booster", type: "Harness Booster",
    modelNumbers: ["04079857"], msrp: "$199", year: 2017, color: "#8b2332", site: SITES.chicco,
    productUrl: "https://www.chiccousa.com/shop-our-products/car-seats/booster/",
    modes: {
      forwardFacing: M({ weight: "25–65 lb", height: "up to 54″" }, { wMin: 25, wMax: 65, hMax: 54, ageMin: 24 }),
      highbackBooster: M({ weight: "40–100 lb", height: "38–57″" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 })
    },
    expirationYears: 8, faaApproved: true, latchWeightMax: "65 lb (highest in category)",
    dimensions: "18.5″ D × 19″ W × 30″ H", seatWeight: "19 lb",
    installSteps: [
      { title: "SuperCinch LATCH (harness mode)", body: "Up to 65 lb — unusual for category." },
      { title: "Top tether", body: "Always use harness mode." },
      { title: "Transition to booster", body: "Remove harness per instructions; store in back pocket." },
      { title: "Booster mode — LATCH anchors recommended", body: "Keeps seat stable when child leaves." },
      { title: "Shoulder belt at collarbone", body: "Not neck." }
    ],
    commonMistakes: ["Using in booster mode with child under 40 lb", "Harness stored improperly during booster conversion", "Skipping LATCH in booster mode"],
    notes: "Forward-facing only. Class-leading 65-lb harness mode LATCH capacity."
  },
  {
    id: "maxi-cosi-pria", brand: "Maxi-Cosi", model: "Pria All-in-One", type: "All-in-One",
    modelNumbers: ["CC194EME"], msrp: "$329", year: 2020, color: "#4a4a2a", site: SITES.maxicosi,
    productUrl: "https://www.maxicosi.com/us-en/",
    modes: {
      rearFacing: M({ weight: "4–40 lb", height: "up to 40″" }, { wMin: 4, wMax: 40, hMax: 40 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 52″" }, { wMin: 22, wMax: 65, hMax: 52, ageMin: 24 }),
      highbackBooster: M({ weight: "40–100 lb", height: "43–52″" }, { wMin: 40, wMax: 100, hMax: 52, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "40 lb",
    dimensions: "21″ D × 18″ W × 26″ H", seatWeight: "25 lb",
    installSteps: [
      { title: "FlexiFit base", body: "Adjust for each mode." },
      { title: "LATCH or belt", body: "Premium EasyFit LATCH self-tensions." },
      { title: "Air Protect + G-CELL", body: "Side impact + energy-absorbing foam." },
      { title: "Top tether forward", body: "Always." },
      { title: "Washable cover", body: "Removable without uninstalling seat." }
    ],
    commonMistakes: ["FlexiFit not re-adjusted between modes", "LATCH used past 40 lb", "Cover incorrectly replaced (follow diagram)"],
    notes: "Simple to clean. Mid-range price for all-in-one."
  },
  {
    id: "safety1st-everslim", brand: "Safety 1st", model: "EverSlim All-in-One", type: "All-in-One",
    modelNumbers: ["CC210GGY"], msrp: "$229", year: 2021, color: "#2a5f7a", site: SITES.safety1st,
    productUrl: "https://www.safety1st.com/",
    modes: {
      rearFacing: M({ weight: "4–40 lb", height: "up to 40″" }, { wMin: 4, wMax: 40, hMax: 40 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 24 }),
      highbackBooster: M({ weight: "40–100 lb", height: "43–52″" }, { wMin: 40, wMax: 100, hMax: 52, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "40 lb",
    dimensions: "22″ D × 17.3″ W × 25″ H", seatWeight: "18 lb",
    installSteps: [
      { title: "SecureTech install", body: "Red-to-green chest clip visual confirmation." },
      { title: "LATCH or belt", body: "Both paths color-coded." },
      { title: "Recline per mode", body: "2 positions." },
      { title: "Top tether forward", body: "Always." },
      { title: "Narrow 17.3″ width", body: "Excellent for 3-across." }
    ],
    commonMistakes: ["Clip color not verified green", "Mis-threading LATCH through belt path", "Skipping tether forward-facing"],
    notes: "Very slim + lightweight. Popular for budget 3-across needs."
  },
  {
    id: "evenflo-reo", brand: "Evenflo", model: "REO by Revolve360", type: "Convertible (Rotating)",
    modelNumbers: ["35711234"], msrp: "$299", year: 2023, color: "#4a3a2a", site: SITES.evenflo,
    productUrl: "https://www.evenflo.com/shop/",
    modes: {
      rearFacing: M({ weight: "4–40 lb", height: "up to 40″" }, { wMin: 4, wMax: 40, hMax: 40 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 24 })
    },
    expirationYears: 10, faaApproved: false, latchWeightMax: "40 lb",
    dimensions: "22″ D × 18″ W × 26″ H", seatWeight: "28 lb",
    installSteps: [
      { title: "One-time install", body: "Install once; rotate between modes." },
      { title: "LATCH or belt with SafetyLatch lock-off", body: "Cinches automatically." },
      { title: "Rotation lock", body: "Must click audibly when locked rear or forward." },
      { title: "Top tether forward-facing", body: "Always." },
      { title: "Headrest + harness adjust", body: "Together, 8 positions." }
    ],
    commonMistakes: ["Rotating without locking it in", "Confusing with Revolve360 Extend (REO doesn't have booster mode)", "Top tether forgotten"],
    notes: "REO is Evenflo's 2-in-1 rotating — simpler/cheaper than Revolve360 Extend."
  },
  {
    id: "graco-grows4me", brand: "Graco", model: "Grows4Me 4-in-1", type: "All-in-One",
    modelNumbers: ["2194756"], msrp: "$249", year: 2023, color: "#1f3a5f", site: SITES.graco,
    productUrl: "https://www.gracobaby.com/shop/car-seats/all-in-one-car-seats/",
    modes: {
      rearFacing: M({ weight: "4–40 lb", height: "up to 40″" }, { wMin: 4, wMax: 40, hMax: 40 }),
      forwardFacing: M({ weight: "22–65 lb", height: "up to 49″" }, { wMin: 22, wMax: 65, hMax: 49, ageMin: 24 }),
      highbackBooster: M({ weight: "40–100 lb", height: "43–57″" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 }),
      backlessBooster: M({ weight: "40–120 lb", height: "up to 57″" }, { wMin: 40, wMax: 120, hMax: 57, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: "45 lb",
    dimensions: "22″ D × 19″ W × 25″ H", seatWeight: "20 lb",
    installSteps: [
      { title: "InRight LATCH or belt", body: "One-second LATCH attach." },
      { title: "Recline for mode", body: "Indicator confirms." },
      { title: "Top tether forward", body: "Always." },
      { title: "Booster transition", body: "Remove harness, stow per manual." },
      { title: "Cup holders removable", body: "For narrow vehicles." }
    ],
    commonMistakes: ["Harness stored loose when transitioning to booster", "Skipping recline per-mode check", "Forgetting tether"],
    notes: "4-in-1 (includes backless booster mode). Similar to 4Ever DLX at lower price."
  },

  // ==== BOOSTER (batch 2) ====
  {
    id: "britax-grow-with-you-clicktight", brand: "Britax", model: "Grow With You ClickTight", type: "Harness Booster",
    modelNumbers: ["E1C184L"], msrp: "$299", year: 2020, color: "#2a4a3a", site: SITES.britax,
    productUrl: "https://us.britax.com/shop/car-seats",
    modes: {
      forwardFacing: M({ weight: "25–65 lb", height: "up to 49″" }, { wMin: 25, wMax: 65, hMax: 49, ageMin: 24 }),
      highbackBooster: M({ weight: "40–120 lb", height: "up to 63″" }, { wMin: 40, wMax: 120, hMax: 63, ageMin: 48 })
    },
    expirationYears: 9, faaApproved: true, latchWeightMax: "65 lb",
    dimensions: "20.5″ D × 19″ W × 30″ H", seatWeight: "22 lb",
    installSteps: [
      { title: "ClickTight install", body: "Open, thread, close. Same as convertibles." },
      { title: "Forward-facing harness mode to 65 lb", body: "Class-leading." },
      { title: "Top tether harness mode", body: "Always." },
      { title: "Transition to high-back booster", body: "Remove harness per manual." },
      { title: "Reach max 63″ booster", body: "Great for older/taller kids." }
    ],
    commonMistakes: ["Transitioning to booster too early (use harness as long as possible)", "Harness not stored correctly in booster mode", "Skipping tether in harness"],
    notes: "Forward-facing only. Highest LATCH harness capacity + tallest shoulder height."
  },
  {
    id: "graco-affix", brand: "Graco", model: "Affix Highback Booster", type: "Booster",
    modelNumbers: ["1878104"], msrp: "$99", year: 2014, color: "#1f3a5f", site: SITES.graco,
    productUrl: "https://www.gracobaby.com/shop/car-seats/booster-car-seats/",
    modes: {
      highbackBooster: M({ weight: "30–100 lb", height: "38–57″" }, { wMin: 30, wMax: 100, hMax: 57, ageMin: 36 }),
      backlessBooster: M({ weight: "40–100 lb", height: "43–57″" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: false, latchWeightMax: "100 lb (booster LATCH)",
    dimensions: "17″ D × 19″ W × 28″ H", seatWeight: "10 lb",
    installSteps: [
      { title: "LATCH-tether install", body: "Keeps booster in place when empty." },
      { title: "Adjust headrest", body: "Shoulder belt at collarbone." },
      { title: "Shoulder + lap belt routing", body: "Through guides." },
      { title: "Child's back flush with seat", body: "No slouching." },
      { title: "Remove back for backless mode", body: "Once child outgrows highback." }
    ],
    commonMistakes: ["Belt at neck instead of collarbone", "Child slouches — reminds kid to sit straight", "Using without LATCH in most vehicles"],
    notes: "Entry-level booster with LATCH — stays put when empty. Great for carpool."
  },
  {
    id: "nuna-aace", brand: "Nuna", model: "Aace Booster", type: "Booster",
    modelNumbers: ["BS03600CVRUS"], msrp: "$200", year: 2019, color: "#2d4a3d", site: SITES.nuna,
    productUrl: "https://nunababy.com/usa/car-seats",
    modes: {
      highbackBooster: M({ weight: "40–120 lb", height: "38–57″" }, { wMin: 40, wMax: 120, hMax: 57, ageMin: 48 }),
      backlessBooster: M({ weight: "40–120 lb", height: "up to 57″" }, { wMin: 40, wMax: 120, hMax: 57, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: false, latchWeightMax: "120 lb",
    dimensions: "15″ D × 17″ W × 29″ H", seatWeight: "15 lb",
    installSteps: [
      { title: "Rigid LATCH (optional)", body: "Keeps seat anchored when unoccupied." },
      { title: "Adjust headrest", body: "10-position. Belt at child's collarbone." },
      { title: "Side-impact wings", body: "Fixed — no deploy needed." },
      { title: "Lap belt on thighs", body: "Not belly." },
      { title: "Store backless back for later travel", body: "Lightweight storage." }
    ],
    commonMistakes: ["Belt at neck", "Using backless before 40 lb", "Child outside max weight (rare but happens)"],
    notes: "Higher-end booster with RIGID LATCH attachment. Premium materials."
  },
  {
    id: "cybex-solution-g", brand: "Cybex", model: "Solution G", type: "Booster",
    modelNumbers: ["520004441"], msrp: "$249", year: 2023, color: "#1a1a1a", site: SITES.cybex,
    productUrl: "https://www.cybex-online.com/en/us/",
    modes: {
      highbackBooster: M({ weight: "40–120 lb", height: "38–59″" }, { wMin: 40, wMax: 120, hMax: 59, ageMin: 48 })
    },
    expirationYears: 8, faaApproved: false, latchWeightMax: "120 lb",
    dimensions: "16″ D × 17.3″ W × 27″ H", seatWeight: "11 lb",
    installSteps: [
      { title: "Latch anchors (optional)", body: "Stabilizes when unoccupied." },
      { title: "Headrest 12 positions", body: "Rises as child grows." },
      { title: "L.S.P. side wings", body: "Flip out on door side for extra protection." },
      { title: "Belt through guide", body: "Shoulder belt at collarbone." },
      { title: "No backless mode", body: "High-back only — more protection." }
    ],
    commonMistakes: ["L.S.P. not deployed", "Attempting backless mode (not available)", "Headrest too low for child's height"],
    notes: "High-back only — no backless mode. Longer useful life than many boosters."
  },
  {
    id: "diono-solana", brand: "Diono", model: "Solana 2", type: "Booster",
    modelNumbers: ["50200"], msrp: "$30", year: 2015, color: "#3a2a4a", site: SITES.diono,
    productUrl: "https://diono.com/",
    modes: {
      backlessBooster: M({ weight: "40–120 lb", height: "38–57″" }, { wMin: 40, wMax: 120, hMax: 57, ageMin: 48 })
    },
    expirationYears: 8, faaApproved: true, latchWeightMax: "40 lb (booster LATCH)",
    dimensions: "13″ D × 15″ W × 7″ H", seatWeight: "3 lb",
    installSteps: [
      { title: "Attach LATCH (if equipped in car)", body: "Keeps booster in place." },
      { title: "Child sits", body: "Back flush with vehicle seat back." },
      { title: "Shoulder belt routed through guide", body: "At collarbone, not neck." },
      { title: "Lap belt on thighs", body: "Not belly." },
      { title: "Check every ride", body: "Backless boosters shift easily." }
    ],
    commonMistakes: ["Lap belt ride-up (belt across belly)", "Shoulder belt tucked under arm — never allow", "Using before child is 40 lb"],
    notes: "Ultra-light backless booster. Great for carpool / travel. FAA-approved (rare for backless)."
  },
  {
    id: "bubblebum", brand: "BubbleBum", model: "Inflatable Booster", type: "Booster",
    modelNumbers: ["BB-BUBBLE-KEY"], msrp: "$40", year: 2013, color: "#5a3a2a", site: "bubblebum.co",
    productUrl: "https://www.bubblebum.co/",
    modes: {
      backlessBooster: M({ weight: "40–100 lb", height: "40–57″" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: true, latchWeightMax: null,
    dimensions: "11.5″ D × 13″ W × 4″ H (inflated)", seatWeight: "1 lb",
    installSteps: [
      { title: "Inflate fully", body: "Hand-pump valve; firm to touch." },
      { title: "Place on vehicle seat", body: "Child sits; shoulder belt routed through top guide." },
      { title: "Belt at collarbone", body: "Never neck." },
      { title: "Lap belt on thighs", body: "Not belly." },
      { title: "Deflate for storage", body: "Fits in glovebox." }
    ],
    commonMistakes: ["Under-inflated — collapses during use", "Using with child under 40 lb", "Belt positioning guide skipped"],
    notes: "Portable inflatable booster. Excellent for travel + carpool. Fits glovebox deflated."
  },
  {
    id: "maxi-cosi-rodifix", brand: "Maxi-Cosi", model: "RodiFix", type: "Booster",
    modelNumbers: ["BC123EMN"], msrp: "$230", year: 2018, color: "#4a4a2a", site: SITES.maxicosi,
    productUrl: "https://www.maxicosi.com/us-en/",
    modes: {
      highbackBooster: M({ weight: "40–120 lb", height: "43–63″" }, { wMin: 40, wMax: 120, hMax: 63, ageMin: 48 }),
      backlessBooster: M({ weight: "40–120 lb", height: "43–57″" }, { wMin: 40, wMax: 120, hMax: 57, ageMin: 48 })
    },
    expirationYears: 10, faaApproved: false, latchWeightMax: "120 lb",
    dimensions: "16″ D × 17.5″ W × 28″ H", seatWeight: "14 lb",
    installSteps: [
      { title: "Rigid LATCH attach", body: "Stabilizes when empty." },
      { title: "AirProtect headrest", body: "Side impact foam in headrest." },
      { title: "8-position headrest", body: "Adjust for shoulder belt guide." },
      { title: "Belt at collarbone", body: "Not neck." },
      { title: "Backless conversion", body: "When backless becomes legal option." }
    ],
    commonMistakes: ["LATCH not attached (makes installation marginal)", "Belt at neck", "Using backless before allowed by state law"],
    notes: "AirProtect foam in headrest. Similar to Nuna Aace in price bracket."
  },
  {
    id: "evenflo-spectrum", brand: "Evenflo", model: "Spectrum 2-in-1 Booster", type: "Booster",
    modelNumbers: ["31012021"], msrp: "$85", year: 2019, color: "#4a3a2a", site: SITES.evenflo,
    productUrl: "https://www.evenflo.com/shop/",
    modes: {
      highbackBooster: M({ weight: "40–120 lb", height: "44–57″" }, { wMin: 40, wMax: 120, hMax: 57, ageMin: 48 }),
      backlessBooster: M({ weight: "40–120 lb", height: "43–57″" }, { wMin: 40, wMax: 120, hMax: 57, ageMin: 48 })
    },
    expirationYears: 6, faaApproved: false, latchWeightMax: "120 lb",
    dimensions: "18″ D × 18″ W × 28″ H", seatWeight: "11 lb",
    installSteps: [
      { title: "LATCH attach (optional)", body: "Stabilizes seat when child exits." },
      { title: "Adjust headrest + backrest", body: "Belt guides move with headrest." },
      { title: "Shoulder belt at collarbone", body: "Never neck." },
      { title: "Lap belt on thighs", body: "Not belly." },
      { title: "Remove back after outgrowing highback", body: "Store the back safely." }
    ],
    commonMistakes: ["6-year expiration — shorter than most (check DOM)", "Using backless before 40 lb", "Shoulder belt slack"],
    notes: "Budget booster from Evenflo. Shorter expiration than premium competitors."
  },
  {
    id: "cosco-finale-dx", brand: "Cosco", model: "Finale DX 2-in-1 Booster", type: "Booster",
    modelNumbers: ["BC130DBX"], msrp: "$50", year: 2016, color: "#5a3a5a", site: SITES.cosco,
    productUrl: "https://www.coscokids.com/",
    modes: {
      highbackBooster: M({ weight: "40–100 lb", height: "43–52″" }, { wMin: 40, wMax: 100, hMax: 52, ageMin: 48 }),
      backlessBooster: M({ weight: "40–100 lb", height: "43–57″" }, { wMin: 40, wMax: 100, hMax: 57, ageMin: 48 })
    },
    expirationYears: 8, faaApproved: false, latchWeightMax: null,
    dimensions: "17″ D × 18″ W × 29″ H", seatWeight: "10 lb",
    installSteps: [
      { title: "Place on vehicle seat", body: "No LATCH — restraint depends on vehicle belt." },
      { title: "Adjust headrest", body: "Belt guide at shoulder." },
      { title: "Shoulder belt at collarbone", body: "Not neck." },
      { title: "Lap belt on thighs", body: "Not belly." },
      { title: "Backless conversion", body: "After outgrowing highback." }
    ],
    commonMistakes: ["No LATCH attach — seat slides when empty", "Belt at neck (common with small children)", "Using booster too early (under 40 lb)"],
    notes: "Very budget-friendly. No LATCH attachment — fully belt-positioning."
  },
];

async function main() {
  console.log(`Seeding ${CATALOG.length} seats…`);
  let inserted = 0;
  for (const seat of CATALOG) {
    await prisma.carSeat.upsert({
      where: { id: seat.id },
      update: seat,
      create: seat
    });
    inserted++;
    if (inserted % 10 === 0) console.log(`  ${inserted}/${CATALOG.length}`);
  }
  console.log(`✔ Seeded ${inserted} seats`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
