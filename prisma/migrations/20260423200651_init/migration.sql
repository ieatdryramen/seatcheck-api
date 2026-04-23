-- CreateTable
CREATE TABLE "CarSeat" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "modelNumbers" TEXT[],
    "msrp" TEXT,
    "year" INTEGER,
    "color" TEXT,
    "site" TEXT NOT NULL,
    "productUrl" TEXT NOT NULL,
    "expirationYears" INTEGER NOT NULL DEFAULT 7,
    "faaApproved" BOOLEAN NOT NULL DEFAULT false,
    "latchWeightMax" TEXT,
    "dimensions" TEXT,
    "seatWeight" TEXT,
    "modes" JSONB NOT NULL,
    "installSteps" JSONB NOT NULL,
    "commonMistakes" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarSeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recall" (
    "id" TEXT NOT NULL,
    "nhtsaId" TEXT NOT NULL,
    "carSeatId" TEXT,
    "manufacturer" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "componentDesc" TEXT,
    "summary" TEXT NOT NULL,
    "remedy" TEXT,
    "datePublished" TIMESTAMP(3) NOT NULL,
    "affectedUnitsText" TEXT,
    "rawPayload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "wantsRecallAlerts" BOOLEAN NOT NULL DEFAULT true,
    "wantsExpirationWarnings" BOOLEAN NOT NULL DEFAULT true,
    "wantsInstallTips" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TIMESTAMP(3),
    "weightLb" DOUBLE PRECISION,
    "heightIn" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedSeat" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "carSeatId" TEXT NOT NULL,
    "nickname" TEXT,
    "dateOfManufacture" TIMESTAMP(3) NOT NULL,
    "lastRecallCheckAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedSeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeatPhoto" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "carSeatId" TEXT,
    "storageKey" TEXT NOT NULL,
    "embedding" DOUBLE PRECISION[],
    "ocrText" TEXT,
    "identifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeatPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CarSeat_brand_idx" ON "CarSeat"("brand");

-- CreateIndex
CREATE INDEX "CarSeat_type_idx" ON "CarSeat"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Recall_nhtsaId_key" ON "Recall"("nhtsaId");

-- CreateIndex
CREATE INDEX "Recall_carSeatId_idx" ON "Recall"("carSeatId");

-- CreateIndex
CREATE INDEX "Recall_datePublished_idx" ON "Recall"("datePublished");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Child_userId_idx" ON "Child"("userId");

-- CreateIndex
CREATE INDEX "SavedSeat_userId_idx" ON "SavedSeat"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedSeat_userId_carSeatId_key" ON "SavedSeat"("userId", "carSeatId");

-- CreateIndex
CREATE INDEX "SeatPhoto_userId_idx" ON "SeatPhoto"("userId");

-- CreateIndex
CREATE INDEX "SeatPhoto_carSeatId_idx" ON "SeatPhoto"("carSeatId");

-- AddForeignKey
ALTER TABLE "Recall" ADD CONSTRAINT "Recall_carSeatId_fkey" FOREIGN KEY ("carSeatId") REFERENCES "CarSeat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSeat" ADD CONSTRAINT "SavedSeat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSeat" ADD CONSTRAINT "SavedSeat_carSeatId_fkey" FOREIGN KEY ("carSeatId") REFERENCES "CarSeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
