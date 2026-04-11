-- AlterTable: Add anonymousSessionId and review/fulfillment tracking fields to Divination
ALTER TABLE "Divination" ADD COLUMN "anonymousSessionId" TEXT;
ALTER TABLE "Divination" ADD COLUMN "reviewNote" TEXT;
ALTER TABLE "Divination" ADD COLUMN "accuracyScore" INTEGER;
ALTER TABLE "Divination" ADD COLUMN "reviewedAt" TIMESTAMP(3);
ALTER TABLE "Divination" ADD COLUMN "fulfilled" BOOLEAN;
ALTER TABLE "Divination" ADD COLUMN "fulfilledAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Divination_anonymousSessionId_idx" ON "Divination"("anonymousSessionId");
