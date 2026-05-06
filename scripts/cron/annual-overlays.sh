#!/usr/bin/env bash
# Annual parcel-overlay + school-catchment ingest.
# Heavy point-in-polygon jobs against G-NAF — fires 15 April via Railway
# cronSchedule, after the hazards run, mirroring sync-overlays-annual.yml.
set -u

run() { echo "::: $1 :::"; npx tsx scripts/sync/run.ts "$1" || echo "!!! $1 failed (non-fatal)"; }

# School catchments
run catchment-nsw-primary
run catchment-nsw-secondary
run catchment-vic-primary
run catchment-vic-secondary
run catchment-qld-primary
run catchment-qld-secondary
run catchment-act-primary
run catchment-act-secondary
run catchment-tas-primary

# Zoning
run zoning-nsw
run zoning-vic
run zoning-qld
run zoning-wa
run zoning-sa
run zoning-tas
run zoning-act

# Flood overlays
run flood-nsw
run flood-vic
run flood-qld
run flood-wa
run flood-act

# Bushfire overlays
run bushfire-nsw
run bushfire-vic
run bushfire-wa
run bushfire-tas
run bushfire-act

# Heritage overlays
run heritage-nsw
run heritage-vic
run heritage-qld
run heritage-wa
run heritage-tas
run heritage-act

echo "annual overlays run finished"
