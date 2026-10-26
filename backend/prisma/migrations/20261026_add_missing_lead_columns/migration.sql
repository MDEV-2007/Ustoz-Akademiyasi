-- AlterTable TrialRegistration: add missing columns for inquiry type, telegram integration and notifications
ALTER TABLE "TrialRegistration" ADD COLUMN IF NOT EXISTS "inquiryType" TEXT NOT NULL DEFAULT 'TRIAL_LESSON';
ALTER TABLE "TrialRegistration" ADD COLUMN IF NOT EXISTS "callbackTime" TIMESTAMP(3);
ALTER TABLE "TrialRegistration" ADD COLUMN IF NOT EXISTS "telegramUserId" TEXT;
ALTER TABLE "TrialRegistration" ADD COLUMN IF NOT EXISTS "telegramUsername" TEXT;
ALTER TABLE "TrialRegistration" ADD COLUMN IF NOT EXISTS "telegramChatId" TEXT;
ALTER TABLE "TrialRegistration" ADD COLUMN IF NOT EXISTS "telegramMessageId" INTEGER;
ALTER TABLE "TrialRegistration" ADD COLUMN IF NOT EXISTS "notificationStatus" TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE "TrialRegistration" ADD COLUMN IF NOT EXISTS "notificationError" TEXT;
ALTER TABLE "TrialRegistration" ADD COLUMN IF NOT EXISTS "lastNotificationAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TrialRegistration_notificationStatus_idx" ON "TrialRegistration"("notificationStatus");
