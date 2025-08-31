/*
  Warnings:

  - You are about to drop the `_CardToTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CredentialToTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `card` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `card_metadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `container` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `credential` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `credential_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `credential_metadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `encrypted_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `health` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `platform` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `secret` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `secret_metadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RepeatPattern" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "Timezone" AS ENUM ('UTC', 'AMERICA_NEW_YORK', 'AMERICA_CHICAGO', 'AMERICA_DENVER', 'AMERICA_LOS_ANGELES', 'EUROPE_LONDON', 'EUROPE_PARIS', 'EUROPE_BERLIN', 'ASIA_TOKYO', 'ASIA_SINGAPORE', 'ASIA_DUBAI', 'AUSTRALIA_SYDNEY');

-- CreateEnum
CREATE TYPE "ReminderUnit" AS ENUM ('MINUTES', 'HOURS', 'DAYS', 'WEEKS');

-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'RETRY');

-- DropForeignKey
ALTER TABLE "_CardToTag" DROP CONSTRAINT "_CardToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_CardToTag" DROP CONSTRAINT "_CardToTag_B_fkey";

-- DropForeignKey
ALTER TABLE "_CredentialToTag" DROP CONSTRAINT "_CredentialToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_CredentialToTag" DROP CONSTRAINT "_CredentialToTag_B_fkey";

-- DropForeignKey
ALTER TABLE "card" DROP CONSTRAINT "card_containerId_fkey";

-- DropForeignKey
ALTER TABLE "card" DROP CONSTRAINT "card_cvvEncryptionId_fkey";

-- DropForeignKey
ALTER TABLE "card" DROP CONSTRAINT "card_numberEncryptionId_fkey";

-- DropForeignKey
ALTER TABLE "card" DROP CONSTRAINT "card_userId_fkey";

-- DropForeignKey
ALTER TABLE "card_metadata" DROP CONSTRAINT "card_metadata_cardId_fkey";

-- DropForeignKey
ALTER TABLE "container" DROP CONSTRAINT "container_userId_fkey";

-- DropForeignKey
ALTER TABLE "credential" DROP CONSTRAINT "credential_containerId_fkey";

-- DropForeignKey
ALTER TABLE "credential" DROP CONSTRAINT "credential_passwordEncryptionId_fkey";

-- DropForeignKey
ALTER TABLE "credential" DROP CONSTRAINT "credential_platformId_fkey";

-- DropForeignKey
ALTER TABLE "credential" DROP CONSTRAINT "credential_userId_fkey";

-- DropForeignKey
ALTER TABLE "credential_history" DROP CONSTRAINT "credential_history_credentialId_fkey";

-- DropForeignKey
ALTER TABLE "credential_history" DROP CONSTRAINT "credential_history_passwordEncryptionId_fkey";

-- DropForeignKey
ALTER TABLE "credential_history" DROP CONSTRAINT "credential_history_userId_fkey";

-- DropForeignKey
ALTER TABLE "credential_metadata" DROP CONSTRAINT "credential_metadata_credentialId_fkey";

-- DropForeignKey
ALTER TABLE "platform" DROP CONSTRAINT "platform_userId_fkey";

-- DropForeignKey
ALTER TABLE "secret" DROP CONSTRAINT "secret_containerId_fkey";

-- DropForeignKey
ALTER TABLE "secret" DROP CONSTRAINT "secret_userId_fkey";

-- DropForeignKey
ALTER TABLE "secret" DROP CONSTRAINT "secret_valueEncryptionId_fkey";

-- DropForeignKey
ALTER TABLE "secret_metadata" DROP CONSTRAINT "secret_metadata_secretId_fkey";

-- DropForeignKey
ALTER TABLE "tag" DROP CONSTRAINT "tag_containerId_fkey";

-- DropForeignKey
ALTER TABLE "tag" DROP CONSTRAINT "tag_userId_fkey";

-- DropTable
DROP TABLE "_CardToTag";

-- DropTable
DROP TABLE "_CredentialToTag";

-- DropTable
DROP TABLE "card";

-- DropTable
DROP TABLE "card_metadata";

-- DropTable
DROP TABLE "container";

-- DropTable
DROP TABLE "credential";

-- DropTable
DROP TABLE "credential_history";

-- DropTable
DROP TABLE "credential_metadata";

-- DropTable
DROP TABLE "encrypted_data";

-- DropTable
DROP TABLE "health";

-- DropTable
DROP TABLE "platform";

-- DropTable
DROP TABLE "secret";

-- DropTable
DROP TABLE "secret_metadata";

-- DropTable
DROP TABLE "tag";

-- DropEnum
DROP TYPE "AccountStatus";

-- DropEnum
DROP TYPE "CardProvider";

-- DropEnum
DROP TYPE "CardStatus";

-- DropEnum
DROP TYPE "CardType";

-- DropEnum
DROP TYPE "ContainerType";

-- DropEnum
DROP TYPE "PlatformStatus";

-- DropEnum
DROP TYPE "SecretStatus";

-- DropEnum
DROP TYPE "SecretType";

-- CreateTable
CREATE TABLE "calendar" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "emoji" TEXT NOT NULL DEFAULT '📅',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '📅',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "timezone" "Timezone" NOT NULL DEFAULT 'UTC',
    "isAllDay" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "meetingRoom" TEXT,
    "conferenceLink" TEXT,
    "conferenceId" TEXT,
    "participantEmails" TEXT[],
    "maxParticipants" INTEGER,
    "links" TEXT[],
    "documents" TEXT[],
    "aiConfidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_recurrence" (
    "id" TEXT NOT NULL,
    "pattern" "RepeatPattern" NOT NULL DEFAULT 'NONE',
    "endDate" TIMESTAMP(3),
    "customRule" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "event_recurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_reminder" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "unit" "ReminderUnit" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "event_reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "input_processing_session" (
    "id" TEXT NOT NULL,
    "userInput" TEXT NOT NULL,
    "processedOutput" JSONB NOT NULL,
    "model" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "processingTimeMs" INTEGER,
    "tokensUsed" INTEGER,
    "confidence" DOUBLE PRECISION,
    "status" "ProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "input_processing_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "calendar_userId_idx" ON "calendar"("userId");

-- CreateIndex
CREATE INDEX "calendar_isDefault_idx" ON "calendar"("isDefault");

-- CreateIndex
CREATE INDEX "calendar_isActive_idx" ON "calendar"("isActive");

-- CreateIndex
CREATE INDEX "event_userId_idx" ON "event"("userId");

-- CreateIndex
CREATE INDEX "event_calendarId_idx" ON "event"("calendarId");

-- CreateIndex
CREATE INDEX "event_startTime_idx" ON "event"("startTime");

-- CreateIndex
CREATE UNIQUE INDEX "event_recurrence_eventId_key" ON "event_recurrence"("eventId");

-- CreateIndex
CREATE INDEX "event_recurrence_pattern_idx" ON "event_recurrence"("pattern");

-- CreateIndex
CREATE INDEX "event_reminder_eventId_idx" ON "event_reminder"("eventId");

-- CreateIndex
CREATE INDEX "input_processing_session_userId_idx" ON "input_processing_session"("userId");

-- CreateIndex
CREATE INDEX "input_processing_session_eventId_idx" ON "input_processing_session"("eventId");

-- CreateIndex
CREATE INDEX "input_processing_session_status_idx" ON "input_processing_session"("status");

-- CreateIndex
CREATE INDEX "input_processing_session_createdAt_idx" ON "input_processing_session"("createdAt");

-- AddForeignKey
ALTER TABLE "calendar" ADD CONSTRAINT "calendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_recurrence" ADD CONSTRAINT "event_recurrence_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_reminder" ADD CONSTRAINT "event_reminder_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "input_processing_session" ADD CONSTRAINT "input_processing_session_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "input_processing_session" ADD CONSTRAINT "input_processing_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
