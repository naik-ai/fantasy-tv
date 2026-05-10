# Fantasy TV Pro Dashboard

CSV-native fantasy analytics dashboard for **mobile, desktop, and PWA**.

Live: https://fantasy-tv.pages.dev  
Repo: https://github.com/naik-ai/fantasy-tv

## Goal
Build a formula-calibration cockpit where fantasy scoring can be tuned and validated against real 2025-26 data.

## Data Source
- Current season CSV (served as static asset):
  - `public/data/pl_2025_26_player_match_stats.csv`
- Loaded in app from:
  - `/data/pl_2025_26_player_match_stats.csv`

## Current Features
- CSV parsing + typed numeric normalization
- Leaderboard view (aggregated player points)
- Raw match rows view (per-match points)
- Filters:
  - player search
  - team
  - position
  - gameweek
- Responsive mobile + desktop layout
- Cloudflare Pages deployment

## Scoring Logic (Current)
Implemented in `src/App.jsx` with weighted event scoring and minute-based base points.

Includes:
- goals, assists, shots on target
- clean sheet bonus
- defensive actions
- chance creation/dribbles/crosses
- pass accuracy threshold bonus
- saves
- penalties/fouls negative adjustments

## Product Requirements
Detailed spec is documented in:
- `PRODUCT_REQUIREMENTS.md`

That file includes:
- formula tuning sidebar requirements
- baseline vs candidate comparison requirements
- graph requirements
- PWA skew/overflow fix requirements
- acceptance criteria and phased delivery

## Local Development
```bash
npm install
npm run dev
```

Build:
```bash
npm run build
npm run preview
```

## Deploy (Cloudflare Pages)
From project root (`src/fantasy-tv`):
```bash
npx wrangler pages deploy dist --project-name fantasy-tv
```

## Project Structure
```text
src/
  App.jsx                 # Dashboard + scoring + filtering
  components/ui/          # shadcn-style UI components
  lib/utils.js
public/
  data/pl_2025_26_player_match_stats.csv
PRODUCT_REQUIREMENTS.md   # Detailed goals and roadmap
```

## Next Build Focus
1. PWA layout parity fixes (standalone/mobile skew)
2. Tuning sidebar with live parameter controls
3. Formula comparison mode (baseline vs candidate)
4. Graph suite for ranking delta and trend analysis
5. Export + explainability breakdown for final formula decisions
