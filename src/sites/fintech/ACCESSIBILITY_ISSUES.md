# DQBC — Accessibility Issues Catalog (Phase 2)

This file is the **single source of truth** for every accessibility issue we deliberately introduce into the FinTech demo site. Phase 1 produced a clean, accessible-by-default working prototype. Phase 2 reintroduces issues — surgically, one at a time — and documents each one here.

## How to add an issue

1. Reserve an ID below in the next-available row (`MT-001`, `MT-002`, …).
2. Implement the issue in the relevant component file.
3. Tag the offending code with an inline comment that references the catalog ID:
   ```jsx
   {/* PHASE-2 a11y issue MT-007 — see ACCESSIBILITY_ISSUES.md */}
   ```
4. Fill in the catalog row.

## Severity vocabulary

We use **axe-core's** four-level impact taxonomy plus a separate column for whether the rule is gated by Pro Advanced or by the Best Practices toggle.

| Severity   | Notes                                                                |
| ---------- | -------------------------------------------------------------------- |
| Critical   | Blocks access entirely; high-confidence automated detection.          |
| Serious    | Significant barrier; reliably automated.                              |
| Moderate   | Lower-impact WCAG conformance failure; some require Best Practices.   |
| Minor      | Code smell / pattern issue; almost always Best Practice tagged.       |

## Coverage targets (Phase 2 goal)

A "complete" Phase 2 should cover, across the 9 pages, at least:

- **axe-core baseline** (WCAG 2.2 AA, BP off): 12+ distinct rules.
- **Best Practices on**: 6+ additional rules (heading-order, accesskeys, image-redundant-alt, page-has-heading-one, landmark-one-main, region, presentation-role-conflict, etc.).
- **Pro Advanced (Experimental on)**: 3+ rules (target-size, advanced/text-contrast, identical-link-purpose, etc.).
- **IGT / Guided Tests**: 4+ scenarios (focus trap, color-only meaning, custom-widget keyboard, autoplay pause).

## Catalog

| ID     | Page      | Component / line                                   | WCAG    | axe rule(s)                   | Severity | Tool     | Status   |
| ------ | --------- | -------------------------------------------------- | ------- | ----------------------------- | -------- | -------- | -------- |
| MT-001 | Home      | `Home.jsx` hero `<img>` (~ line 65)                | 1.1.1   | `image-alt`                   | Critical | axe-core | Live     |
| MT-002 | Dashboard | `Dashboard.jsx` page-head subtitle (~ line 42)     | 1.4.3   | `color-contrast`              | Serious  | axe-core | Live     |
| MT-003 | Profile   | `Profile.jsx` "Account disclosures" scroll panel   | 2.1.1   | `scrollable-region-focusable` | Serious  | axe-core | Live     |
| MT-004 | Login     | `Login.jsx` password input (`#login-password`)     | 3.3.2   | `label`                       | Critical | axe-core | Live     |
| MT-005 | Profile   | `Profile.jsx` ZIP `<Field>` autoComplete attribute | 1.3.5   | `autocomplete-valid`          | Serious  | axe-core | Live     |
| MT-006 | Transfer  | `Transfer.jsx` memo `<textarea>` (`aria-labeledby` typo) | 4.1.2 | `aria-valid-attr`             | Critical | axe-core | Live     |
| MT-007 | All authed pages | `AuthLayout.jsx` topbar Messages + Notifications icon-btns (20×20, 22 px apart) | 2.5.8 | `target-size`                 | Serious  | axe-core (WCAG 2.2 AA toggle ON) | Live |
| MT-008 | Login     | `Login.jsx` "Sign in" submit button (aria-label override) | 2.5.3 | `label-content-name-mismatch` | Serious  | axe-core (**Experimental ON**) | Live |
| MT-009 | Home      | `Home.jsx` feature-grid — three "Learn more" links     | 2.4.4 | `identical-links-same-purpose` | Minor   | axe-core (**Needs Review** — incomplete result, requires human confirmation) | Live |
| MT-010 | Every page (any icon-btn) | `theme.css` — `.icon-btn:focus, :focus-visible { outline: none; box-shadow: none }` | 2.4.7 | `advanced/css-focus-visible`   | Serious  | **Pro Advanced** (no AI credits — CSS state diff) | Live |
| MT-011 | Home      | `Home.jsx` "Spotlight offer" `<div>` styled like an h2  | 1.3.1 | `advanced/heading-markup`      | Serious  | **Pro Advanced** (uses AI credits — CV) | Live |
| MT-012 | Home      | `Home.jsx` `/ornament-divider.svg` with verbose alt    | 1.1.1 | `advanced/image-decorative`    | Minor    | **Pro Advanced** (uses AI credits — image classifier) | Live |
| MT-013 | Bills     | `Bills.jsx` "Saved payees" list (`<ul>`/`<li>` → `<div>`) | 1.3.1 | `list`                        | Serious  | axe-core | Live     |
| MT-014 | Cards     | `Cards.jsx` per-card lock toggle (`<div role="switch">` with no `aria-checked`) | 4.1.2 | `aria-required-attr` (+ `aria-toggle-field-name`) | Critical | axe-core | Live |
| MT-015 | Cards     | `Cards.jsx` card-visual EXP + cardholder row (#3d5476 on brand-deep linear-gradient) | 1.4.3 | `color-contrast` (typically **Needs Review** in axe-core because the bg is a CSS gradient; reliably fires automatic as `advanced/text-contrast` in axe DevTools Pro) | Serious  | axe-core / Pro | Live |
| MT-016 | Statements| `Statements.jsx` statements `<table>` — `<th>` elements use invalid `scope="column"` | 1.3.1 | `scope-attr-valid`            | Serious  | axe-core | Live     |
| MT-017 | Statements| `Statements.jsx` per-row Download anchor → icon-only SVG with no accessible name | 2.4.4 | `link-name`                   | Critical | axe-core | Live     |
| MT-018 | Deposit   | `Deposit.jsx` Step 1 form — focusable `<button>Clear form</button>` wrapped in `<span aria-hidden="true">` | 4.1.2 | `aria-hidden-focus`           | Serious  | axe-core | Live     |
| MT-019 | About     | `About.jsx` Leadership section — empty `<a href="#"></a>` (no body, no name) | 2.4.4 | `link-name`                   | Critical | axe-core | Live     |
| MT-020 | Help      | `Help.jsx` branch-finder ZIP input (`role="searchbox"` with no label / aria-label / placeholder) | 4.1.2 | `aria-input-field-name`       | Moderate | axe-core (BP / Needs Review depending on toggle) | Live |
| MT-021 | Forgot    | `Forgot.jsx` Email input (`autoComplete="user"` — not a WHATWG token)  | 1.3.5 | `autocomplete-valid`          | Serious  | axe-core | Live     |
| MT-022 | Wealth    | `Wealth.jsx` "Why DQBC Wealth?" callout — `<h3>` directly after the page `<h1>` (no intermediate `<h2>`) | n/a (BP) | `heading-order`              | Moderate | axe-core (Best Practice) | Live |
| MT-023 | Business  | `Business.jsx` `<img role="presentation" aria-label="DQBC business banking icon">` (role + name conflict) | n/a (BP) | `presentation-role-conflict` | Minor    | axe-core (Best Practice) | Live |
| MT-024 | Legal     | `Legal.jsx` two anchors ("Jump to Terms" + "Jump to Privacy") both declare `accessKey="t"` — duplicate accesskey | n/a (BP) | `accesskeys`                  | Serious  | axe-core (Best Practice) | Live |
| MT-025 | Home      | `Home.jsx` "Pick the right account for you" `<select>` (no label / aria-label / aria-labelledby / title) | 4.1.2 | `select-name`                 | Critical | axe-core | Live |
| MT-026 | Home      | `Home.jsx` inline ascending bar-chart `<svg role="img">` inside the hero `.fintech-pill` (no `<title>`, no aria-label) | 1.1.1 | `svg-img-alt`                 | Serious  | axe-core | Live |
| MT-027 | Home      | `Home.jsx` "Customer favorites" `<div role="listbox">` whose children are plain `<div>`s (no `role="option"`) | 1.3.1 | `aria-required-children`      | Critical | axe-core | Live |
| MT-028 | Home      | `Home.jsx` promotional-rate stripe — white text on a near-white / pale gold `linear-gradient` (~2.5–3.5:1) | 1.4.3 | `advanced/text-contrast` (axe-core `color-contrast` returns **Needs Review** because the bg is a gradient) | Serious | **Pro Advanced** | Live |
| MT-029 | Home      | `Home.jsx` `/branch-photo.svg` informative branch-building image served with `alt=""` | 1.1.1 | `advanced/image-informative-has-alt` | Minor | **Pro Advanced** (uses AI credits — image classifier) | Live |
| MT-030 | Home      | `Home.jsx` "Show more" `<button aria-expanded="yes">` next to the tagline — invalid value (valid: `true`/`false`) | 4.1.2 | `aria-valid-attr-value`       | Critical | axe-core | Live |
| MT-031 | Dashboard | `Dashboard.jsx` "Recent activity highlights" `<li role="treeitem">` items inside a plain `<ul>` (no `role="tree"`/`role="group"` ancestor) | 1.3.1 | `aria-required-parent`        | Critical | axe-core | Live |
| MT-032 | Dashboard | `Dashboard.jsx` `<span lang="frx">Coup d'œil</span>` in the balance banner delta line | 3.1.2 | `valid-lang`                  | Serious  | axe-core | Live |
| MT-033 | Dashboard | `Dashboard.jsx` "Acknowledge new statements" `<div role="button" aria-required="true">` — aria-required not allowed on role=button | 4.1.2 | `aria-allowed-attr`           | Critical | axe-core | Live |
| MT-034 | Dashboard | `Dashboard.jsx` "Account at a glance" `<dl>` containing bare `<div>` children (no `<dt>`/`<dd>` pairs) | 1.3.1 | `definition-list`             | Serious  | axe-core | Live |
| MT-035 | Dashboard | `Dashboard.jsx` "Spending snapshot" `<div>` styled as a heading (24 px / 700 / brand-deep / top margin) | 1.3.1 | `advanced/heading-markup`     | Serious  | **Pro Advanced** (uses AI credits — CV) | Live |
| MT-036 | Dashboard | `Dashboard.jsx` "Top categories this month" `<table>` — `<td headers="trend-col">` references a header id that doesn't exist (the `<th>` has id="trend-column") | 1.3.1 | `td-headers-attr`             | Serious  | axe-core | Live |
| MT-037 | Login     | `Login.jsx` `<input type="button">` next to "Sign in" header (no value/aria-label/title) | 4.1.2 | `input-button-name`           | Critical | axe-core | Live |
| MT-038 | Login     | `Login.jsx` password-strength `<div role="progressbar">` (no aria-label / aria-labelledby) | 1.1.1 | `aria-progressbar-name`       | Critical | axe-core | Live |
| MT-039 | Login     | `Login.jsx` empty `<span role="tooltip">` next to password input | 4.1.2 | `aria-tooltip-name`           | Serious  | axe-core | Live |
| MT-040 | Login     | `Login.jsx` stray `<dt>Customer since 1923</dt>` outside any `<dl>` in welcome panel | 1.3.1 | `dlitem`                      | Serious  | axe-core | Live |
| MT-041 | Login     | `Login.jsx` low-contrast disclaimer `#7a92b8` on brand-deep gradient in welcome panel | 1.4.3 | `advanced/text-contrast`      | Serious  | **Pro Advanced** | Live |
| MT-042 | Login     | `Login.jsx` paragraph with inline `letterSpacing/wordSpacing/lineHeight` fixed values | 1.4.12 | `avoid-inline-spacing`       | Serious  | axe-core | Live |
| MT-043 | Profile   | `Profile.jsx` "Display name" input has TWO `<label htmlFor="display-name">` pointing at one input | 3.3.2 | `form-field-multiple-labels`  | Moderate | axe-core | Live |
| MT-044 | Profile   | `Profile.jsx` "Profile completeness" `<div role="meter">` without accessible name | 1.1.1 | `aria-meter-name`             | Critical | axe-core | Live |
| MT-045 | Profile   | `Profile.jsx` Two-factor `<button role="switch">` empty / no accessible name | 4.1.2 | `aria-toggle-field-name` (often co-fires as `button-name`) | Serious | axe-core | Live |
| MT-046 | Profile   | `Profile.jsx` `<object data="/branch-photo.svg">` with no `aria-label` / body fallback | 1.1.1 | `object-alt`                  | Serious  | axe-core | Live |
| MT-047 | Profile   | `Profile.jsx` `<section role="region" aria-orientation="diagonal">` — invalid value | 4.1.2 | `aria-valid-attr-value`       | Critical | axe-core | Live |
| MT-048 | Profile   | `Profile.jsx` "Security preferences" `<div>` styled as h3 (22 px / 700) | 1.3.1 | `advanced/heading-markup`     | Serious  | **Pro Advanced** | Live |
| MT-049 | Transfer  | `Transfer.jsx` Step 1 "Frequency" `<select>` with no label/aria-label | 4.1.2 | `select-name`                 | Critical | axe-core | Live |
| MT-050 | Transfer  | `Transfer.jsx` Step 1 "Recent recipients" `<div role="combobox">` missing required `aria-expanded` | 4.1.2 | `aria-required-attr`          | Critical | axe-core | Live |
| MT-051 | Transfer  | `Transfer.jsx` Step 1 empty `<a href="/fintech/help">` (no body, no aria-label) | 2.4.4 | `link-name`                   | Critical | axe-core | Live |
| MT-052 | Transfer  | `Transfer.jsx` Step 1 `<div role="presentation" aria-required="true">` — disallowed attr on presentation | 4.1.2 | `aria-allowed-attr`           | Critical | axe-core | Live |
| MT-053 | Transfer  | `Transfer.jsx` Step 1 "tip" banner — white text on gold-to-white gradient | 1.4.3 | `advanced/text-contrast`      | Serious  | **Pro Advanced** | Live |
| MT-054 | Transfer  | `Transfer.jsx` Step 1 "Transfer speed" `<div role="radiogroup">` with `<div>` children | 1.3.1 | `aria-required-children` (may not fire on radiogroup-without-radio in axe-core 4.10 — see notes) | Critical | axe-core | Live |
| MT-055 | Bills     | `Bills.jsx` icon-only "Edit payee" `<button>` per payee (no aria-label) | 4.1.2 | `button-name`                 | Critical | axe-core | Live |
| MT-056 | Bills     | `Bills.jsx` "Bill category" `<div role="tablist">` with `<div>` children (no role="tab") | 1.3.1 | `aria-required-children`      | Critical | axe-core | Live |
| MT-057 | Bills     | `Bills.jsx` stray `<dd>Most recent payment…</dd>` outside any `<dl>` | 1.3.1 | `dlitem`                      | Serious  | axe-core | Live |
| MT-058 | Bills     | `Bills.jsx` empty `<span role="tooltip">` next to each payee Edit button | 4.1.2 | `aria-tooltip-name`           | Serious  | axe-core | Live |
| MT-059 | Bills     | `Bills.jsx` `<span lang="xx-bills">(category)</span>` on each payee name | 3.1.2 | `valid-lang`                  | Serious  | axe-core | Live |
| MT-060 | Bills     | `Bills.jsx` "Save $25" promo banner — gold text on white-to-gold gradient | 1.4.3 | `advanced/text-contrast`      | Serious  | **Pro Advanced** | Live |
| MT-061 | Cards     | `Cards.jsx` per-card "Spending limit" `<div role="progressbar">` (no accessible name) | 1.1.1 | `aria-progressbar-name`       | Critical | axe-core | Live |
| MT-062 | Cards     | `Cards.jsx` icon-only "Freeze card" `<button>` per card (no aria-label) | 4.1.2 | `button-name`                 | Critical | axe-core | Live |
| MT-063 | Cards     | `Cards.jsx` per-card "Card style" `<select>` (no label) | 4.1.2 | `select-name`                 | Critical | axe-core | Live |
| MT-064 | Cards     | `Cards.jsx` per-card info icon-only `<a>` (no aria-label, no text body) | 2.4.4 | `link-name`                   | Critical | axe-core | Live |
| MT-065 | Cards     | `Cards.jsx` per-card network badge `<span role="img" aria-orientation="diagonal">` invalid value | 4.1.2 | `aria-valid-attr-value`       | Critical | axe-core | Live |
| MT-066 | Cards     | `Cards.jsx` per-card decorative `/ornament-divider.svg` with verbose alt | 1.1.1 | `advanced/image-decorative`   | Minor    | **Pro Advanced** (AI) | Live |
| MT-067 | Statements| `Statements.jsx` "Quick filters" `<div role="grid">` with plain `<div>` children | 1.3.1 | `aria-required-children`      | Critical | axe-core | Live |
| MT-068 | Statements| `Statements.jsx` `<dl>` containing only `<p>` children (no `<dt>`/`<dd>`) | 1.3.1 | `definition-list`             | Serious  | axe-core | Live |
| MT-069 | Statements| `Statements.jsx` `<span lang="zzx">Form W-9</span>` on tax-form acronym | 3.1.2 | `valid-lang`                  | Serious  | axe-core | Live |
| MT-070 | Statements| `Statements.jsx` "Show more years" `<button aria-rowindex={2}>` — disallowed attr | 4.1.2 | `aria-allowed-attr`           | Critical | axe-core | Live |
| MT-071 | Statements| `Statements.jsx` "Statement type" `<select>` (no label) | 4.1.2 | `select-name`                 | Critical | axe-core | Live |
| MT-072 | Statements| `Statements.jsx` "Tax documents" section title rendered as a styled `<p>` (22 px / 700) | 1.3.1 | `advanced/heading-markup`     | Serious  | **Pro Advanced** (AI) | Live |
| MT-073 | Deposit   | `Deposit.jsx` Step 1 `<input type="image" src="/check-success.svg">` with no `alt` | 1.1.1 | `input-image-alt`             | Critical | axe-core | Live |
| MT-074 | Deposit   | `Deposit.jsx` Step 1 "Deposit type" `<div role="radiogroup">` with `<div>` children | 1.3.1 | `aria-required-children` (radiogroup-no-radios may not fire in axe-core 4.10 — see notes) | Critical | axe-core | Live |
| MT-075 | Deposit   | `Deposit.jsx` Step 1 "Auto-deposit" `<button role="switch">` empty (no name) | 4.1.2 | `aria-toggle-field-name` (often co-fires as `button-name`) | Serious | axe-core | Live |
| MT-076 | Deposit   | `Deposit.jsx` Step 1 "Daily deposit limit" `<div role="meter">` (no accessible name) | 1.1.1 | `aria-meter-name`             | Critical | axe-core | Live |
| MT-077 | Deposit   | `Deposit.jsx` Step 1 `<span lang="frzz">Reçu</span>` invalid lang | 3.1.2 | `valid-lang`                  | Serious  | axe-core | Live |
| MT-078 | Deposit   | `Deposit.jsx` Step 1 hint banner — gold text on white-to-gold gradient | 1.4.3 | `advanced/text-contrast`      | Serious  | **Pro Advanced** | Live |

> _Tool column values: `axe-core` / `axe Linter` / `Pro Advanced` / `IGT`._
> _Status values: `TODO` / `Live` / `Removed` / `Replaced`._

### Batch 1 — verification cheat sheet

How to confirm each rule fires using axe DevTools (browser extension), default toggles
(Best Practices OFF, Experimental OFF, Needs Review ON or OFF — these all fire automatically):

| ID     | Steps to reach                                          | Expected finding                                                                          |
| ------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| MT-001 | Open `/#/fintech` (Home) and run a scan                 | Critical: Images must have alternate text (`image-alt`) on `img[src="/fintech-hero.svg"]` |
| MT-002 | Sign in, open `/#/fintech/dashboard`, run a scan         | Serious: Elements must meet minimum color contrast (`color-contrast`) on the "Last sign-in: today, 9:42 AM · Chicago, IL" line |
| MT-003 | Sign in, open `/#/fintech/profile`, scroll past Notifications, run a scan | Serious: Scrollable region must have keyboard access (`scrollable-region-focusable`) on the "Account disclosures" container |
| MT-004 | Sign out, open `/#/fintech/login`, run a scan | Critical: Form elements must have labels (`label`) on `#login-password` |
| MT-005 | Sign in, open `/#/fintech/profile`, run a scan | Serious: `autocomplete` attribute is correctly formatted (`autocomplete-valid`) on the ZIP input |
| MT-006 | Sign in, open `/#/fintech/transfer`, run a scan on Step 1 | Critical: ARIA attributes must conform to valid names (`aria-valid-attr`) on the memo textarea |
| MT-007 | Sign in, open any authed page (`/#/fintech/dashboard` is easy). Verify **WCAG 2.2 AA** is ticked in the toggle row, then run a scan | Serious: All touch targets must be 24×24 or have sufficient space (`target-size`) on **two** icon-btns (Messages + Notifications) |
| MT-008 | Sign out, open `/#/fintech/login`, **flip Experimental: ON**, then run a scan | Serious: Elements with visible labels must include the visible label in the accessible name (`label-content-name-mismatch`) on the Sign-in button. Note: axe-core 4.10 tags this rule `experimental`, so it does **not** appear with Experimental OFF. |
| MT-009 | Open `/#/fintech` (Home), run a scan | This rule comes back as a **Needs Review / incomplete** finding (not an automatic violation). The axe engine can't programmatically decide whether 3 "Learn more" links serve a similar purpose, so it flags it for human inspection. In the extension, look in the **Needs Review** section. |
| MT-010 | Sign in, open any authed page (Dashboard is easy). Tab to the topbar Messages / Notifications icon — there is **no visible focus ring**. In axe DevTools Pro, run a scan; the finding will appear in **Automatic Issues (advanced)** rather than the core axe-core bucket. |
| MT-011 | Open `/#/fintech` (Home). Scroll past the feature cards to the "Spotlight offer" line — it's visually a heading but semantically a `<div>`. In axe DevTools Pro, run a scan; the finding appears in **Automatic Issues (advanced)**. Note: this rule consumes AI credits, so if your org's credit pool is exhausted, the rule is skipped automatically (the panel will tell you). |
| MT-012 | Open `/#/fintech` (Home). Just above the Spotlight section sits a thin ornamental gold divider — the verbose `alt` description claims "ornamental gold-toned divider…" but the AI rule recognises it as a purely decorative element. In axe DevTools Pro, run a scan; the finding appears in **Automatic Issues (advanced)**. AI credits required. |

### Batch 5 — verification cheat sheet

All axe-core rows fire on **default toggles** (WCAG 2.2 AA ON, BP OFF, Experimental OFF) unless noted. Pro Advanced rows appear in **Automatic Issues (advanced)** in axe DevTools Pro.

| ID     | Steps to reach                                                       | Expected finding |
| ------ | -------------------------------------------------------------------- | ---------------- |
| MT-037 | Sign out, open `/#/fintech/login`                                    | Critical: Input buttons must have a discernible text (`input-button-name`) on the small `<input type="button">` next to the "Sign in" heading. |
| MT-038 | Same as MT-037                                                       | Critical: Progressbar elements must have an accessible name (`aria-progressbar-name`) on the password-strength bar. |
| MT-039 | Same as MT-037                                                       | Serious: Tooltip elements must have an accessible name (`aria-tooltip-name`) on the empty `<span role="tooltip">` next to the password input. |
| MT-040 | Same as MT-037                                                       | Serious: `<dt>` and `<dd>` elements must be contained by a `<dl>` (`dlitem`) on the stray "Customer since 1923" element in the welcome panel. |
| MT-041 | Same as MT-037 (Pro Advanced)                                        | Serious: text-contrast finding on the low-contrast disclaimer line over the dark gradient panel. Appears in **Automatic Issues (advanced)**. |
| MT-042 | Same as MT-037                                                       | Serious: Inline styles should not be used to set spacing (`avoid-inline-spacing`) on the paragraph with `letterSpacing` / `wordSpacing` / `lineHeight` inline. |
| MT-043 | Sign in, open `/#/fintech/profile`                                   | Moderate: Form field has multiple label elements (`form-field-multiple-labels`) on the `#display-name` input. |
| MT-044 | Same as MT-043                                                       | Critical: Meter elements must have an accessible name (`aria-meter-name`) on the "Profile completeness" meter at the top. |
| MT-045 | Same as MT-043                                                       | Serious: Toggle field / button must have an accessible name (`aria-toggle-field-name` or `button-name`) on the empty Two-factor switch. |
| MT-046 | Same as MT-043                                                       | Serious: `<object>` elements must have alternate text (`object-alt`) on the embedded branch-photo svg. |
| MT-047 | Same as MT-043                                                       | Critical: ARIA attribute value must be valid (`aria-valid-attr-value`) on `<section aria-orientation="diagonal">`. |
| MT-048 | Same as MT-043 (Pro Advanced)                                        | Serious: heading-markup finding on the "Security preferences" pseudo-heading. **Automatic Issues (advanced)**. |
| MT-049 | Sign in, open `/#/fintech/transfer` (Step 1)                         | Critical: Select must have an accessible name (`select-name`) on the unlabelled "Frequency" select. |
| MT-050 | Same as MT-049                                                       | Critical: Required ARIA attributes must be provided (`aria-required-attr`) on the "Recent recipients" combobox missing `aria-expanded`. |
| MT-051 | Same as MT-049                                                       | Critical: Links must have discernible text (`link-name`) on the empty Help anchor. |
| MT-052 | Same as MT-049                                                       | Critical: Elements must only use allowed ARIA attributes (`aria-allowed-attr`) on `<div role="presentation" aria-required="true">`. |
| MT-053 | Same as MT-049 (Pro Advanced)                                        | Serious: text-contrast finding on the white-on-gradient "tip" banner. **Automatic Issues (advanced)**. |
| MT-054 | Same as MT-049                                                       | Critical: ARIA roles must contain particular children (`aria-required-children`) on the Transfer speed radiogroup. Note: axe-core 4.10 may not fire `radiogroup-with-no-radios` in all configurations — verify in the extension. |
| MT-055 | Sign in, open `/#/fintech/bills`                                     | Critical: Buttons must have discernible text (`button-name`) on each per-payee Edit icon-button. |
| MT-056 | Same as MT-055                                                       | Critical: ARIA roles must contain particular children (`aria-required-children`) on the "Bill category" tablist. |
| MT-057 | Same as MT-055                                                       | Serious: `dlitem` on the stray `<dd>` above the saved-payees list. |
| MT-058 | Same as MT-055                                                       | Serious: Tooltip must have an accessible name (`aria-tooltip-name`) on the empty tooltip span beside each Edit button. |
| MT-059 | Same as MT-055                                                       | Serious: `lang` attribute must have a valid value (`valid-lang`) on the `(category)` span beside each payee name. |
| MT-060 | Same as MT-055 (Pro Advanced)                                        | Serious: text-contrast on the "Save $25" promo banner. **Automatic Issues (advanced)**. |
| MT-061 | Sign in, open `/#/fintech/cards`                                     | Critical: Progressbar must have a name (`aria-progressbar-name`) on each card's "Spending limit" bar. |
| MT-062 | Same as MT-061                                                       | Critical: Button name on each card's Freeze icon-button. |
| MT-063 | Same as MT-061                                                       | Critical: Select name on each "Card style" select. |
| MT-064 | Same as MT-061                                                       | Critical: Link name on each per-card info icon-link. |
| MT-065 | Same as MT-061                                                       | Critical: ARIA attribute value must be valid (`aria-valid-attr-value`) on `<span role="img" aria-orientation="diagonal">`. |
| MT-066 | Same as MT-061 (Pro Advanced)                                        | Minor: image-decorative on the per-card ornament with verbose alt. **Automatic Issues (advanced)**. |
| MT-067 | Sign in, open `/#/fintech/statements`                                | Critical: Required children on the "Quick filters" grid. |
| MT-068 | Same as MT-067                                                       | Serious: `<dl>` must only contain proper dt/dd (`definition-list`) on the prose dl. |
| MT-069 | Same as MT-067                                                       | Serious: `valid-lang` on the `<span lang="zzx">Form W-9</span>` element. |
| MT-070 | Same as MT-067                                                       | Critical: `aria-allowed-attr` on the "Show more years" button with `aria-rowindex`. |
| MT-071 | Same as MT-067                                                       | Critical: `select-name` on the "Statement type" select. |
| MT-072 | Same as MT-067 (Pro Advanced)                                        | Serious: heading-markup on the "Tax documents" pseudo-heading paragraph. **Automatic Issues (advanced)**. |
| MT-073 | Sign in, open `/#/fintech/deposit` (Step 1)                          | Critical: Image inputs must have alternate text (`input-image-alt`) on the scan-to-capture image input. |
| MT-074 | Same as MT-073                                                       | Critical: Required children on the "Deposit type" radiogroup. (Same caveat as MT-054 — verify in the extension.) |
| MT-075 | Same as MT-073                                                       | Serious: Toggle field / button name on the empty Auto-deposit switch. |
| MT-076 | Same as MT-073                                                       | Critical: Meter must have an accessible name on the "Daily deposit limit" meter. |
| MT-077 | Same as MT-073                                                       | Serious: `valid-lang` on the `<span lang="frzz">Reçu</span>` element. |
| MT-078 | Same as MT-073 (Pro Advanced)                                        | Serious: text-contrast on the deposit hint banner. **Automatic Issues (advanced)**. |

### Batch 5 — accessible fix (for reference)

| ID     | Minimal fix |
| ------ | ----------- |
| MT-037 | Add a `value="Help"` (or `aria-label="Help"`) to the `<input type="button">`. |
| MT-038 | Add `aria-label="Password strength"` (or `aria-labelledby` pointing to a visible label) to the progressbar `<div>`. |
| MT-039 | Either remove the empty tooltip span entirely, or give it text content / `aria-label`. |
| MT-040 | Move the `<dt>` inside a real `<dl>` paired with a `<dd>`, OR change the `<dt>` to a `<p>` / `<span>`. |
| MT-041 | Pick a foreground colour that meets 4.5:1 on the darkest portion of the gradient (e.g. `#cfe0f3`), or solidify the background. |
| MT-042 | Remove the inline `letterSpacing` / `wordSpacing` / `lineHeight` and let user stylesheets / the cascade decide. |
| MT-043 | Keep exactly one `<label htmlFor="display-name">`; remove the second. |
| MT-044 | Add `aria-label="Profile completeness"` (or `aria-labelledby`) to the `<div role="meter">`. |
| MT-045 | Add `aria-label="Two-factor authentication"` to the switch, or wrap it in a `<label>` and include text. |
| MT-046 | Add an `aria-label` or fallback body text inside the `<object>`. |
| MT-047 | Either remove `aria-orientation` or set it to `horizontal`, `vertical`, or `undefined`. |
| MT-048 | Replace the styled `<div>` with `<h3>Security preferences</h3>`. |
| MT-049 | Add a `<label>` (or `aria-label`) for the Frequency select. |
| MT-050 | Add `aria-expanded="false"` to the combobox (required attribute). |
| MT-051 | Give the Help anchor text (e.g. "Need help?") or an `aria-label`. |
| MT-052 | Remove `aria-required` from a presentation element, or drop `role="presentation"`. |
| MT-053 | Pick a foreground colour with sufficient contrast against the gold gradient. |
| MT-054 | Use `<input type="radio" name="speed">` inside the radiogroup (or set role="radio" on the option `<div>`s with `aria-checked`). |
| MT-055 | Add `aria-label="Edit payee"` to each Edit icon-button. |
| MT-056 | Use `<button role="tab">` for the tab children (or add `role="tab"` to the existing `<div>`s). |
| MT-057 | Move the `<dd>` inside a `<dl>` paired with a `<dt>`, or use `<p>`. |
| MT-058 | Remove or name the empty tooltip span. |
| MT-059 | Use a valid BCP 47 code (e.g. `lang="en"`) or remove the attribute. |
| MT-060 | Increase the foreground colour contrast against the gradient. |
| MT-061 | Add `aria-label="Spending limit used: X%"` to each progressbar. |
| MT-062 | Add `aria-label="Freeze card"` to each Freeze button. |
| MT-063 | Add a `<label>` for each Card style select. |
| MT-064 | Add `aria-label="Card help"` to the info link. |
| MT-065 | Set `aria-orientation` to a valid value or remove it. |
| MT-066 | Use `alt=""` (or `role="presentation"`) on the decorative ornament. |
| MT-067 | Use `role="row"` children on the grid (or remove the `role="grid"` and use a `<ul>`). |
| MT-068 | Restructure the `<dl>` with `<dt>` / `<dd>` pairs, or convert to `<p>`s outside the dl. |
| MT-069 | Use a valid BCP 47 code (or remove the attribute). |
| MT-070 | Remove `aria-rowindex` from the button (it's only valid on table-row roles). |
| MT-071 | Add a `<label>` for the Statement type select. |
| MT-072 | Replace the styled `<p>` with `<h3>Tax documents</h3>`. |
| MT-073 | Add an `alt` attribute to the `<input type="image">` (e.g. `alt="Scan check"`). |
| MT-074 | Use `<input type="radio">` inside the radiogroup (or set role="radio" + aria-checked on the option divs). |
| MT-075 | Add `aria-label="Auto-deposit recurring checks"` to the switch. |
| MT-076 | Add `aria-label="Daily deposit limit used"` to the meter. |
| MT-077 | Use a valid BCP 47 code (or remove the attribute). |
| MT-078 | Increase the foreground colour contrast against the gradient. |

## Pro Advanced verification caveat

The MT-010, MT-011, MT-012 rules ship with **axe DevTools Pro** (the Advanced rules pack), not axe-core. Any verification harness that loads axe-core from CDN — including the JS-injection check used during this project — **cannot** fire these rules. The only way to confirm they trigger is to scan the page in a Chrome window where the licensed axe DevTools Pro extension is installed. In the extension, the findings appear under **Automatic Issues (advanced)** rather than **Automatic Issues (axe-core)**.

Two of the three (`heading-markup`, `image-decorative`) consume **AI credits** from your org allocation; if the pool is exhausted, the rule is silently skipped and the issue won't appear. `css-focus-visible` does **not** use AI credits (it's a deterministic CSS-state diff).

## Pre-existing Phase 1 issues

These are issues that pre-date the Phase 2 effort. They were introduced inadvertently while building the clean baseline (most are slightly-too-light colors and inline body links without underlines). They are catalogued here so a customer scan returns no "mystery" findings — every finding has a row.

The `MT-*` IDs above are deliberate Phase 2 additions; the `PL-*` IDs below are Phase 1 Leftovers. Status `Pre-existing` means we know about it, we haven't fixed it, and we're choosing to leave it in for now so demos look realistic.

| ID     | Page(s)                          | Component                                                  | WCAG  | axe rule              | Severity | Tool     | Status        |
| ------ | -------------------------------- | ---------------------------------------------------------- | ----- | --------------------- | -------- | -------- | ------------- |
| PL-001 | Every public page (header)       | `PublicLayout.jsx` "Open account" CTA `.btn-accent--accessible` (gold `#c9a961` on white ≈ 2.5:1) | 1.4.3 | `color-contrast`      | Serious  | axe-core | Pre-existing |
| PL-002 | Dashboard                        | `Dashboard.jsx` `.card-head > a` "See all" link            | 1.4.3 | `color-contrast`      | Serious  | axe-core | Pre-existing |
| PL-003 | Login                            | `Login.jsx` inline "Terms" link in body copy (no underline) | 1.4.1 | `link-in-text-block`  | Serious  | axe-core | Pre-existing |
| PL-004 | Login                            | `Login.jsx` inline "Privacy Notice" link in body copy       | 1.4.1 | `link-in-text-block`  | Serious  | axe-core | Pre-existing |

### Notes on the PL set

- **PL-001 is single-source, multi-instance.** The button is rendered once in `PublicLayout.jsx` but appears on every public route (Home, Login, About, Business, Wealth, products/*). One fix covers all instances.
- **PL-002** is likely the `.card-head a` style — a desaturated brand-blue that loses a few points against the panel background. Fix: drop the opacity / fade and use the full `--brand-primary` token.
- **PL-003 / PL-004** both fail `link-in-text-block` because the inline links in the legal sentence below the Sign-in card are color-only (no underline). Fix: add `text-decoration: underline` to inline body links, or any non-color visual indicator.
- These rows don't get `PHASE-2` inline tags in the source — they pre-date Phase 2. They're tracked here purely for catalog completeness.

### Batch 1 — accessible fix (for reference)

| ID     | Minimal fix                                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------ |
| MT-001 | Restore `alt=""` + `role="presentation"` on the decorative hero img, OR give it a meaningful `alt="…"` if it's content.  |
| MT-002 | Remove the inline `style={{ color: '#8a92a3' }}` so the `.subtitle` class falls back to `var(--text-secondary)`.          |
| MT-003 | Add `tabIndex={0}` + `role="region"` to the scrollable container; the existing `aria-labelledby` already names it.       |
| MT-004 | Replace the styled `<span className="faux-label">` with a real `<label htmlFor="login-password">Password</label>`.        |
| MT-005 | Restore `autoComplete="postal-code"` on the ZIP field (a valid WHATWG autofill token).                                   |
| MT-006 | Fix the misspelling: `aria-labeledby` → `aria-labelledby` (or remove the attribute entirely since the `<label>` already names it). |
| MT-007 | Drop the inline `<div style={{ display: 'inline-flex', gap: 2 }}>` wrapper and remove the `width: 20, height: 20` inline styles on both icon-btns. The `.icon-btn` class default is 38×38 and the parent `.auth-topbar-right` already has 12 px gap. |
| MT-008 | Remove `aria-label="Submit credentials"` from the submit button — the visible text "Sign in" already provides a sufficient accessible name. |
| MT-009 | Differentiate the link text: "Learn about checking", "Learn about mortgages", "Learn about investing" (or add `aria-label="Learn more about <topic>"` per link). |
| MT-010 | Remove the `.sector-fintech .icon-btn:focus, :focus-visible { outline: none; box-shadow: none }` block in `theme.css`. The global `:focus-visible { outline: 2px solid var(--brand-primary) }` then re-applies. |
| MT-011 | Replace the styled `<div>Spotlight offer</div>` with `<h2 className="section-title">Spotlight offer</h2>` (the existing class gives the right visual weight). |
| MT-012 | Change the ornament `<img>` to `alt=""` (or add `role="presentation"`, or `aria-hidden="true"`). |

### Batch 3 — verification cheat sheet

How to confirm each Batch 3 rule fires using axe DevTools (browser extension).
Default toggles (Best Practices OFF, Experimental OFF, Needs Review ON) catch most
of these; the ones that need **Best Practices: ON** are called out per row.

| ID     | Steps to reach                                          | Expected finding                                                                          |
| ------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| MT-013 | Sign in, open `/#/fintech/bills`, scroll to "Saved payees", run a scan | Serious: `<ul>` and `<ol>` must only directly contain `<li>`, `<script>` or `<template>` elements (`list`) — or, depending on how axe interprets the demoted markup, a related semantics finding. The visual list is now built from `<div>` wrappers, so it has no programmatic list role. |
| MT-014 | Sign in, open `/#/fintech/cards`, run a scan | Critical: Required ARIA attributes must be provided (`aria-required-attr`) on the `<div role="switch">` lock toggle — `aria-checked` is required for `switch` and is missing. Often co-fires `aria-toggle-field-name` (Serious) because the switch also has no accessible name. |
| MT-015 | Sign in, open `/#/fintech/cards`, run a scan | The element fails 4.5:1 by hex math (#3d5476 over the deep-blue gradient ≈ 2.6:1). In **axe-core baseline** this typically surfaces as a **Needs Review** because the background is a CSS `linear-gradient` and axe-core can't pick a definitive background colour. In **axe DevTools Pro** (Experimental ON) the screenshot-based `advanced/text-contrast` rule analyses the rendered pixels and reports it as an automatic Serious finding. |
| MT-016 | Sign in, open `/#/fintech/statements`, run a scan | Serious: ARIA `scope` attribute values must be valid (`scope-attr-valid`) on every `<th>` in the statements table — `scope="column"` is invalid (valid tokens: `col`, `row`, `colgroup`, `rowgroup`). WCAG 1.3.1. |
| MT-017 | Sign in, open `/#/fintech/statements`, run a scan | Critical: Links must have discernible text (`link-name`) on the per-row download anchor — the only child is an `aria-hidden` SVG, so there is no accessible name. |
| MT-018 | Sign in, open `/#/fintech/deposit`, run a scan on Step 1 (no form interaction required, no Best Practices toggle needed) | Serious: ARIA hidden element must not be focusable or contain focusable elements (`aria-hidden-focus`) — the "Clear form" `<button>` is keyboard-focusable but its `<span aria-hidden="true">` wrapper hides it from assistive tech. |
| MT-019 | Open `/#/fintech/about` and run a scan | Critical: Links must have discernible text (`link-name`) on the empty `<a href="#"></a>` in the Leadership section. |
| MT-020 | Open `/#/fintech/help`, scroll to "Find a branch", run a scan | Moderate: ARIA input fields must have an accessible name (`aria-input-field-name`) on the ZIP input — `role="searchbox"` with no `<label>`, no `aria-label`, no `aria-labelledby`, no `placeholder`. |
| MT-021 | Sign out (or open a private window), open `/#/fintech/forgot`, run a scan | Serious: `autocomplete` attribute must be used correctly (`autocomplete-valid`) on the email input — `autoComplete="user"` is not a valid WHATWG autofill token. |
| MT-022 | Open `/#/fintech/wealth`, **flip Best Practices: ON**, run a scan | Moderate (BP): Heading levels should only increase by one (`heading-order`) — the page jumps from the hero `<h1>` to the "Why DQBC Wealth?" `<h3>` with no intermediate `<h2>`. |
| MT-023 | Open `/#/fintech/business`, **flip Best Practices: ON**, run a scan | Minor (BP): Elements with `role="presentation"` must not have an accessible name (`presentation-role-conflict`) on the small `<img>` near the top of the page — it declares both `role="presentation"` and `aria-label="DQBC business banking icon"`, which contradict each other. (Originally this row demoed the `region` rule via a stray `<div><p>...</p></div>`, but `PublicLayout.jsx` wraps every page in `<main>`, so the stray paragraph was already inside a landmark and `region` never fired. The paragraph was left in place; the failing element is now the conflicting `<img>`.) |
| MT-024 | Open `/#/fintech/legal`, **flip Best Practices: ON**, run a scan | Serious (BP): `accesskey` attribute value should be unique (`accesskeys`) — two anchors at the top of the page ("Jump to Terms of service" and "Jump to Privacy notice") both declare `accessKey="t"`. The rule fires on duplicate accesskey values; a single unique accesskey on its own does not trip it. |

### Batch 4 — verification cheat sheet

How to confirm each Batch 4 rule fires using axe DevTools (browser extension).
Default toggles (WCAG 2.2 AA ON, Best Practices OFF, Experimental OFF) catch all
of the axe-core rows below — no toggles need to be flipped. The three Pro
Advanced rules (MT-028, MT-029, MT-035) only appear when scanning in a Chrome
window with the licensed **axe DevTools Pro** extension installed; they surface
in **Automatic Issues (advanced)** rather than the axe-core bucket. MT-029 and
MT-035 consume AI credits.

| ID     | Steps to reach                                          | Expected finding                                                                          |
| ------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| MT-025 | Open `/#/fintech` (Home), scroll to "Pick the right account for you" above the feature cards, run a scan | Critical: Select element must have an accessible name (`select-name`) on the `<select>` — no `<label>`, no `aria-label`, no `aria-labelledby`, no `title`. |
| MT-026 | Open `/#/fintech` (Home), run a scan | Serious: `<svg>` elements with an img role must have an alternative text (`svg-img-alt`) on the small ascending bar-chart svg inside the `New · Smart Savings 4.25% APY` pill. |
| MT-027 | Open `/#/fintech` (Home), scroll to "Customer favorites", run a scan | Critical: Certain ARIA roles must contain particular children (`aria-required-children`) on the `<div role="listbox">` — the children are bare `<div>`s with no `role="option"`. |
| MT-028 | Open `/#/fintech` (Home) in a Chrome window with **axe DevTools Pro** installed. Run a scan. The finding appears in **Automatic Issues (advanced)** | Serious: Text contrast (`advanced/text-contrast`) on the "Limited-time promotional rate…" stripe — white text on a near-white / pale gold `linear-gradient`. axe-core `color-contrast` will simultaneously return this as **Needs Review** because the background is a gradient and single-colour math can't decide. |
| MT-029 | Open `/#/fintech` (Home) in a Chrome window with **axe DevTools Pro** installed (AI credits available). Scroll to the branch-photo image under "Customer favorites". Run a scan. The finding appears in **Automatic Issues (advanced)** | Minor: Informative images must have alternative text (`advanced/image-informative-has-alt`) on `/branch-photo.svg`. The image shows a stylised bank branch with "DQBC Downtown" signage; the AI classifier reads it as informative content rather than decoration, but it ships with `alt=""`. |
| MT-030 | Open `/#/fintech` (Home), run a scan | Critical: ARIA attribute value must be valid (`aria-valid-attr-value`) on the "Show more" disclosure `<button aria-expanded="yes">`. `aria-expanded` accepts only `true` / `false`. |
| MT-031 | Sign in, open `/#/fintech/dashboard`, scroll to "Recent activity highlights", run a scan | Critical: Certain ARIA roles must be contained by particular parents (`aria-required-parent`) on each `<li role="treeitem">` — the surrounding `<ul>` has implicit role `list`, not `tree` or `group`. |
| MT-032 | Sign in, open `/#/fintech/dashboard`, run a scan | Serious: `lang` attribute must have a valid value (`valid-lang`) on the `<span lang="frx">Coup d'œil</span>` inside the balance banner delta line. `frx` is not a valid BCP 47 primary language subtag. |
| MT-033 | Sign in, open `/#/fintech/dashboard`, run a scan | Critical: ARIA attributes must be allowed for an element's role (`aria-allowed-attr`) on the "Acknowledge new statements" `<div role="button" aria-required="true">`. `aria-required` is not in the allowed-attr list for `role=button`. |
| MT-034 | Sign in, open `/#/fintech/dashboard`, scroll to "Account at a glance", run a scan | Serious: `<dl>` elements must only directly contain properly-ordered `<dt>` and `<dd>` groups, `<script>`, `<template>` or `<div>` wrappers (`definition-list`) — the `<dl>` here has bare `<div>` children with no `<dt>`/`<dd>` pairs inside. |
| MT-035 | Sign in, open `/#/fintech/dashboard` in a Chrome window with **axe DevTools Pro** installed (AI credits available). Scroll to the "Spending snapshot" text above the spending breakdown. Run a scan. The finding appears in **Automatic Issues (advanced)** | Serious: Heading markup (`advanced/heading-markup`) on the "Spending snapshot" `<div>` — visually a heading (24 px / 700 / brand-deep / top margin), semantically a `<div>`. CV/AI classifier detects the heading pattern. |
| MT-036 | Sign in, open `/#/fintech/dashboard`, scroll to "Top categories this month", run a scan | Moderate: All cells with a headers attribute must refer to header cells in the same table (`td-headers-attr`) on the 3 `<td headers="trend-col">` cells — there is no `<th id="trend-col">` (the actual id is `"trend-column"`). |

### Batch 3 — accessible fix (for reference)

| ID     | Minimal fix                                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------ |
| MT-013 | Restore the `<ul className="payee-list">` wrapper and the `<li className="payee-row">` items. The list-style is already cleared in CSS; semantics return immediately. |
| MT-014 | Restore the native `<input type="checkbox">` wrapped in a `<label htmlFor={lockId}>`. (If the team really wants a styled switch, add `aria-checked={card.locked}` and `aria-label="Lock this card"` to the `<div role="switch">`.) |
| MT-015 | Remove the inline `color: '#3d5476'` from the cardholder/EXP row so the `.card-visual` default white text re-applies (white on the deep-blue gradient passes contrast). |
| MT-016 | Change `scope="column"` to the valid `scope="col"` on each of the five `<th>` elements in the statements table head. |
| MT-017 | Restore the visible "Download" text inside each per-row anchor (and the visually-hidden `{period} … statement (PDF, …)` span for full context). Alternatively keep the icon and add `aria-label={\`Download ${period} statement (PDF, ${sizeKB} KB)\`}`. |
| MT-018 | Remove the `<span aria-hidden="true">` wrapper from the "Clear form" `<button>` (or add `tabindex="-1"` to the button so it's not focusable while hidden — though removing the wrapper is the clean fix). |
| MT-019 | Remove the empty `<a>`, or give it real text (e.g. `<a href="#leaders">Share this story</a>`). |
| MT-020 | Restore the `<label htmlFor={filterId}>ZIP code</label>` and the `placeholder="60607"`; drop `role="searchbox"` (the native `<input type="text">` is already a textbox). |
| MT-021 | Restore `autoComplete="email"` (a valid WHATWG autofill token). |
| MT-022 | Either promote the callout to `<h2>` so the order is h1 → h2 → h2 → h2…, or remove the callout entirely. |
| MT-023 | Remove either the `role="presentation"` OR the `aria-label="…"` from the `<img>` — a presentational element must not have an accessible name. (If the image is purely decorative, also set `alt=""` and drop the aria-label entirely.) |
| MT-024 | Drop the `accessKey="t"` attribute from both anchors (or at minimum give each accesskey a unique value). |

### Batch 4 — accessible fix (for reference)

| ID     | Minimal fix                                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------ |
| MT-025 | Add a `<label htmlFor="account-picker">Pick the right account for you</label>` and give the `<select>` matching `id="account-picker"`. (Or, if a visible label is undesirable, add `aria-label="Pick the right account for you"` on the `<select>` itself.) |
| MT-026 | Add `<title>Recent savings growth</title>` as the first child of the `<svg>`, OR move the icon to `aria-hidden="true"` and drop `role="img"` if it's purely decorative alongside the visible "Smart Savings 4.25% APY" text. |
| MT-027 | Either add `role="option"` to each child `<div>` (and `tabindex="-1"` plus keyboard handling for a real listbox), OR drop `role="listbox"` and let the list be a plain `<ul>` / `<li>` group. The simplest fix in this demo is to remove `role="listbox"`. |
| MT-028 | Replace the white text with a colour that meets 4.5:1 against the lightest stop of the gradient (e.g. `color: var(--brand-deep)` over the pale-gold side), or change the gradient to a single solid background that yields ≥ 4.5:1 with the existing text colour. |
| MT-029 | Give the image a meaningful `alt` (e.g. `alt="DQBC Downtown branch building"`), OR — if it really is decorative beside the other branch copy — drop it from the markup. (`role="presentation"` / `aria-hidden="true"` is acceptable only when the image conveys nothing the surrounding text doesn't.) |
| MT-030 | Set `aria-expanded="true"` or `aria-expanded="false"` (boolean) — `"yes"` is not a valid value for that attribute. |
| MT-031 | Add `role="tree"` (and `aria-label="Recent activity highlights"`) to the `<ul>`, OR drop `role="treeitem"` from the `<li>`s and let the list be a plain unordered list. |
| MT-032 | Change `lang="frx"` to a valid BCP 47 value — e.g. `lang="fr"` for French. (Or drop the `lang` attribute entirely if the surrounding text is already in English.) |
| MT-033 | Replace the `<div role="button">` with a native `<button type="button">` and drop `aria-required` (it isn't meaningful on a button). If the styled-div pattern must stay, simply remove `aria-required="true"`. |
| MT-034 | Wrap each row in `<div><dt>Routing number</dt><dd>071000013</dd></div>` etc., OR drop the `<dl>` and use a plain `<ul>` / `<li>` (or a small `<table>`) instead. |
| MT-035 | Replace the styled `<div>Spending snapshot</div>` with `<h2 style={…}>Spending snapshot</h2>` (or `<h3>` if `<h2>` is already taken at this level — the existing "Spending this month" `<h2>` would then need to be re-evaluated). |
| MT-036 | Fix the `<th id="trend-column">` ↔ `<td headers="trend-col">` mismatch — either rename the `<th>` id to `"trend-col"` or change every `<td>`'s `headers` to `"trend-column"`. If the column doesn't carry header semantics at all, drop the `headers` attributes from the body cells. |

## Suggested Phase-2 starter set

Below is a recommended seed list to draw from when populating the catalog. None of these are implemented yet — they're a menu for the SE team to pick from based on what each demo conversation needs.

### Page: Home (`Home.jsx`)
- Drop `alt=""` from the hero `<img>` and remove `role="presentation"` → `image-alt` (Critical, WCAG 1.1.1).
- Add a second `<h1>` ("By the numbers") → `page-has-heading-one` (Moderate, BP).
- Add an empty `<a href="#"></a>` to the public nav → `link-name` (Serious, WCAG 2.4.4).
- Lower contrast on `.fintech-pill` color → `color-contrast` (Serious, WCAG 1.4.3).
- Remove the carousel pause control → IGT for WCAG 2.2.2.
- Make the icon-only header search button anonymous → `button-name` (Critical, WCAG 4.1.2).

### Page: Login (`Login.jsx`)
- Drop the `<label>` on email/password and rely on `placeholder` → `label` (Critical, WCAG 3.3.2).
- Remove `role="tablist"` / `aria-selected` from the personal/business/wealth tabs → IGT for keyboard pattern.
- Strip `aria-describedby` link from the inline error → `aria-describedby` not associated.
- Remove modal focus trap on a forgot-password dialog (when added) → IGT.

### Page: Dashboard (`Dashboard.jsx`)
- Strip `<th scope>` from the transactions table → `th-has-data-cells` / scope attribute (Serious, WCAG 1.3.1).
- Make spending-breakdown bar lose its `role="img"` + label → `color` only meaning (IGT).
- Replace the filter chips with `<div onClick>` lookalikes → `aria-allowed-role` / IGT keyboard.

### Page: Transfer (`Transfer.jsx`)
- Replace native `<select>` for "To account" with a `<div>` custom dropdown → `aria-allowed-attr`, IGT keyboard.
- Remove `aria-describedby` from the amount field → error not associated (Serious).
- Add `aria-labeledby` (typo) on the memo textarea → `aria-valid-attr` (Critical, WCAG 4.1.2).
- Add `tabIndex={5}` to a stat → `tabindex` (Serious, BP).

### Page: Bills (`Bills.jsx`)
- Remove dialog focus trap → IGT.
- Drop `<fieldset>`/`<legend>` from notification grouping (when added) → `fieldset-legend`.
- Ungroup the "saved payees" list (drop `<ul>`/`<li>`) → `list` (Serious, WCAG 1.3.1).

### Page: Cards (`Cards.jsx`)
- Lock toggle as a `<div role="switch">` with no `aria-checked` → `aria-required-attr` (Critical) + `aria-toggle-field-name` (Serious).
- Card visual gradient w/ low-contrast EXP text → `color-contrast`.

### Page: Profile (`Profile.jsx`)
- Drop `autoComplete` on PII fields → `autocomplete-valid` (Serious, WCAG 1.3.5).
- Strip `<fieldset>`/`<legend>` from the notifications block → `fieldset-legend`.
- Use `<span lang="zz">` somewhere → `valid-lang` (Serious, WCAG 3.1.2).

### Page: Statements (`Statements.jsx`)
- Drop `<caption>` / `<th scope>` from the statements table.
- Remove descriptive download text ("Download" only) → `link-purpose-in-context`.

### Page: Deposit (`Deposit.jsx`)
- Drop `<fieldset>`/`<legend>` from the check-images group.
- Remove the `aria-live` region from the success step.

### Cross-cutting (auth shell)
- Remove the skip link.
- Replace `<main>` with `<div>`.
- Add a tiny touch-target icon to the topbar (≤ 18×18 px) → `target-size` (Pro Advanced).
- Add an `accesskey` somewhere on the sidebar → `accesskeys` (Serious, BP).

## Demo-time toggle recommendations

For the most balanced spread across the four severity buckets:

- **Best Practices: ON** during customer demos. This is where the `heading-order`, `accesskeys`, `image-redundant-alt`, `page-has-heading-one`, `region`, `landmark-one-main`, and `presentation-role-conflict` findings appear.
- **Experimental: ON** if you want `target-size` (WCAG 2.5.8) to fire automatically on the small touch targets we add.
- **Needs Review: ON** to surface placeholder-as-label and similar deferred checks.
