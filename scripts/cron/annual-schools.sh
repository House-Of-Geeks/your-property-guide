#!/usr/bin/env bash
# Annual school + ABS census + sales-abs + WA crime + RAI sync.
# Fires once a year on 15 March via Railway cronSchedule.
# Mirrors .github/workflows/sync-annual.yml.
set -u

run() { echo "::: $1 :::"; npx tsx scripts/sync/run.ts "$1" || echo "!!! $1 failed (non-fatal)"; }

run acara-schools
run crime-wa
run abs-census
run sales-abs
run sales-qld
run sales-wa
run housing-rai

# School pages and the suburb school sub-pages are 7-day ISR; purge them so
# the new ACARA year shows up on the next request (non-fatal).
echo "::: revalidate-paths (schools) :::"
npx tsx scripts/sync/revalidate-paths.ts --pattern "/schools/[slug]" --pattern "/suburbs/[slug]/schools" || echo "!!! revalidate-paths failed (non-fatal)"

echo "annual schools/census run finished"
