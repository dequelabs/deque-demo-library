# Deque Demo Library

Multi-sector demo library for the Deque Solutions Engineering team. One Vite + React app, five sectors. Each sector is built in two phases:

1. **Phase 1 — clean baseline.** A working, accessible-by-default prototype. No deliberate issues. The site does what a real one does.
2. **Phase 2 — surgical issues.** Documented accessibility issues are introduced one at a time, each tracked in a per-sector `ACCESSIBILITY_ISSUES.md` catalog so demos are reproducible and traceable.

The toolkit being demoed:

- [axe DevTools (browser)](https://docs.deque.com/devtools-for-web/en) — runtime scanning
- [axe Linter](https://docs.deque.com/linter/en) — write-time static analysis (catches issues directly in JSX)
- [Advanced Rules / IGT](https://docs.deque.com/advanced-rules/en) — Pro rules + Intelligent Guided Tests
- [Developer Hub](https://docs.deque.com/developer-hub/en) — central triage and reporting

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

To produce a static bundle:

```bash
npm run build
npm run preview
```

The app uses **HashRouter**, so the `dist/` folder serves cleanly from any static host (or `file://`) without rewrite rules.

## Sectors

| Sector | Brand | Phase 1 | Phase 2 |
| --- | --- | --- | --- |
| FinTech / Banking | DQBC | **Built — 9 pages, working state** | **Pending** (catalog template ready) |
| Education / Government | Northbrook Public Schools | Stub | — |
| SaaS | Pulsegrid | Stub | — |
| Creative Agency | Foundry & Ash | Stub | — |
| Hospitality | Cala Verde Resort | Stub | — |

A slim **footer site switcher** appears on every sector page so you can hop between sectors mid-demo.

## FinTech (DQBC) — what's in Phase 1

A working banking prototype with **persistent client-side state** (Context + localStorage). All actions actually mutate state — transfers move money, bill payments debit balances, deposits credit balances, card locks toggle, profile edits persist.

Pages:

- `/#/fintech` — Marketing home
- `/#/fintech/login` — Sign in (mock auth: any non-empty username + password ≥ 4 chars)
- `/#/fintech/dashboard` — Account overview, live balances, transactions table, spending breakdown
- `/#/fintech/transfer` — 3-step transfer flow that actually moves money between accounts
- `/#/fintech/bills` — Pay bills, schedule future payments, manage payees
- `/#/fintech/deposit` — Mobile check deposit (3-step)
- `/#/fintech/statements` — Filter and download monthly statements / tax docs
- `/#/fintech/cards` — Lock/unlock cards, adjust spending limits
- `/#/fintech/profile` — Edit personal info, notifications, **reset demo data** button

Behind the scenes:

- `src/sites/fintech/data.js` — seed data (user, accounts, transactions, payees, cards, statements)
- `src/sites/fintech/store.js` — Context + reducer + localStorage persistence + typed action creators
- `src/sites/fintech/auth.js` — `useAuth()` hook + `<ProtectedRoute>` wrapper
- `src/sites/fintech/format.js` — money/date formatters
- `src/sites/fintech/PublicLayout.jsx` — marketing chrome
- `src/sites/fintech/AuthLayout.jsx` — authed-app chrome (sidebar nav + topbar + profile menu)

The state survives a refresh because everything is mirrored to `localStorage`. To restore demo seed data before a customer demo, use **Profile → Reset demo data**.

## FinTech — what's in Phase 2

Nothing yet, by design. The clean baseline is the starting point. See `src/sites/fintech/ACCESSIBILITY_ISSUES.md` for:

- The catalog template (one row per issue: ID, page, component, WCAG, axe rule, severity, tool, status)
- A starter menu of recommended issues organized by page
- Demo-time toggle recommendations (Best Practices, Experimental, Needs Review)

When you introduce an issue, tag it inline with `{/* PHASE-2 a11y issue MT-007 — see ACCESSIBILITY_ISSUES.md */}` and fill in the catalog row.

## Project structure

```
src/
  main.jsx
  App.jsx                                # Routes
  styles/                                # tokens, base reset, shared components
  components/
    SiteSwitcher.jsx                     # slim footer-resident sector switcher
  data/sectors.js                        # sector metadata (drives landing + switcher)
  pages/
    Landing.jsx + Landing.css            # / -- sector picker
  sites/
    fintech/                             # FULLY BUILT
      data.js, store.js, auth.js, format.js
      Layout.jsx                         # provides store, theme scope
      PublicLayout.jsx                   # public-pages chrome
      AuthLayout.jsx                     # authed sidebar + topbar
      theme.css
      Home.jsx, Login.jsx,
      Dashboard.jsx, Transfer.jsx,
      Bills.jsx, Deposit.jsx,
      Statements.jsx, Cards.jsx,
      Profile.jsx
      ACCESSIBILITY_ISSUES.md            # Phase-2 catalog
    edu-gov/  saas/  agency/  hospitality/    # Stubs
public/
  fintech-hero.svg
  check-success.svg
```

## Adding a sector (when ready)

1. Build pages under `src/sites/<sector>/` using the FinTech files as a reference.
2. Wire the new pages into `App.jsx` (public route(s) + `<ProtectedRoute>` wrapped authed routes if applicable).
3. Update `src/data/sectors.js`: flip `status: 'stub'` → `'ready'`, adjust the blurb.
4. Land Phase 1 (clean baseline) before introducing any deliberate issues.
5. Create a per-sector `ACCESSIBILITY_ISSUES.md` for Phase 2 issue tracking.

## Deploy to Vercel

Vercel auto-detects Vite; `vercel.json` makes the build/install/output
directories explicit so behaviour is the same in CI as locally. Because the
app uses HashRouter, no SPA-fallback rewrite rule is needed — every route
lives under `/#/...` and resolves to `index.html` by default.

**Option A — connect a GitHub repo (recommended, auto-deploys forever):**

1. Push the repo to GitHub (the dequelabs org requires a PR — push to a
   feature branch and open one).
2. Go to https://vercel.com/new and import the repo.
3. Vercel will detect Vite. Confirm and click Deploy.
4. Every merge to `main` produces a Production deployment; every PR gets a
   Preview deployment automatically.

**Option B — Vercel CLI (one-off or preview):**

```bash
# from inside this folder
npm i -g vercel
vercel              # first run: choose scope (your account or a team),
                    # link or create project, accepts the defaults from vercel.json
vercel --prod       # promote latest preview to production
```

**Option C — drag-and-drop:**

```bash
npm ci && npm run build
# then drag the `dist/` folder onto https://vercel.com/new
```

The Vite `base` defaults to `/` when `VITE_BASE` is not set, which is what
Vercel needs (the app is served at the deployment's root, e.g.
`https://deque-demo-library.vercel.app/`).

> Vercel is the only deploy target. The repo previously had a GitHub Pages
> workflow but it has been removed — Vercel handles per-branch previews and
> production-from-`main`, which is all we need.

## Demo-time tips

- The **landing page** (`/`) is the meta surface — keep it clean.
- For a richer scan during a customer demo, flip **Best Practices: ON** in the axe DevTools panel.
- The store is in `localStorage` under key `dqbc-store-v2`. Use **Profile → Reset demo data** before the demo, or clear that key manually.
- Default seed user: **Deke Quinn** · `dq@deque.com` (any non-empty username + password ≥ 4 chars works at the sign-in page).
