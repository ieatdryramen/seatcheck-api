# SeatCheck API

Backend for SeatCheck — catalog lookup, saved seats, children, NHTSA recall sync, fit-check, and photo identification (OCR stub ready for a vision model).

Node 20 · Express · Prisma · PostgreSQL · JWT auth · Socrata for NHTSA recalls.

---

## Local setup

### 1. Install Postgres and Node 20+

```bash
# macOS
brew install postgresql@16 node
brew services start postgresql@16
createdb seatcheck

# Linux
sudo apt install postgresql nodejs
sudo -u postgres createdb seatcheck
```

### 2. Install dependencies and configure

```bash
npm install
cp .env.example .env
# edit .env: set DATABASE_URL and generate a JWT_SECRET
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Run migrations and seed the catalog

```bash
npm run db:migrate    # creates tables
npm run db:seed       # loads all 30 seats
```

### 4. (Optional) Pull live NHTSA recalls

```bash
npm run recall:sync              # only recalls since last sync
npm run recall:sync -- --full    # backfill full history — takes longer
```

### 5. Start the server

```bash
npm run dev           # auto-reloads on changes
# or
npm start
```

Server runs on `http://localhost:3000`. Health check at `/health`.

---

## API reference

All responses are JSON. Auth endpoints return a `token` field — include as `Authorization: Bearer <token>` on protected requests.

### Catalog (public)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/catalog` | List seats. Query: `?type=Infant&brand=Chicco&q=keyfit&limit=50&offset=0` |
| `GET` | `/api/catalog/search?q=...` | Scored search, same algorithm as the app |
| `GET` | `/api/catalog/:id` | One seat with recalls attached |
| `GET` | `/api/catalog/meta/brands` | Distinct brand list |

### Auth

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Body: `{ email, password, name? }` |
| `POST` | `/api/auth/login` | Body: `{ email, password }` |
| `GET` | `/api/auth/me` | Returns current user + notification prefs |
| `PATCH` | `/api/auth/me` | Update name or notification toggles |

### Children (auth required)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/children` | List the signed-in user's children |
| `POST` | `/api/children` | Body: `{ name, weightLb?, heightIn?, dob? }` |
| `PATCH` | `/api/children/:id` | Update any field |
| `DELETE` | `/api/children/:id` | Remove |

### Saved seats (auth required)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/saved-seats` | Returns saved seats with server-computed `expirationStatus` and `hasOpenRecall` |
| `POST` | `/api/saved-seats` | Body: `{ carSeatId, dateOfManufacture, nickname? }` (upsert) |
| `DELETE` | `/api/saved-seats/:id` | Remove |

### Recalls

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/recalls?limit=30` | Latest recalls feed |
| `GET` | `/api/recalls/for-seat/:carSeatId` | Recalls for one catalog seat |
| `POST` | `/api/recalls/sync` | Manual sync (requires `X-Admin-Token` header in prod) |

### Fit-check

Evaluates every seat against a child. Returns `fitting` (sorted by most modes fit) and `notFitting` (with human-readable `reasons`).

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/fit-check` | Ad-hoc: body `{ weightLb?, heightIn?, ageMonths? }` |
| `GET` | `/api/fit-check/child/:id` | Uses stored child (auth required) |

### Identify (OCR stub)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/identify` | Body: `{ ocrText }` → top-3 candidates with confidence scores |

Phase 4 will accept `imageBase64` and run CLIP embeddings; response shape stays the same.

---

## Deploy to Railway

1. Install CLI: `npm install -g @railway/cli`
2. From this directory:
   ```bash
   railway login
   railway init                    # creates the project
   railway add --database postgres # provisions Postgres; sets DATABASE_URL
   ```
3. Set required vars in the Railway dashboard → Variables:
   - `JWT_SECRET` — generate a fresh long random string
   - `NODE_ENV=production`
   - `CORS_ORIGIN` — your frontend origin(s), comma-separated
   - `ENABLE_RECALL_CRON=true`
   - `ADMIN_TOKEN` — any long random string
   - `SOCRATA_APP_TOKEN` — optional, raises rate limits
4. Deploy:
   ```bash
   railway up
   ```
5. The `startCommand` in `railway.json` runs `prisma migrate deploy` before starting, so schema changes ship safely. To seed the catalog once after first deploy:
   ```bash
   railway run npm run db:seed
   railway run npm run recall:sync -- --full
   ```

---

## Project layout

```
src/
├── server.js                    # entry point, cron scheduler
├── lib/
│   ├── prisma.js                # client singleton
│   ├── errors.js                # AppError + asyncHandler
│   └── auth.js                  # JWT sign/verify, requireAuth middleware
├── routes/
│   ├── catalog.js
│   ├── auth.js
│   ├── children.js
│   ├── savedSeats.js
│   ├── recalls.js
│   ├── fitCheck.js
│   └── identify.js
└── services/
    └── recallSync.js            # NHTSA Socrata fetch + match + upsert

prisma/
├── schema.prisma                # full data model
└── seed.js                      # 30-seat catalog with parsed numeric bounds
```

---

## Notes

- **Fit-check numeric bounds.** Each seat's `modes` JSON stores both display strings and parsed numeric bounds (`weightMin`, `weightMax`, `heightMax`, `ageMinMonths`). The fit-check route reads the numeric fields; the UI reads the strings. When adding a new seat, include both.
- **Recall matching.** `syncRecalls` fuzzy-matches NHTSA records against the catalog by brand + model + model number. The match threshold is `score >= 25`; unmatched recalls still get stored (with `carSeatId` null) so they show up in the general feed but aren't attached to a specific seat.
- **Photo identification.** The `/api/identify` endpoint currently scores OCR text against catalog brand/model/model-number strings. When adding CLIP: the schema already has `SeatPhoto.embedding Float[]`; enable `pgvector` on Postgres, add a `vector(512)` column, and the endpoint's shape stays the same.
- **Nightly sync in prod.** Only one instance should run the cron. If you scale to multiple replicas, move the cron to a dedicated Railway service.
