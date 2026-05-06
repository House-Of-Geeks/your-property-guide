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

echo "quarterly run finished"
