/*
  Warnings:

  - You are about to drop the column `conferenceId` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `conferenceLink` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `documents` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `meetingRoom` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `participantEmails` on the `event` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'MAYBE', 'NO_RESPONSE');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('ORGANIZER', 'ATTENDEE', 'OPTIONAL_ATTENDEE', 'PRESENTER', 'MODERATOR');

-- AlterTable
ALTER TABLE "event" DROP COLUMN "conferenceId",
DROP COLUMN "conferenceLink",
DROP COLUMN "documents",
DROP COLUMN "meetingRoom",
DROP COLUMN "participantEmails";

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

-- AddForeignKey
ALTER TABLE "event_conference" ADD CONSTRAINT "event_conference_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
