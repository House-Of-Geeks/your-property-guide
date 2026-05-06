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

echo "annual schools/census run finished"
