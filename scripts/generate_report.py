#!/usr/bin/env python3
"""
Travel Healthcare Hotspot Report Generator
Reads CSV + summary JSON produced by the scraper and writes:
  reports/travel_hotspots/REPORT.md
  reports/travel_hotspots/SOURCES.md
  reports/travel_hotspots/CHANGELOG.md
"""

import csv
import json
import os
from datetime import date, datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data" / "travel_hotspots"
REPORTS_DIR = REPO_ROOT / "reports" / "travel_hotspots"
TODAY = date.today().isoformat()
NOW_UTC = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")

LATEST_CSV = DATA_DIR / "latest.csv"
SUMMARY_JSON = DATA_DIR / "summary.json"
REPORT_MD = REPORTS_DIR / "REPORT.md"
SOURCES_MD = REPORTS_DIR / "SOURCES.md"
CHANGELOG_MD = REPORTS_DIR / "CHANGELOG.md"


def load_facilities() -> list[dict]:
    if not LATEST_CSV.exists():
        return []
    rows = []
    with open(LATEST_CSV, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            row["active_postings"] = int(row.get("active_postings", 0))
            rows.append(row)
    return rows


def load_summary() -> dict:
    if not SUMMARY_JSON.exists():
        return {}
    with open(SUMMARY_JSON, encoding="utf-8") as f:
        return json.load(f)


def movement_arrow(wow: str) -> str:
    if wow == "NEW":
        return "🆕"
    try:
        v = int(wow)
        if v > 0:
            return f"▲ {wow}"
        elif v < 0:
            return f"▼ {wow}"
        return "→ 0"
    except ValueError:
        return wow


def write_report(facilities: list[dict], summary: dict):
    states = summary.get("state_summary", [])[:10]
    cities = summary.get("city_summary", [])[:10]
    top_facilities = [f for f in facilities if f["rank"] != ""][:25]

    # Movers: biggest positive / negative WoW
    movers_up = []
    movers_down = []
    for f in facilities:
        wow = f.get("wow_movement", "NEW")
        if wow in ("NEW", "0", ""):
            continue
        try:
            v = int(wow)
            if v > 0:
                movers_up.append((v, f))
            elif v < 0:
                movers_down.append((v, f))
        except ValueError:
            pass
    movers_up.sort(key=lambda x: -x[0])
    movers_down.sort(key=lambda x: x[0])

    total_postings = sum(f["active_postings"] for f in top_facilities)
    top_state = states[0] if states else {}
    top_city = cities[0] if cities else {}
    top_fac = top_facilities[0] if top_facilities else {}

    lines = []
    lines.append(f"# Travel Healthcare Hotspot Report")
    lines.append(f"")
    lines.append(f"**Generated:** {NOW_UTC}  ")
    lines.append(f"**Data as of:** {TODAY}  ")
    lines.append(f"**Coverage:** {len(facilities)} facilities tracked across {len(states)} states")
    lines.append(f"")
    lines.append("---")
    lines.append("")

    # Executive summary
    lines.append("## Executive Summary")
    lines.append("")
    lines.append(
        f"- **{top_state.get('name','N/A')} ({top_state.get('state','')})** leads all states "
        f"with an estimated **{top_state.get('count',0):,}** active travel postings."
    )
    lines.append(
        f"- **{top_city.get('city','N/A')}, {top_city.get('state','')}** is the #1 city hotspot "
        f"with approximately **{top_city.get('count',0):,}** active openings."
    )
    lines.append(
        f"- **{top_fac.get('facility','N/A')}** ({top_fac.get('city','')}, {top_fac.get('state','')}) "
        f"tops the facility ranking with **{top_fac.get('active_postings',0):,}** active postings."
    )
    if movers_up:
        best = movers_up[0][1]
        lines.append(
            f"- Biggest week-over-week gainer: **{best['facility']}** (+{movers_up[0][0]} postings)."
        )
    else:
        lines.append("- No prior snapshot available for week-over-week comparison (first run).")
    lines.append(
        f"- Data sources: Vivian Health (public state pages) + Aya Index + "
        f"industry benchmark baselines. Facility-level data limited by login walls on most platforms."
    )
    lines.append("")
    lines.append("---")
    lines.append("")

    # Top 10 states
    lines.append("## Top 10 States by Active Travel Postings")
    lines.append("")
    lines.append("| Rank | State | Est. Active Postings |")
    lines.append("|-----:|-------|---------------------:|")
    for i, s in enumerate(states, 1):
        lines.append(f"| {i} | {s.get('name','')} ({s.get('state','')}) | {s.get('count',0):,} |")
    lines.append("")
    lines.append("---")
    lines.append("")

    # Top 10 cities
    lines.append("## Top 10 Cities by Active Travel Postings")
    lines.append("")
    lines.append("| Rank | City | State | Est. Active Postings |")
    lines.append("|-----:|------|-------|---------------------:|")
    for i, c in enumerate(cities, 1):
        lines.append(
            f"| {i} | {c.get('city','')} | {c.get('state','')} | {c.get('count',0):,} |"
        )
    lines.append("")
    lines.append("---")
    lines.append("")

    # Top 25 facilities
    lines.append("## Top 25 Facilities by Active Travel Postings")
    lines.append("")
    lines.append("| Rank | Facility | City | State | Role | Postings | WoW | Source |")
    lines.append("|-----:|----------|------|-------|------|----------:|-----|--------|")
    for f in top_facilities:
        rank = f.get("rank", "")
        fac = f.get("facility", "")
        city = f.get("city", "")
        state = f.get("state", "")
        role = f.get("role_type", "")
        postings = f.get("active_postings", 0)
        wow = movement_arrow(f.get("wow_movement", "NEW"))
        url = f.get("source_url", "")
        src_link = f"[Vivian]({url})" if "vivian" in url.lower() else f"[Link]({url})"
        lines.append(
            f"| {rank} | {fac} | {city} | {state} | {role} | {postings:,} | {wow} | {src_link} |"
        )
    lines.append("")
    lines.append("---")
    lines.append("")

    # Biggest movers
    lines.append("## Biggest Movers (Week-over-Week)")
    lines.append("")
    if not movers_up and not movers_down:
        lines.append(
            "_No prior snapshot available – all facilities show as NEW. "
            "Run the scraper again next week to see movement._"
        )
    else:
        lines.append("### Gaining")
        lines.append("")
        if movers_up:
            for delta, f in movers_up[:5]:
                lines.append(
                    f"- **{f['facility']}** ({f['city']}, {f['state']}): +{delta} postings"
                )
        else:
            lines.append("_None this week._")
        lines.append("")
        lines.append("### Declining")
        lines.append("")
        if movers_down:
            for delta, f in movers_down[:5]:
                lines.append(
                    f"- **{f['facility']}** ({f['city']}, {f['state']}): {delta} postings"
                )
        else:
            lines.append("_None this week._")
    lines.append("")
    lines.append("---")
    lines.append("")

    # Notes / data limitations
    lines.append("## Notes & Data Limitations")
    lines.append("")
    lines.append(
        "1. **Login walls**: Both Vivian Health and Aya Healthcare require accounts "
        "to see granular facility-level job counts. Public pages expose state-level "
        "totals and partial lists only."
    )
    lines.append(
        "2. **Benchmark baseline**: Facility-level rankings are anchored to publicly "
        "available industry benchmark data (Aya Index 2024 annual report, Vivian Health "
        "2024 market data). Live scraped counts are blended in where available."
    )
    lines.append(
        "3. **JavaScript rendering**: Many job board pages require JS execution (React/Next.js). "
        "This scraper uses raw HTTP requests and captures what is in the initial HTML payload only."
    )
    lines.append(
        "4. **Posting counts are estimates**: Numbers reflect active posting signals "
        "at time of scrape and may not exactly match platform-reported totals."
    )
    lines.append(
        "5. **Roles**: Most state-page data does not disaggregate RN vs. Allied vs. LPN "
        "without login. Role type shown is the page-level default."
    )
    lines.append("")
    lines.append("---")
    lines.append("")

    # Next 3 actions
    lines.append("## Next 3 Actions")
    lines.append("")
    lines.append(
        "1. **Automate weekly runs**: Schedule `scripts/scrape_hotspots.py` via cron or "
        "GitHub Actions every Monday morning to build a rolling WoW comparison."
    )
    lines.append(
        "2. **Add Selenium/Playwright scraping**: Render JS pages to access full facility "
        "name lists on Vivian state pages and Aya Index top-facilities tables."
    )
    lines.append(
        "3. **Expand source coverage**: Add NurseFly, Trusted Health, and Clipboard Health "
        "public job-count pages for triangulation."
    )
    lines.append("")
    lines.append("---")
    lines.append("")

    # Risks / Dependencies
    lines.append("## Risks & Dependencies")
    lines.append("")
    lines.append(
        "| Risk | Likelihood | Impact | Mitigation |"
    )
    lines.append(
        "|------|-----------|--------|------------|"
    )
    lines.append(
        "| Vivian moves facility names behind login | Medium | High | Add Playwright headless scraping |"
    )
    lines.append(
        "| Aya Index redesign breaks parser | Medium | Medium | Use CSS selector + fallback regex |"
    )
    lines.append(
        "| IP blocking / rate limiting | Low | Medium | Add rotating delays + user-agent rotation |"
    )
    lines.append(
        "| Benchmark data becomes stale | High (6 months) | Medium | Refresh benchmarks quarterly |"
    )
    lines.append(
        "| Posting counts double-counted across agencies | Medium | Low | Deduplicate by facility+city key |"
    )
    lines.append("")

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_MD.write_text("\n".join(lines), encoding="utf-8")
    print(f"  Wrote {REPORT_MD}")


def write_sources():
    lines = []
    lines.append("# Data Sources")
    lines.append("")
    lines.append(f"_Last updated: {NOW_UTC}_")
    lines.append("")
    lines.append("## Primary Sources")
    lines.append("")
    lines.append(
        "### 1. Vivian Health – State Job Pages (Public)"
    )
    lines.append("")
    lines.append(
        "- **URL pattern**: `https://www.vivian.com/travel-nurse-jobs/state/<state-slug>/`"
    )
    lines.append(
        "- **What's accessible**: State-level job counts in page title/meta; partial facility "
        "list visible in initial HTML on some pages."
    )
    lines.append(
        "- **What requires login**: Full facility name list, individual job details, pay rates."
    )
    lines.append(
        "- **Coverage**: 20 high-demand states scraped in this run."
    )
    lines.append(
        "- **Limitation**: Vivian uses Next.js SSR; much facility data is injected client-side. "
        "Our parser captures server-rendered content only."
    )
    lines.append("")
    lines.append(
        "### 2. Aya Index (Public)"
    )
    lines.append("")
    lines.append(f"- **URL**: {AYA_URL}")
    lines.append(
        "- **What's accessible**: Macro market trends, aggregate job volume indices."
    )
    lines.append(
        "- **What requires login**: Facility-level drill-downs, pay rate benchmarks."
    )
    lines.append(
        "- **Limitation**: Page is heavily JS-rendered; aggregate trend numbers may not parse reliably."
    )
    lines.append("")
    lines.append("## Supplemental / Benchmark Sources")
    lines.append("")
    lines.append(
        "### 3. Industry Benchmark Baselines"
    )
    lines.append("")
    lines.append(
        "- **Aya Index 2024 Annual Report** (public PDF): State and metro rankings."
    )
    lines.append(
        "- **Vivian Health 2024 Market Insights** (public blog post): Top facilities and specialties."
    )
    lines.append(
        "- These benchmarks are used as floor values when live scraping returns no data."
    )
    lines.append("")
    lines.append("## Sources Evaluated but Not Used")
    lines.append("")
    lines.append(
        "| Source | Reason Not Used |"
    )
    lines.append(
        "|--------|----------------|"
    )
    lines.append(
        "| NurseFly | Facility names require account login |"
    )
    lines.append(
        "| Trusted Health | No public job count endpoint found |"
    )
    lines.append(
        "| Indeed Travel Nurse | Aggregates multiple agencies; difficult to deduplicate |"
    )
    lines.append(
        "| LinkedIn Jobs | Rate-limited; no facility breakdown available |"
    )
    lines.append("")
    lines.append("## Scraping Ethics & Compliance")
    lines.append("")
    lines.append(
        "- All scraping uses public, non-authenticated pages only."
    )
    lines.append(
        "- Crawl delay of 1.5 seconds between requests to avoid server load."
    )
    lines.append(
        "- `robots.txt` for each domain was reviewed; scraped paths are not disallowed."
    )
    lines.append(
        "- No credentials, tokens, or authentication headers are used."
    )

    SOURCES_MD.write_text("\n".join(lines), encoding="utf-8")
    print(f"  Wrote {SOURCES_MD}")


AYA_URL = "https://www.ayahealthcare.com/travel-nursing-agency/aya-index/"


def update_changelog(facilities: list[dict]):
    existing = ""
    if CHANGELOG_MD.exists():
        existing = CHANGELOG_MD.read_text(encoding="utf-8")

    total = sum(f["active_postings"] for f in facilities[:25])
    new_entry_lines = [
        f"## {TODAY}",
        "",
        f"- **Scrape run**: {NOW_UTC}",
        f"- **Facilities tracked**: {len(facilities)}",
        f"- **Top 25 posting volume**: {total:,}",
    ]
    if facilities:
        f = facilities[0]
        new_entry_lines.append(
            f"- **#1 facility**: {f['facility']} ({f['city']}, {f['state']}) – {f['active_postings']:,} postings"
        )
    new_entry_lines.append("")

    header = "# Changelog\n\nDated history of scraper runs and notable changes.\n\n---\n\n"
    if existing.startswith("# Changelog"):
        # Insert new entry after the header block
        body_start = existing.find("## ")
        if body_start == -1:
            updated = existing + "\n".join(new_entry_lines) + "\n"
        else:
            updated = existing[:body_start] + "\n".join(new_entry_lines) + "\n\n" + existing[body_start:]
    else:
        updated = header + "\n".join(new_entry_lines) + "\n"

    CHANGELOG_MD.write_text(updated, encoding="utf-8")
    print(f"  Wrote {CHANGELOG_MD}")


def main():
    print(f"\n{'='*60}")
    print(f"Travel Healthcare Report Generator – {TODAY}")
    print(f"{'='*60}\n")

    facilities = load_facilities()
    summary = load_summary()

    if not facilities:
        print("ERROR: No facility data found. Run scrape_hotspots.py first.")
        return

    print(f"Loaded {len(facilities)} facilities.")
    print("Writing report artifacts...")

    write_report(facilities, summary)
    write_sources()
    update_changelog(facilities)

    print("\nReport generation complete.")


if __name__ == "__main__":
    main()
