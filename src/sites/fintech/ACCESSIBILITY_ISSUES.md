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
