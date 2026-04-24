-- AlterTable
ALTER TABLE "EmailSubscription" ADD COLUMN "lastEmailSentAt" TIMESTAMP(3),
ADD COLUMN "unsubscribedAt" TIMESTAMP(3),
ADD COLUMN "bounced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "bouncedAt" TIMESTAMP(3);
