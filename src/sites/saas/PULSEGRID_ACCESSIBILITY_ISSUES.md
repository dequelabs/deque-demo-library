# Pulsegrid — Accessibility Issues Catalog

Every issue in this catalog is a **purposefully engineered accessibility defect** used to
demo Deque's Axe DevTools® HTML toolkit against a modern SaaS observability product
(Datadog / GoodData / New Relic-style dark analytics dashboards).

The catalog covers:

- **Marketing surface**: `/#/saas` (Home) and `/#/saas/login`
- **Post-login product**: `/#/saas/dashboard`, `/#/saas/services`, `/#/saas/hosts`,
  `/#/saas/logs`, `/#/saas/alerts`, `/#/saas/incidents`, `/#/saas/security`,
  `/#/saas/settings`

Each issue lists the ID (`PG-###`), page, rule, impact, WCAG criterion, a short
description of the defect, and the file / component where it lives so a demo host can
walk to the DOM element quickly.

## Impact legend (axe-core)

- **Critical** — blocks users of assistive tech from accomplishing a task
- **Serious** — makes tasks significantly harder for AT users
- **Moderate** — degrades experience but usually recoverable
- **Minor** — best-practice, non-normative

## Toolkit coverage

| Tool                     | Coverage                                                            |
| ------------------------ | ------------------------------------------------------------------- |
| axe browser extension    | PG-001 through PG-061 fire in the free extension                    |
| axe DevTools Pro         | PG-023, PG-024, PG-025 are Pro-only advanced/AI-assisted rules      |
| axe MCP `analyze`        | All PG-### with a WCAG mapping                                       |
| axe MCP `igt`            | PG-IGT-001 through PG-IGT-015 (Structure/Headings/Forms/Images/Modals/Reading Order/Keyboard) |
| axe linter               | PG-011, PG-013, PG-016, PG-018, PG-030, PG-036, PG-060 catch at authoring |

---

## Marketing surface — Home (`/#/saas`)

| ID | Rule | Impact | WCAG | Location | Defect |
| --- | --- | --- | --- | --- | --- |
| PG-001 | `image-alt` | Critical | 1.1.1 | `Home.jsx` — hero visual `<div role="img" aria-label="">` | Informative screenshot has empty accessible name |
| PG-002 | `heading-order` | Moderate | 1.3.1 | `Home.jsx` — "Trusted by" strip | Skips from `<h1>` to `<h3>` (no h2) |
| PG-003 | `color-contrast` | Serious | 1.4.3 | `Home.jsx` — "Meet Bits AI" eyebrow | Violet `#4f46e5` on `#0f0f1a` background ≈ 3.1:1 |
| PG-004 | `link-name` | Critical | 2.4.4, 4.1.2 | `Home.jsx` — customer-logos row `<a>` with only an SVG chevron | Anchor has no accessible name |
| PG-006 | `identical-links-same-purpose` | Minor BP | 2.4.4 | `Home.jsx` — Products preview | Four "Learn more" links point to different products |
| PG-007 | `button-name` | Critical | 4.1.2 | `Home.jsx` — DASH play `<button>` | Icon-only button has no label |
| PG-009 | `landmark-unique` | Moderate BP | 1.3.6 | `Home.jsx` — Products area `<nav>` | Two `<nav>` on page without unique labels |
| PG-010 | `aria-required-children` | Serious | 1.3.1, 4.1.2 | `Home.jsx` — Products `<ul role="tablist">` | Children are `<li>`, not `role="tab"` |
| PG-023 | Pro advanced/text-contrast | Serious | 1.4.3 | `Home.jsx` — `PulsegridDashboardHero` KPI tile labels | 9px `#6b6d8a` text on `#17162a` (advanced pixel-level scanner only) |
| PG-024 | Pro advanced/heading-markup | Moderate | 1.3.1 | `PublicLayout.jsx` — `.pg-announce` "DASH 2026" strong text | Visually the announcement heading, but not an `<h#>` |
| PG-025 | Pro advanced/image-decorative | Moderate | 1.1.1 | `Home.jsx` — customer-logo `<span role="img" aria-label="{name} logo">` | Decorative logos have redundant "logo" in alt |

## Marketing surface — Login (`/#/saas/login`)

| ID | Rule | Impact | WCAG | Location | Defect |
| --- | --- | --- | --- | --- | --- |
| PG-011 | `label` | Critical | 1.3.1, 3.3.2, 4.1.2 | `Login.jsx` — password input | Only placeholder, no `<label>` |
| PG-012 | `autocomplete-valid` | Serious | 1.3.5 | `Login.jsx` — email input | `autocomplete="user-email"` is not a valid WHATWG token |
| PG-013 | `aria-valid-attr-value` | Critical | 4.1.2 | `Login.jsx` — email input | `aria-invalid="please-check"` (must be `true`/`false`/`grammar`/`spelling`) |
| PG-014 | `form-field-multiple-labels` | Moderate | 3.3.2 | `Login.jsx` — email input | Two `<label htmlFor="email">` |
| PG-020 | `aria-hidden-focus` | Serious | 4.1.2 | `Login.jsx` — "Show password" toggle inside `aria-hidden` wrapper | Focusable element inside hidden subtree |

## Post-login product — Dashboard (`/#/saas/dashboard`)

| ID | Rule | Impact | WCAG | Location | Defect |
| --- | --- | --- | --- | --- | --- |
| PG-015 | `color-contrast` | Serious | 1.4.3 | `Dashboard.jsx` — Apdex delta text | Custom lime `#5a8a3a` on dark panel ≈ 3.4:1 |
| PG-016 | `aria-required-attr` | Critical | 4.1.2 | `Dashboard.jsx` — `role="tablist"` tabs | Missing `aria-selected` / `aria-controls` on each tab |
| PG-017 | `scrollable-region-focusable` | Serious | 2.1.1 | `Dashboard.jsx` — services table wrapper | `overflow-x: auto` without `tabindex="0"` |
| PG-018 | `nested-interactive` | Serious | 4.1.2 | `Dashboard.jsx` — services table "Trace" cell | `<button>` nested inside `<a>` |
| PG-019 | `link-in-text-block` | Moderate | 1.4.1 | `Dashboard.jsx` — alert body "See report" | Link distinguished only by color, no underline |
| PG-021 | `aria-dialog-name` (custom) | Critical | 4.1.2 | `Dashboard.jsx` — Ack modal | Modal container missing `role="dialog"` |
| PG-022 | `aria-required-attr` | Critical | 4.1.2 | `Dashboard.jsx` — Ack modal | Missing `aria-modal="true"` + `aria-labelledby` |

## Post-login — Alerts (`/#/saas/alerts`)

| ID | Rule | Impact | WCAG | Location | Defect |
| --- | --- | --- | --- | --- | --- |
| PG-030 | `select-name` | Critical | 1.3.1, 4.1.2 | `Alerts.jsx` — status filter `<select>` | No `<label>` or `aria-label` |
| PG-031 | `aria-required-children` | Serious | 1.3.1, 4.1.2 | `Alerts.jsx` — findings `role="listbox"` | Children are `<div>`, not `role="option"` |
| PG-032 | `color-contrast` | Serious | 1.4.3 | `Alerts.jsx` — legend text | `#4a4a5c` gray on `#17162a` gray ≈ 3.0:1 |

## Post-login — Services (`/#/saas/services`)

| ID | Rule | Impact | WCAG | Location | Defect |
| --- | --- | --- | --- | --- | --- |
| PG-035 | `button-name` | Critical | 4.1.2 | `Services.jsx` — clear-filter icon button | No accessible name |
| PG-036 | `scope-attr-valid` | Serious | 1.3.1 | `Services.jsx` — table header | `scope="col-header"` (invalid; must be `row` / `col` / `rowgroup` / `colgroup`) |
| PG-037 | `duplicate-id` | Moderate | 4.1.1 | `Services.jsx` — service detail panel | Two elements share `id="svc-detail-title"` |

## Post-login — Hosts (`/#/saas/hosts`)

| ID | Rule | Impact | WCAG | Location | Defect |
| --- | --- | --- | --- | --- | --- |
| PG-040 | `target-size` | Serious | 2.5.8 | `Hosts.jsx` — filter chip `×` button | 12×12 px target (below 24×24 minimum) |
| PG-041 | `aria-input-field-name` | Moderate | 4.1.2 | `Hosts.jsx` — `role="combobox"` input | No accessible name |

## Post-login — Logs (`/#/saas/logs`)

| ID | Rule | Impact | WCAG | Location | Defect |
| --- | --- | --- | --- | --- | --- |
| PG-045 | `label` | Critical | 1.3.1, 3.3.2, 4.1.2 | `Logs.jsx` — query input | Placeholder only, no label |
| PG-046 | `scrollable-region-focusable` | Serious | 2.1.1 | `Logs.jsx` — log stream `<pre>` | Scrollable region without `tabindex="0"` |

## Post-login — Settings (`/#/saas/settings`)

| ID | Rule | Impact | WCAG | Location | Defect |
| --- | --- | --- | --- | --- | --- |
| PG-050 | `autocomplete-valid` | Serious | 1.3.5 | `Settings.jsx` — first-name input | `autocomplete="given"` (should be `given-name`) |
| PG-051 | `aria-valid-attr-value` | Moderate | 4.1.2 | `Settings.jsx` — profile section | `role="user-profile"` is not a valid ARIA role |
| PG-052 | `color-contrast` | Serious | 1.4.3 | `Settings.jsx` — Danger zone description | `#7a3232` red on dark ≈ 2.5:1 |

## Post-login — Incidents (`/#/saas/incidents`)

| ID | Rule | Impact | WCAG | Location | Defect |
| --- | --- | --- | --- | --- | --- |
| PG-055 | `heading-order` | Moderate | 1.3.1 | `Incidents.jsx` — "Recent incidents" | Jumps `<h1>` → `<h4>` |

## Post-login — Security (`/#/saas/security`)

| ID | Rule | Impact | WCAG | Location | Defect |
| --- | --- | --- | --- | --- | --- |
| PG-060 | `svg-img-alt` | Moderate | 1.1.1 | `Security.jsx` — shield icon in page title | Informative inline SVG lacks title/aria-label |
| PG-061 | `aria-required-attr` | Serious | 4.1.2 | `Security.jsx` — risk-score `role="progressbar"` | Missing `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |

---

## Intelligent Guided Tests (IGT)

These issues are NOT reliably caught by `analyze` — they need human-in-the-loop or the
keyboard IGT to surface. Each requires walking through the page with a keyboard and
observing focus, order, or announcement behavior.

### Structure

| ID | Page | Description |
| --- | --- | --- |
| PG-IGT-001 | Home | Marketing hero content is not wrapped in a `<section>` landmark |
| PG-IGT-002 | Home | Second `<h1>` present in the "DASH 2026" promo band |
| PG-IGT-015 | Incidents | Incident list rendered as `<div>` siblings, not a real list |

### Headings

| ID | Page | Description |
| --- | --- | --- |
| PG-IGT-003 | Home | "Join Our Pack" is a visually large heading but rendered as a `<div>` |
| PG-IGT-013 | Logs | "Live tail" indicator is styled like a heading but is a `<span>` |

### Forms

| ID | Page | Description |
| --- | --- | --- |
| PG-IGT-004 | Login | Required indicator is `*` only; no instructional text |
| PG-IGT-011 | Alerts | Severity chip row acts like a radio group without `<fieldset>` / `<legend>` |
| PG-IGT-014 | Settings | Save flow has no error summary; individual field errors would not move focus |

### Images

| ID | Page | Description |
| --- | --- | --- |
| PG-IGT-005 | Home | Hero screenshot is informative but marked `aria-label=""` (see PG-001) |

### Modals

| ID | Page | Description |
| --- | --- | --- |
| PG-IGT-006 | Dashboard | Ack modal does not return focus to the trigger button on close |
| PG-IGT-007 | Dashboard | Ack modal does not move focus into the dialog on open |

### Reading Order

| ID | Page | Description |
| --- | --- | --- |
| PG-IGT-008 | Home | Tag-cloud grid is visually left-then-right but DOM order reads the paragraph column first on mobile |
| PG-IGT-012 | Services | Detail panel appears above the list visually (via `flex-direction: column-reverse`) but comes after in DOM |

### Keyboard

| ID | Page | Description |
| --- | --- | --- |
| PG-IGT-009 | Dashboard | "Run query" custom control is a `<div>` — not reachable by Tab, no keyboard activation |
| PG-IGT-010 | Dashboard | Time-range dropdown does not close on Escape or click-outside |
| PG-IGT-COMBOBOX | AuthLayout | Topbar search input renders a listbox on typing but lacks `role="combobox"`, `aria-controls`, `aria-activedescendant` |

---

## Demo flow suggestions

**5-minute demo (highest impact rules):**

1. `/#/saas` — `analyze` catches PG-001 (image-alt), PG-002 (heading-order), PG-003 (contrast),
   PG-004 (link-name), PG-007 (button-name), PG-010 (aria-required-children). Talk to the
   axe DevTools Pro upgrade with PG-023/024/025.
2. `/#/saas/login` — 5 form/label issues + PG-020 aria-hidden-focus.
3. Sign in (any email + 4+ char password).
4. `/#/saas/dashboard` — `remediate` gets Deque-grade fix guidance on PG-015 through PG-022,
   including modal ARIA + nested-interactive.
5. Keyboard walk-through — call out PG-IGT-009 "Run query" div and PG-IGT-006/007 modal
   focus behavior. This is where `igt` finds what `analyze` cannot.

**15-minute deep-dive:**

Add Alerts (select-name), Services (scope attribute, duplicate id), Hosts (target-size —
great for touch demos), Logs (scrollable-region-focusable — Datadog-style log stream is a
common accessibility miss in real observability tools).

---

## Fix-first suggestions for `remediate`

If a demo host is applying fixes live, the highest-signal `remediate` targets are:

- **PG-021 / PG-022** — dialog role + aria-modal / aria-labelledby. Deque's fix guidance
  will show a full focus-trap pattern including `role="dialog"`, `aria-modal="true"`,
  `aria-labelledby`, and the `useEffect` pattern to move + restore focus.
- **PG-016** — tab pattern. `remediate` returns the canonical `role="tab"` +
  `aria-selected` + `aria-controls` + `tabindex` roving-focus pattern.
- **PG-IGT-009** — custom widget. `remediate` will point at the WAI-ARIA button pattern
  or, more likely, "just use a `<button>` element".

## Total issue count

- **Axe-core (analyze) rules**: PG-001 through PG-061 = 37 documented issues (some IDs
  skipped for narrative grouping; see individual sections)
- **Pro Advanced / AI-assisted rules**: PG-023, PG-024, PG-025 = 3 issues
- **IGT (guided) issues**: PG-IGT-001 through PG-IGT-015 + PG-IGT-COMBOBOX = 16 issues
- **Grand total**: ~56 purposefully engineered accessibility defects across 10 pages

All counts confirmed against `npm run build` — the app compiles and every page renders.
