# Data Sources

_Last updated: 2026-02-24 19:09 UTC_

## Primary Sources

### 1. Vivian Health – State Job Pages (Public)

- **URL pattern**: `https://www.vivian.com/travel-nurse-jobs/state/<state-slug>/`
- **What's accessible**: State-level job counts in page title/meta; partial facility list visible in initial HTML on some pages.
- **What requires login**: Full facility name list, individual job details, pay rates.
- **Coverage**: 20 high-demand states scraped in this run.
- **Limitation**: Vivian uses Next.js SSR; much facility data is injected client-side. Our parser captures server-rendered content only.

### 2. Aya Index (Public)

- **URL**: https://www.ayahealthcare.com/travel-nursing-agency/aya-index/
- **What's accessible**: Macro market trends, aggregate job volume indices.
- **What requires login**: Facility-level drill-downs, pay rate benchmarks.
- **Limitation**: Page is heavily JS-rendered; aggregate trend numbers may not parse reliably.

## Supplemental / Benchmark Sources

### 3. Industry Benchmark Baselines

- **Aya Index 2024 Annual Report** (public PDF): State and metro rankings.
- **Vivian Health 2024 Market Insights** (public blog post): Top facilities and specialties.
- These benchmarks are used as floor values when live scraping returns no data.

## Sources Evaluated but Not Used

| Source | Reason Not Used |
|--------|----------------|
| NurseFly | Facility names require account login |
| Trusted Health | No public job count endpoint found |
| Indeed Travel Nurse | Aggregates multiple agencies; difficult to deduplicate |
| LinkedIn Jobs | Rate-limited; no facility breakdown available |

## Scraping Ethics & Compliance

- All scraping uses public, non-authenticated pages only.
- Crawl delay of 1.5 seconds between requests to avoid server load.
- `robots.txt` for each domain was reviewed; scraped paths are not disallowed.
- No credentials, tokens, or authentication headers are used.