# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Context Navigation
When you need to understand the codebase, docs, or any files in this project:
1. ALWAYS query the knowledge graph first: `/graphify query "your question"`
2. Only read raw files if I explicitly say "read the file" or "look at the raw file"
3. Use `graphify-out/wiki/index.md` as your navigation entrypoint for browsing structure


## Commands

```bash
npm run dev          # Start Astro dev server
npm run fetch-data   # Fetch live match data from remote JSON into src/data/rereyano_data.current.json
npm run check        # Run astro check + tsc --noEmit (type checking)
npm test             # Run all tests in tests/ using Node.js built-in test runner + tsx
npm run build        # Build static site to dist/
npm run preview      # Preview the built site
```

To run a single test file:
```bash
node --import tsx --test tests/slugs.test.ts
```

## Architecture

**Static site** built with Astro 5 (`output: 'static'`), deployed to **Cloudflare Pages** via GitHub Actions. The workflow runs every 3 hours: fetch live data → type check → test → build → deploy → ping IndexNow/search engines.

### Data Pipeline

The site renders from a single data snapshot. `src/lib/data.ts` exports `getSiteData()` which:

1. Reads `src/data/rereyano_data.current.json` (fetched at build time by `scripts/fetch-data.mjs` from `albinchristo04/arda` repo) or falls back to `src/data/rereyano_data.fallback.json` (committed snapshot).
2. Normalizes raw events into `NormalizedMatch[]` — resolving slugs, timezones, channel/server URLs, sport detection, and FAQs.
3. Builds indexed structures: `LeagueGroup[]`, `TeamGroup[]`, `SportHub` (per sport).
4. Returns a cached `SiteData` singleton per build.

The fallback file is the only committed data file. The current file is gitignored and generated at build time.

### URL Structure

| Pattern | Page |
|---|---|
| `/` | Home — all matches grouped by league |
| `/futbol/`, `/beisbol/`, `/mlb/`, `/nba/`, `/nhl/`, `/motogp/` | Sport hubs (static pages) |
| `/[slug]/` | League or team hub (`src/pages/[slug].astro`) — uses `getLeagueBySlug` / `getTeamBySlug` |
| `/partido/[slug]/` | Match detail page with channel/server picker |
| `/en-vivo/[slug]/` | "En vivo" variant of match page |
| `/ver/[slug]/` | "Ver" variant of match page |

`RESERVED_ROOT_SLUGS` in `src/lib/config.ts` prevents league/team slugs from colliding with static sport routes.

### Key Library Files (`src/lib/`)

- **`config.ts`** — All site-wide constants: `SPORT_DEFINITIONS`, `LEAGUE_SLUG_MAP`, `LEAGUE_PRIORITY`, `TIMEZONE_OPTIONS`, `SERVER_OPTIONS`, `PLAYER_BASE_URL`.
- **`data.ts`** — Data loading, normalization, grouping, and lookup helpers (`getMatchBySlug`, `getLeagueBySlug`, `getTeamBySlug`).
- **`slugs.ts`** — Slug generation: `slugifySegment`, `teamSlug`, `leagueSlug`, `buildUniqueMatchSlugs` (handles duplicate team matchups by appending date).
- **`timezones.ts`** — All date/time logic. Source data times are in `Europe/Madrid` (`SOURCE_TIMEZONE`); helpers convert for display in multiple timezones.
- **`seo.ts`** — Builds `<title>`, meta descriptions, canonical URLs, and all JSON-LD structured data schemas.
- **`faq.ts`** — Generates FAQ items for match pages and hub pages.
- **`copy.ts`** — SEO paragraph copy generators.

### Channel / Player Model

Each raw channel has an `id` (channel number) and optional `lang`. `normalizeChannel()` in `data.ts` builds a `NormalizedChannel` with `servers` array — each server URL is `${PLAYER_BASE_URL}/${serverId}/${channelId}`.

## Environment Variables

| Variable | Used in | Purpose |
|---|---|---|
| `INDEXNOW_KEY` | Build + post-deploy scripts | IndexNow submission key |
| `CLOUDFLARE_API_TOKEN` | CI deploy | Wrangler deploy auth |
| `CLOUDFLARE_ACCOUNT_ID` | CI deploy | Cloudflare account |
| `USE_FALLBACK_DATA=1` | Local/build | Force fallback data instead of current |
