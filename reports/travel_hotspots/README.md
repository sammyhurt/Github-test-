# Travel Healthcare Hotspot Reports

Weekly snapshots of travel nursing & allied health demand across U.S. states, cities, and facilities.

## Reports

| File | Description |
|------|-------------|
| [REPORT.md](REPORT.md) | Latest weekly report — exec summary, state/city/facility rankings, movers |
| [SOURCES.md](SOURCES.md) | Data sources, scraping methodology, and known limitations |
| [CHANGELOG.md](CHANGELOG.md) | Dated log of every scraper run and what changed |

## Data Files

Raw data lives in [`data/travel_hotspots/`](../../data/travel_hotspots/):

| File | Description |
|------|-------------|
| `latest.csv` | Most recent snapshot |
| `summary.json` | State + city aggregates |
| `history/YYYY-MM-DD.csv` | One dated file per run |

## Update Schedule

Reports are regenerated every **Monday** via the [GitHub Actions workflow](../../.github/workflows/travel_hotspots_weekly.yml).
