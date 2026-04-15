#!/bin/bash
# Full G-NAF import: all states → link suburbs → macOS notification
#
# Usage:
#   bash scripts/import-gnaf-all.sh              # download + extract + import all
#   bash scripts/import-gnaf-all.sh --resume     # skip completed states
#   bash scripts/import-gnaf-all.sh --skip-download  # ZIP already at /tmp/gnaf.zip

set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="/tmp"
IMPORT_LOG="$LOG_DIR/gnaf-import-all.log"
LINK_LOG="$LOG_DIR/gnaf-link-suburbs.log"

cd "$REPO"

notify() {
  local title="$1" msg="$2"
  osascript -e "display notification \"$msg\" with title \"$title\" sound name \"Glass\"" 2>/dev/null || true
}

echo "════════════════════════════════════════"
echo " G-NAF full import — $(date '+%d %b %Y %H:%M')"
echo " Logs: $IMPORT_LOG"
echo "════════════════════════════════════════"

notify "G-NAF Import" "Starting full import…"

# Pass all args through to the import script
npx tsx scripts/seed/import-gnaf.ts "$@" 2>&1 | tee "$IMPORT_LOG"

if [ ${PIPESTATUS[0]} -ne 0 ]; then
  notify "G-NAF Import ❌" "Import failed — check $IMPORT_LOG"
  echo "Import failed." >&2
  exit 1
fi

echo ""
echo "────────────────────────────────────────"
echo " Linking suburb slugs…"
echo "────────────────────────────────────────"

npx tsx scripts/seed/import-gnaf.ts --link-suburbs 2>&1 | tee "$LINK_LOG"

if [ ${PIPESTATUS[0]} -ne 0 ]; then
  notify "G-NAF Import ❌" "link-suburbs failed — check $LINK_LOG"
  exit 1
fi

TOTAL=$(grep -o '[0-9,]* inserted' "$IMPORT_LOG" | tail -1 || echo "?")
notify "G-NAF Import ✅" "Done! $TOTAL — suburbs linked."
echo ""
echo "✅ All done. $TOTAL addresses imported and suburbs linked."
