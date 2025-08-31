-- CreateEnum
CREATE TYPE "RepeatPattern" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "Timezone" AS ENUM ('UTC', 'AMERICA_NEW_YORK', 'AMERICA_CHICAGO', 'AMERICA_DENVER', 'AMERICA_LOS_ANGELES', 'EUROPE_LONDON', 'EUROPE_PARIS', 'EUROPE_BERLIN', 'ASIA_TOKYO', 'ASIA_SINGAPORE', 'ASIA_DUBAI', 'AUSTRALIA_SYDNEY');

-- CreateEnum
CREATE TYPE "ReminderUnit" AS ENUM ('MINUTES', 'HOURS', 'DAYS', 'WEEKS');

-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'MAYBE', 'NO_RESPONSE');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('ORGANIZER', 'ATTENDEE', 'OPTIONAL_ATTENDEE', 'PRESENTER', 'MODERATOR');

-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'RETRY');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "scope" TEXT,
    "password" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waitlist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waitlist_pkey" PRIMARY KEY ("id")
);

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
    "isAllDay" BOOLEAN NOT NULL DEFAULT false,
    "timezone" "Timezone" NOT NULL DEFAULT 'UTC',
    "location" TEXT,
    "maxParticipants" INTEGER,
    "links" TEXT[],
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
CREATE TABLE "event_conference" (
    "id" TEXT NOT NULL,
    "meetingRoom" TEXT,
    "conferenceLink" TEXT,
    "conferenceId" TEXT,
    "dialInNumber" TEXT,
    "accessCode" TEXT,
    "hostKey" TEXT,
    "isRecorded" BOOLEAN NOT NULL DEFAULT false,
    "maxDuration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "event_conference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_participant" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "ParticipantRole" NOT NULL DEFAULT 'ATTENDEE',
    "rsvpStatus" "RsvpStatus" NOT NULL DEFAULT 'PENDING',
    "isOrganizer" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "event_participant_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_email_key" ON "waitlist"("email");

-- CreateIndex
CREATE INDEX "waitlist_email_idx" ON "waitlist"("email");

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
CREATE UNIQUE INDEX "event_conference_eventId_key" ON "event_conference"("eventId");

-- CreateIndex
CREATE INDEX "event_participant_eventId_idx" ON "event_participant"("eventId");

-- CreateIndex
CREATE INDEX "event_participant_email_idx" ON "event_participant"("email");

-- CreateIndex
CREATE INDEX "event_participant_rsvpStatus_idx" ON "event_participant"("rsvpStatus");

-- CreateIndex
CREATE UNIQUE INDEX "event_participant_eventId_email_key" ON "event_participant"("eventId", "email");

-- CreateIndex
CREATE INDEX "input_processing_session_userId_idx" ON "input_processing_session"("userId");

-- CreateIndex
CREATE INDEX "input_processing_session_eventId_idx" ON "input_processing_session"("eventId");

-- CreateIndex
CREATE INDEX "input_processing_session_status_idx" ON "input_processing_session"("status");

-- CreateIndex
CREATE INDEX "input_processing_session_createdAt_idx" ON "input_processing_session"("createdAt");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "event_conference" ADD CONSTRAINT "event_conference_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "input_processing_session" ADD CONSTRAINT "input_processing_session_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "input_processing_session" ADD CONSTRAINT "input_processing_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
