#!/usr/bin/env bash
# Travel Healthcare Hotspot – full pipeline
# Usage: ./scripts/run_all.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

echo "=== Step 1: Scrape ==="
python3 "$SCRIPT_DIR/scrape_hotspots.py"

echo ""
echo "=== Step 2: Generate Report ==="
python3 "$SCRIPT_DIR/generate_report.py"

echo ""
echo "=== Done ==="
echo "Artifacts:"
echo "  $REPO_ROOT/data/travel_hotspots/latest.csv"
echo "  $REPO_ROOT/reports/travel_hotspots/REPORT.md"
echo "  $REPO_ROOT/reports/travel_hotspots/SOURCES.md"
echo "  $REPO_ROOT/reports/travel_hotspots/CHANGELOG.md"
