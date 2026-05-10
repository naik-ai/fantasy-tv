# Fantasy TV Pro Dashboard - Goals and Requirements

## 1) Product Goal
Build a CSV-native fantasy analytics dashboard (mobile, desktop, and PWA) where scoring logic is tunable in real time, so we can finalize a robust fantasy formula for the 2025-26 dataset.

## 2) End Goal (Primary Outcome)
Finalize fantasy scoring weights and rules using data-backed comparison views.

Success means:
- We can tune weights from UI (no code changes needed).
- We can compare formula variants side by side.
- We can see ranking shifts, trend behavior, and stability across gameweeks/positions.
- The UI is usable and visually consistent on desktop, mobile, and installed PWA.

## 3) Core User Problem
Current dashboard shows points, but does not provide:
- formula tuning workflow,
- comparison graphing,
- controlled sorting/comparison for decision making,
- PWA-specific layout handling.

## 4) Functional Requirements

### A. Data & Source
1. Data source remains:
   - `/public/data/pl_2025_26_player_match_stats.csv`
2. Load client-side with robust CSV parsing.
3. Detect schema mismatch and show readable error.
4. Expose dataset metadata:
   - rows loaded,
   - unique players,
   - unique teams,
   - gameweek range.

### B. Formula Tuning (Sidebar)
1. Add a left sidebar (collapsible on desktop, drawer on mobile).
2. Sidebar controls for scoring parameters (sliders/inputs):
   - goals, assists, shots_on_target,
   - clean sheet bonus,
   - defensive actions (tackles/interceptions/clearances/blocks),
   - chance creation/dribbles/crosses,
   - pass accuracy bonus threshold + value,
   - GK saves,
   - negative events (fouls, cards, penalty missed),
   - minute tiers (0-59, 60-89, 90+).
3. Presets:
   - Default,
   - Aggressive Attack,
   - Balanced,
   - Defensive Value.
4. Reset and Save Custom Preset.
5. Persist last used params in localStorage.

### C. Formula Comparison
1. Support baseline vs candidate formula comparison.
2. Show delta outputs:
   - rank change,
   - total points delta,
   - per-position impact,
   - top gainers/losers.
3. Enable quick swap of baseline/candidate.

### D. Graphs & Analysis
1. Required graphs:
   - Top-N player points bar chart,
   - Baseline vs candidate scatter/paired bar,
   - Gameweek trend line,
   - Position-level distribution chart,
   - Team contribution chart.
2. All graphs must react to filters and tuning changes.
3. Mobile graphs should stack vertically with touch-safe spacing.

### E. Sorting, Filtering, Compare Controls
1. Global sort options:
   - total points,
   - average points,
   - xG, xA,
   - consistency (std dev / match).
2. Filter dimensions:
   - player search,
   - team,
   - position,
   - gameweek,
   - minutes threshold.
3. Compare selectors:
   - player A vs player B,
   - team A vs team B,
   - position cohort compare.

### F. Views and Layout
1. Desktop layout:
   - persistent sidebar,
   - wide table + graph grid.
2. Mobile/PWA layout:
   - sidebar as slide-over sheet,
   - compact cards,
   - sticky top controls,
   - no horizontal clipping/skew.
3. PWA install experience:
   - manifest,
   - installable icon set,
   - standalone-safe spacing.

### G. Table UX
1. Sticky headers.
2. Column sort toggles.
3. Toggle between:
   - leaderboard,
   - raw matches,
   - formula impact.
4. Export current filtered results as CSV.

## 5) PWA-Specific Requirements
1. Fix skewed rendering in standalone mode.
2. Respect safe area insets (`env(safe-area-inset-*)`).
3. Prevent horizontal overflow at all breakpoints.
4. Validate in:
   - iOS installed PWA,
   - Android Chrome PWA,
   - desktop browser.

## 6) Non-Functional Requirements
1. Performance:
   - first render under 2s on modern mobile for current CSV.
2. Reliability:
   - no crash on missing numeric fields.
3. Maintainability:
   - formula logic isolated in dedicated module.
4. Explainability:
   - every point component visible in breakdown mode.

## 7) Acceptance Criteria
1. User can tune parameters in sidebar and see instant ranking changes.
2. User can compare two formulas and view rank deltas.
3. Graphs update correctly for all active filters.
4. PWA and mobile views are visually stable (no skew/overflow).
5. Data source served from Cloudflare Pages static assets.
6. Formula can be finalized from UI evidence without code edits.

## 8) Delivery Phases

### Phase 1 (Stability + PWA)
- Fix skew/overflow,
- add manifest + responsive shell,
- validate mobile/desktop parity.

### Phase 2 (Tuning Engine)
- Sidebar controls,
- formula parameterization,
- localStorage preset persistence.

### Phase 3 (Comparison + Graphs)
- baseline vs candidate,
- delta tables,
- required graph suite.

### Phase 4 (Decision Ready)
- export,
- explainability breakdown,
- final scoring calibration workflow.

## 9) Definition of Done
The app is considered done when it can be used as a practical formula calibration cockpit, not just a leaderboard viewer, across desktop + mobile + installed PWA.
