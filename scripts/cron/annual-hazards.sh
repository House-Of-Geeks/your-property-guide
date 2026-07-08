#!/usr/bin/env bash
# Annual hazard + walkability + climate sync.
# Fires once a year on 1 April via Railway cronSchedule.
# Mirrors .github/workflows/sync-hazard-walkability.yml.
set -u

run() { echo "::: $1 :::"; npx tsx scripts/sync/run.ts "$1" || echo "!!! $1 failed (non-fatal)"; }

run hazard-flood
run hazard-bushfire
run walkability
run bom-climate

# Tell IndexNow-participating engines which suburb/postcode pages changed
# this run (non-fatal; skips itself if INDEXNOW_KEY is unset).
echo "::: indexnow-ping :::"
npx tsx scripts/sync/indexnow-ping.ts 48 || echo "!!! indexnow-ping failed (non-fatal)"

echo "annual hazards run finished"
