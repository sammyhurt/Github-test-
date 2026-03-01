# Wavyarnold — Sitemap & Site Architecture

**Target:** Local + music intent SEO (Newark, NJ + Northeast)

---

## Core Site Pages

```
wavyarnold.com/
├── / (Homepage)
├── /music
│   ├── /music/[release-slug]          # Individual release pages
│   └── /lyrics/[song-slug]            # Lyrics pages (SEO-rich)
├── /about
├── /shows
├── /blog
│   └── /blog/[post-slug]
├── /contact
└── /join                              # Email/SMS list signup
```

---

## Page Inventory with Search Intent

| Page | Primary Intent | Target Keyword Type |
|------|---------------|---------------------|
| Homepage | Brand discovery / direct nav | `[wavyarnold]`, `newark nj rapper` |
| /music | Browse discography | `wavyarnold music`, `new hiphop newark` |
| /music/[release] | Specific release discovery | `[song name] wavyarnold`, `[song name] lyrics` |
| /lyrics/[song] | Lyrics lookup | `[song name] lyrics` |
| /about | Artist research | `wavyarnold bio`, `newark nj hip hop artist` |
| /shows | Booking/fan event lookup | `wavyarnold shows`, `newark live music` |
| /blog | Ongoing discovery + authority | Long-tail music/culture queries |
| /join | Conversion | `wavyarnold fan club`, `wavyarnold newsletter` |
| /contact | Booking/press | `wavyarnold booking`, `wavyarnold press` |

---

## Priority Page Build Order

1. Homepage (brand anchor, links to all)
2. /music (discography hub)
3. /join (capture emails/SMS from day one)
4. /about (press + SEO)
5. /lyrics/[song] (high-volume long-tail traffic)
6. /shows (booking signal)
7. /blog (content velocity)
8. /contact (professional funnel)

---

## Schema Plan by Page

| Page | Schema Type |
|------|-------------|
| Homepage | `MusicGroup`, `Person` |
| /music/[release] | `MusicRecording`, `MusicAlbum` |
| /lyrics/[song] | `LyricsPage` (via `MusicRecording`) |
| /about | `Person`, `MusicGroup` |
| /shows | `Event` |
| /blog/[post] | `BlogPosting`, `Article` |
| /join | None (conversion page) |
| /contact | `ContactPage` |

---

## Internal Linking Plan

### Hub → Spoke Model

- **Homepage** links to: /music, /join, /shows, /about, latest blog post
- **/music** links to: each release page, /join CTA, /shows
- **/music/[release]** links to: /lyrics/[song], related releases, /join
- **/lyrics/[song]** links to: /music/[release], /about, /join
- **/about** links to: /music, /shows, /join, /contact
- **/blog/[post]** links to: relevant release pages, /join, /shows

**Rule:** Every page has exactly one primary CTA pointing to `/join` and one secondary link to a relevant music or content page.

---

## Target Cities / Regional SEO

**Primary:** Newark, NJ
**Secondary:** Jersey City, NJ | Elizabeth, NJ | Irvington, NJ
**Expansion:** New York City, NY | Philadelphia, PA | Trenton, NJ

Use city modifiers in:
- Blog posts about local scenes
- /shows page copy
- /about page (Newark references)
- Google Business Profile (if applicable)
