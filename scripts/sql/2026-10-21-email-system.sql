-- The email system (21 Oct 2026): EmailMessage, EmailEvent, EmailSuppression,
-- NewsletterIssue. Generated from prisma/schema.prisma with
-- `prisma migrate diff` against origin/main. Additive only: four new tables,
-- their indexes and one foreign key; no existing table or row changes.
--
-- Apply to production by hand, before deploying the code that uses them
-- (the routes write EmailMessage rows on every send):
--   psql "$DATABASE_URL" -f scripts/sql/2026-10-21-email-system.sql
-- then check: \d "EmailMessage"  (and the other three).
BEGIN;
-- CreateTable
CREATE TABLE "EmailMessage" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "stream" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "toEmail" TEXT NOT NULL,
    "cc" TEXT,
    "leadId" TEXT,
    "newsletterIssueId" TEXT,
    "subject" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "replyTo" TEXT,
    "headers" JSONB,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMP(3),
    "lockedBy" TEXT,
    "providerMessageId" TEXT,
    "lastError" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailEvent" (
    "id" TEXT NOT NULL,
    "sgEventId" TEXT NOT NULL,
    "messageId" TEXT,
    "event" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "raw" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailSuppression" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailSuppression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterIssue" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "preheader" TEXT,
    "heading" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "linkLabel" TEXT,
    "linkHref" TEXT,
    "showImage" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "audienceSize" INTEGER,
    "testSentTo" TEXT,
    "testSentAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "publishedBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterIssue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailMessage_key_key" ON "EmailMessage"("key");

-- CreateIndex
CREATE INDEX "EmailMessage_status_nextAttemptAt_idx" ON "EmailMessage"("status", "nextAttemptAt");

-- CreateIndex
CREATE INDEX "EmailMessage_toEmail_idx" ON "EmailMessage"("toEmail");

-- CreateIndex
CREATE INDEX "EmailMessage_leadId_idx" ON "EmailMessage"("leadId");

-- CreateIndex
CREATE INDEX "EmailMessage_newsletterIssueId_idx" ON "EmailMessage"("newsletterIssueId");

-- CreateIndex
CREATE INDEX "EmailMessage_stream_createdAt_idx" ON "EmailMessage"("stream", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmailEvent_sgEventId_key" ON "EmailEvent"("sgEventId");

-- CreateIndex
CREATE INDEX "EmailEvent_messageId_idx" ON "EmailEvent"("messageId");

-- CreateIndex
CREATE INDEX "EmailEvent_event_occurredAt_idx" ON "EmailEvent"("event", "occurredAt");

-- CreateIndex
CREATE INDEX "EmailSuppression_email_idx" ON "EmailSuppression"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailSuppression_email_scope_key" ON "EmailSuppression"("email", "scope");

-- AddForeignKey
ALTER TABLE "EmailEvent" ADD CONSTRAINT "EmailEvent_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "EmailMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
