#!/usr/bin/env bash
# Quarterly sync — runs Jan/Apr/Jul/Oct 1st via Railway cronSchedule.
# Mirrors .github/workflows/sync-quarterly.yml so the GHA path can be retired.
#
# Failure isolation: each source runs independently; a single failure does not
# abort the rest. Sources record their own status in the DataSource table.
set -u

run() { echo "::: $1 :::"; npx tsx scripts/sync/run.ts "$1" || echo "!!! $1 failed (non-fatal)"; }

# Rentals
run rental-vic
run rental-nsw
run rental-sa
run rental-qld

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
