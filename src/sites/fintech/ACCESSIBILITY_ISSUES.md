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

> _Tool column values: `axe-core` / `axe Linter` / `Pro Advanced` / `IGT`._
> _Status values: `TODO` / `Live` / `Removed` / `Replaced`._

### Batch 1 — verification cheat sheet

How to confirm each rule fires using axe DevTools (browser extension), default toggles
(Best Practices OFF, Experimental OFF, Needs Review ON or OFF — these all fire automatically):

| ID     | Steps to reach                                          | Expected finding                                                                          |
| ------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| MT-001 | Open `/#/fintech` (Home) and run a scan                 | Critical: Images must have alternate text (`image-alt`) on `img[src="/fintech-hero.svg"]` |
| MT-002 | Sign in, open `/#/fintech/dashboard`, run a scan         | Serious: Elements must meet minimum color contrast (`color-contrast`) on the "Last sign-in: today, 9:42 AM · Chicago, IL" line |
| MT-003 | Sign in, open `/#/fintech/profile`, scroll past Notifications, run a scan | Moderate: Scrollable region must have keyboard access (`scrollable-region-focusable`) on the "Account disclosures" container |

### Batch 1 — accessible fix (for reference)

| ID     | Minimal fix                                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------ |
| MT-001 | Restore `alt=""` + `role="presentation"` on the decorative hero img, OR give it a meaningful `alt="…"` if it's content.  |
| MT-002 | Remove the inline `style={{ color: '#8a92a3' }}` so the `.subtitle` class falls back to `var(--text-secondary)`.          |
| MT-003 | Add `tabIndex={0}` + `role="region"` to the scrollable container; the existing `aria-labelledby` already names it.       |

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
