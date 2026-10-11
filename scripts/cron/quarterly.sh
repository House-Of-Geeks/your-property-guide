#!/usr/bin/env bash
# Quarterly sync — runs Jan/Apr/Jul/Oct 1st via Railway cronSchedule.
# Mirrors .github/workflows/sync-quarterly.yml so the GHA path can be retired.
#
# Failure isolation: each source runs independently; a single failure does not
# abort the rest. Sources record their own status in the DataSource table.
#
# Stats-source guard: the run counts, per state, the suburbs whose sales label
# the trust gate accepts, before the first source and after the last. If NSW
# or VIC lost more than 10%, it prints "!!! STATS-SOURCE GUARD FAILED", skips
# the revalidation and the IndexNow ping (they would push the withheld
# medians to the cache and to crawlers) and exits 1. On 1 Oct 2026 a run of
# this script from an image built before 3 Jul relabelled every NSW row
# rental-nsw and reported success (scripts/sync/repair-stats-source.ts).
set -u

# The commit this image was built from, so a stale image shows in the log.
echo "quarterly run: image commit ${RAILWAY_GIT_COMMIT_SHA:-unknown}"

run() { echo "::: $1 :::"; npx tsx scripts/sync/run.ts "$1" || echo "!!! $1 failed (non-fatal)"; }

GUARD_SNAPSHOT="$(mktemp "${TMPDIR:-/tmp}/stats-source-guard.XXXXXX")"
echo "::: stats-source-guard snapshot :::"
npx tsx scripts/sync/stats-source-guard.ts snapshot --out "$GUARD_SNAPSHOT" || echo "!!! stats-source-guard snapshot failed (the check at the end will fail)"

# Rentals
run rental-vic
run rental-nsw
run rental-sa
run rental-qld
# run rental-wa   # WA bond data: off until Jos approves the first import (manual in run.ts; needs scripts/sql/2026-10-01-suburb-rental-stat-median-rent-all.sql)

# Crime
run crime-nsw
run crime-vic
run crime-qld
run crime-sa
run crime-act
run crime-nt

# Sales (current quarter)
run sales-vic
run sales-vic-historical
run sales-sa
run sales-sa-historical
run sales-nsw

# Suburb metadata refresh
run import-suburbs
run nearby-suburbs

# Stop here, loudly, if the run took the sales label off NSW or VIC suburbs.
echo "::: stats-source-guard check :::"
if ! npx tsx scripts/sync/stats-source-guard.ts check --before "$GUARD_SNAPSHOT"; then
  echo "!!! STATS-SOURCE GUARD FAILED: revalidate-paths and indexnow-ping skipped; run scripts/sync/repair-stats-source.ts (dry run) and fix the feed before revalidating"
  rm -f "$GUARD_SNAPSHOT"
  exit 1
fi
rm -f "$GUARD_SNAPSHOT"

# Purge the ISR cache for every suburb/postcode page this run touched so the
# next request serves the new stats (non-fatal; skips itself if INDEXNOW_KEY
# is unset). Runs BEFORE the IndexNow ping so crawlers fetch fresh pages.
echo "::: revalidate-paths :::"
npx tsx scripts/sync/revalidate-paths.ts 48 || echo "!!! revalidate-paths failed (non-fatal)"

# Tell IndexNow-participating engines which suburb/postcode pages changed
# this run (non-fatal; skips itself if INDEXNOW_KEY is unset).
echo "::: indexnow-ping :::"
npx tsx scripts/sync/indexnow-ping.ts 48 || echo "!!! indexnow-ping failed (non-fatal)"

echo "quarterly run finished"
