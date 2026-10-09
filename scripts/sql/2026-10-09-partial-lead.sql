-- "PartialLead": guide-funnel visitors who finished the name + email step
-- but not the mobile step. Same model as Why Solar's PartialLead.
--
-- WHY: from Oct 2026 the guide funnels capture name + email first and the
-- mobile on its own step. A visitor who stops at the mobile step is saved
-- here (one row per email per guide, updated in place), not in "Lead": they
-- are not a lead the team works or an agent receives until they give a
-- mobile. /api/leads deletes the rows for an email when that email completes
-- a lead. Sent 24/7's recovery email links back with ?ws_resume=<id>, which
-- /api/partial-lead/restore reads.
--
-- The statements are the output of
--   npx prisma migrate diff --from-schema <schema before> --to-schema prisma/schema.prisma --script
-- (not prisma db push: production carries School.geom and yfg_leads, which
-- the schema lacks, and db push would drop them).
--
-- SAFETY:
--   - Additive only: a new, empty table and its two indexes. Nothing existing
--     is altered, rewritten or locked beyond the catalogue change.
--   - Must run BEFORE the code that uses it deploys: /api/partial-lead and
--     /api/leads (for a guide download without a phone) write to it.
--   - Undo: DROP TABLE "PartialLead";

BEGIN;

-- CreateTable
CREATE TABLE "PartialLead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "source" TEXT NOT NULL,
    "data" JSONB,
    "pageUrl" TEXT,
    "gclid" TEXT,
    "attribution" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartialLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PartialLead_createdAt_idx" ON "PartialLead"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PartialLead_email_source_key" ON "PartialLead"("email", "source");

COMMIT;
