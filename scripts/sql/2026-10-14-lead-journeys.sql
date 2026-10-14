-- Lead journeys (14 Oct 2026): the learning path and the introduction path
-- kept apart on the Lead table, plus LeadEvent for real outcomes.
--
-- WHY: guide subscribers and introduction requests were the same kind of row
-- (type "guide-download" with an optional call: true), consent lived inside a
-- free-text message, and nothing recorded what happened after a lead was sent
-- (accepted, appraisal booked, agency agreement signed, feedback). The
-- "confident moves" rebuild needs:
--   - Lead.kind / journey / service / stage / timeframe / state
--   - the permission (introConsent + consentText) and a separate marketingConsent
--   - preferredContact / bestTime
--   - status / statusReason / statusAt for introductions
--   - requestKey (unique) so a double submit can't make two rows
--   - groupId linking the two rows of a combined buying-and-selling request
--   - token (unique) for feedback and unsubscribe links
--   - sequence fields for the optional guidance email series
--   - LeadEvent: one row per outcome
--
-- The statements are the output of
--   npx prisma migrate diff --from-schema <schema before> --to-schema prisma/schema.prisma --script
-- (not prisma db push: production carries School.geom and yfg_leads, which
-- the schema lacks, and db push would drop them).
--
-- SAFETY:
--   - Additive only: nullable columns (no default, so no table rewrite), a
--     new empty table, and indexes. Existing rows are untouched.
--   - The unique indexes are on new, all-NULL columns, so they cannot fail.
--   - Must run BEFORE the code that uses it deploys: /api/leads,
--     /api/introductions, /api/plans and the admin leads page read and
--     write these columns, and Prisma selects every column of Lead.
--   - Run with a short lock timeout; the Lead table is small (~50 rows).
--   - Undo: DROP TABLE "LeadEvent"; then ALTER TABLE "Lead" DROP COLUMN for
--     each column below, and drop the indexes.

BEGIN;
SET LOCAL lock_timeout = '5s';

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "bestTime" TEXT,
ADD COLUMN     "consentText" TEXT,
ADD COLUMN     "groupId" TEXT,
ADD COLUMN     "introConsent" BOOLEAN,
ADD COLUMN     "journey" TEXT,
ADD COLUMN     "kind" TEXT,
ADD COLUMN     "marketingConsent" BOOLEAN,
ADD COLUMN     "preferredContact" TEXT,
ADD COLUMN     "requestKey" TEXT,
ADD COLUMN     "sequence" TEXT,
ADD COLUMN     "sequenceNextAt" TIMESTAMP(3),
ADD COLUMN     "sequenceStep" INTEGER,
ADD COLUMN     "service" TEXT,
ADD COLUMN     "stage" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "statusAt" TIMESTAMP(3),
ADD COLUMN     "statusReason" TEXT,
ADD COLUMN     "timeframe" TEXT,
ADD COLUMN     "token" TEXT,
ADD COLUMN     "unsubscribedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "LeadEvent" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "detail" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadEvent_leadId_idx" ON "LeadEvent"("leadId");

-- CreateIndex
CREATE INDEX "LeadEvent_type_createdAt_idx" ON "LeadEvent"("type", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_requestKey_key" ON "Lead"("requestKey");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_token_key" ON "Lead"("token");

-- CreateIndex
CREATE INDEX "Lead_kind_createdAt_idx" ON "Lead"("kind", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_sequenceNextAt_idx" ON "Lead"("sequenceNextAt");

-- CreateIndex
CREATE INDEX "Lead_groupId_idx" ON "Lead"("groupId");

-- AddForeignKey
ALTER TABLE "LeadEvent" ADD CONSTRAINT "LeadEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;


COMMIT;
