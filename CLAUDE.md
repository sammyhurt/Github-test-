# Subletly Content Director — Project Context

## Default Agent
This repo uses the **content-director** agent. See `.claude/agents/content-director.md`.

## Project Structure
```
BRAND.md                          # Brand guidelines (source of truth for all content)
content/
  remotion/                       # Remotion React video compositions
    src/
      Root.tsx                    # Registers all compositions
      compositions/               # Individual video components
  scripts/                        # 2-column (Visual | Audio) video scripts
  blog/                           # Long-form SEO content
  social/
    instagram-carousels/          # Carousel copy variations
    tiktok/                       # TikTok hook scripts
```

## Key Rules
- Always read `BRAND.md` before producing any content.
- Primary color: `#5221C3`. Accent: `#FF6B6B`. Font: Inter.
- Every feature gets 3 formats: 15s TikTok, 60s Explainer, 1,500-word blog.
- Remotion render commands: `npm run render:tiktok | render:tips | render:haven`
