# Northbrook Connect — Accessibility Issues Catalog (Phase 2)

This file is the **single source of truth** for every accessibility issue we deliberately introduce into the Northbrook Connect SLED demo site. Phase 1 produced a clean, accessible-by-default citizen portal (all 14 pages pass axe-core 4.10 on default WCAG toggles). Phase 2 reintroduces issues — surgically, one at a time — and documents each one here.

## Why this matters for SLED prospects

State, local, and education buyers operate under **ADA Title II** (the 2024 final rule mandates WCAG 2.1 AA for state/local government digital content by April 2026 / 2027 depending on agency size), **Section 508** (federal procurement), and state-level statutes (CA AB-434, TX 206, etc.). K-12 districts additionally answer to **Section 504** and **IDEA** requirements around accessible educational content. The issues catalogued below are weighted toward the patterns that show up most often in real SLED accessibility audits.

## ID conventions

| Prefix | Meaning |
| --- | --- |
| `NB-XXX` | Deliberate Phase 2 issue introduced for the demo. |
| `NB-IGT-XXX` | Pattern targeted by an axe DevTools® Pro Intelligent Guided Test. |
| `NB-PL-XXX` | Pre-existing / Phase 1 leftover we choose to document rather than fix. |

This is intentionally distinct from DQBC's `MT-`/`IGT-`/`PL-` prefixes so cross-catalog citations don't collide.

## How to add an issue

1. Reserve the next ID below (`NB-001`, `NB-002`, …).
2. Implement the issue in the relevant component file under `src/sites/edu-gov/`.
3. Tag the offending code with an inline comment:
   ```jsx
   {/* PHASE-2 a11y issue NB-007 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md */}
   ```
4. Fill in the catalog row.
5. Re-scan in axe DevTools to confirm the rule fires where expected.

## Severity vocabulary

axe-core's four-level impact taxonomy plus a separate column for the rule pack (axe-core baseline / Best Practice / Pro Advanced / IGT manual).

| Severity   | Notes                                                              |
| ---------- | ------------------------------------------------------------------ |
| Critical   | Blocks access entirely; high-confidence automated detection.        |
| Serious    | Significant barrier; reliably automated.                            |
| Moderate   | Lower-impact WCAG conformance failure; some require Best Practices. |
| Minor      | Code smell / pattern issue; almost always Best Practice tagged.     |

## Coverage targets (Phase 2 goal)

A "complete" Northbrook Phase 2 should cover, across the 14 pages:

- **axe-core baseline** (WCAG 2.2 AA, BP off): 12+ distinct rules
- **Best Practices on**: 6+ additional rules (region, heading-order, accesskeys, presentation-role-conflict, landmark-*, list, image-redundant-alt, etc.)
- **Pro Advanced**: 3+ rules (advanced/text-contrast, advanced/heading-markup, advanced/image-decorative/informative-has-alt, advanced/css-focus-visible)
- **IGT / Guided Tests**: 5+ scenarios across the seven IGTs (Structure, Headings, Forms, Images, Modals, Reading Order, Keyboard)

**SLED-specific demo angles to over-index on:**
- PDF link patterns ("Click here" / "View PDF") — government love affair with PDFs
- Complex multi-step forms (DMV renewal, permit application, enrollment) with bad error association
- Data tables (grade portal, statements, permits list) with missing scope / headers / captions
- Language switcher patterns (when added) that don't update `html lang`
- Embedded videos (council meetings, training) without captions / transcript

## Catalog

| ID     | Page              | Component / line                                                                  | WCAG    | axe rule(s)                   | Severity | Tool     | Status   |
| ------ | ----------------- | --------------------------------------------------------------------------------- | ------- | ----------------------------- | -------- | -------- | -------- |
| NB-001 | Schools           | `Schools.jsx` district seal `<img src="/nbps-seal.svg">` (no `alt`)                | 1.1.1   | `image-alt`                   | Critical | axe-core | Live     |
| NB-002 | University        | `University.jsx` NSU stat-card label "Six-year graduation rate" (#b8a87a on bg-soft, ~2.3:1) | 1.4.3   | `color-contrast`              | Serious  | axe-core | Live     |
| NB-003 | Permits (City)    | `Permits.jsx` apply form — "Project address (line 1)" label replaced with styled `<span>` | 3.3.2   | `label`                       | Critical | axe-core | Live     |
| NB-004 | Schools           | `Schools.jsx` icon-only "student/parent handbook" PDF `<a>` (no text body, no aria-label) | 2.4.4   | `link-name`                   | Critical | axe-core | Live     |
| NB-005 | Grades            | `Grades.jsx` grade-portal `<table>` — `<th scope="column">` (invalid value; valid is `col`) | 1.3.1   | `scope-attr-valid`            | Serious  | axe-core (**Best Practices ON**) | Live |
| NB-006 | Register (Univ.)  | `Register.jsx` "Instructor quick filter" `<div role="searchbox" contentEditable>` with no aria-label | 4.1.2   | `aria-input-field-name`       | Moderate | axe-core | Live     |
| NB-007 | Benefits          | `Benefits.jsx` "Important program notices" scrollable disclosure panel (no focusable children, no tabIndex) | 2.1.1   | `scrollable-region-focusable` | Serious  | axe-core | Live     |
| NB-008 | City home         | `City.jsx` three "Read more" links on council-meeting items — identical accessible names, different destinations | 2.4.4   | `identical-links-same-purpose` | Minor   | axe-core (**Needs Review** — incomplete result; appears in the Needs Review section in axe DevTools) | Live |
| NB-009 | DMV               | `DMV.jsx` visual `<div role="progressbar">` step indicator — no accessible name AND missing required ARIA attrs | 1.1.1   | `aria-progressbar-name`       | Critical | axe-core | Live     |

> _Tool column values: `axe-core` / `axe Linter` / `Pro Advanced` / `IGT`._
> _Status values: `TODO` / `Live` / `Removed` / `Replaced`._

### Batch 1 — verification cheat sheet

| ID     | Steps to reach                                                              | Expected finding |
| ------ | --------------------------------------------------------------------------- | ---------------- |
| NB-001 | Open `/#/edu-gov/schools`, run a scan                                       | Critical: Images must have alternate text (`image-alt`) on `img[src="/nbps-seal.svg"]` above the school directory. |
| NB-002 | Open `/#/edu-gov/university`, scroll to "NSU at a glance", run a scan       | Serious: Elements must meet minimum color contrast (`color-contrast`) on the "Six-year graduation rate" label (sand-colour text on the bg-soft section background). |
| NB-003 | Sign in, open `/#/edu-gov/city/permits`, click any "Apply" button to expand the form, run a scan | Critical: Form elements must have labels (`label`) on the "Project address (line 1)" `<input>` — the visible-looking label is a `<span>` and is not programmatically associated. |

### Batch 1 — accessible fix (for reference)

| ID     | Minimal fix |
| ------ | ----------- |
| NB-001 | Add `alt="Northbrook Public Schools district seal"` to the `<img>`, OR mark it as decorative with `alt=""` + `role="presentation"` if the seal is only ornamental. |
| NB-002 | Drop the inline `style={{ color: '#b8a87a' }}` from the stat-card label so it falls back to the accessible default body colour. |
| NB-003 | Replace the styled `<span>` with a real `<label htmlFor={`${formId}-line1`}>Project address (line 1)</label>`. |

### Batch 2 — verification cheat sheet

| ID     | Steps to reach                                                                  | Expected finding |
| ------ | ------------------------------------------------------------------------------- | ---------------- |
| NB-004 | Open `/#/edu-gov/schools`, scroll to "Upcoming district events", run a scan     | Critical: Links must have discernible text (`link-name`) on the icon-only PDF anchor beside "Student & parent handbook (2026-2027)". |
| NB-005 | Sign in, open `/#/edu-gov/schools/grades`, **flip Best Practices: ON**, run a scan | Serious: ARIA scope attribute is invalid (`scope-attr-valid`) on all `<th scope="column">` elements of the grade table. (The valid value is `col`.) Note: `scope-attr-valid` is BP-tagged in axe-core 4.10, so it does not surface with Best Practices OFF. |
| NB-006 | Sign in, open `/#/edu-gov/university/register`, run a scan                       | Moderate: ARIA input fields must have an accessible name (`aria-input-field-name`) on the "Instructor quick filter" `<input role="searchbox">` below the Department selector. |

### Batch 2 — accessible fix (for reference)

| ID     | Minimal fix |
| ------ | ----------- |
| NB-004 | Add `aria-label="Download student & parent handbook PDF"` to the anchor, OR put visible text inside the anchor (e.g. `<a>Download PDF</a>`). |
| NB-005 | Restore `scope="col"` (and `scope="row"` on the per-row subject `<th>` if needed) — `"column"` is not a valid value. |
| NB-006 | Either give the custom-widget `<div role="searchbox">` an `aria-label="Instructor quick filter"`, or replace the `<div contentEditable>` with a real `<input>` paired with a `<label htmlFor>`. |

### Batch 3 — verification cheat sheet

| ID     | Steps to reach                                                                            | Expected finding |
| ------ | ----------------------------------------------------------------------------------------- | ---------------- |
| NB-007 | Sign in, open `/#/edu-gov/services/benefits`, complete the Step 1 quiz so a result panel renders, run a scan | Serious: Scrollable region must have keyboard access (`scrollable-region-focusable`) on the "Important program notices" container — keyboard users cannot scroll it because the panel has no focusable descendants and no `tabIndex`. |
| NB-008 | Open `/#/edu-gov/city`, scroll to "Upcoming council meetings", run a scan and check the **Needs Review** section | Needs Review: Links with the same accessible name must serve a similar purpose (`identical-links-same-purpose`) — three "Read more" anchors share an identical name but point to different destinations. axe-core can't decide programmatically if they serve the same purpose so the finding is surfaced for human inspection. |
| NB-009 | Sign in, open `/#/edu-gov/services/dmv`, run a scan on any step                            | Critical: Progressbar elements must have an accessible name (`aria-progressbar-name`) on the visual `<div role="progressbar">` step indicator. (axe-core 4.10 consolidates the missing-name + missing-required-aria-attrs check under this rule.) |

### Batch 3 — accessible fix (for reference)

| ID     | Minimal fix |
| ------ | ----------- |
| NB-007 | Add `tabIndex={0}` + `role="region"` to the scrollable container. The existing `aria-labelledby="program-notices-heading"` already names it. |
| NB-008 | Differentiate the link text: "Read budget hearing agenda", "Read rezoning packet", "Read public-comment notice" — or attach a unique `aria-label` per link. |
| NB-009 | Add `aria-valuenow={step + 1}` `aria-valuemin={1}` `aria-valuemax={STEPS.length}` `aria-label="Renewal step progress"` to the progressbar `<div>` — or simply remove `role="progressbar"` if the visible bar is purely decorative (the existing `<ol className="steps">` already conveys the same information accessibly). |

## Suggested Phase-2 starter set

Below is a recommended seed list to draw from when populating Northbrook Phase 2 batches. None are implemented yet — these are the SLED-resonant patterns worth landing first.

### Schools — K-12 (`Schools.jsx`, `Enroll.jsx`, `Grades.jsx`)
- Drop alt from the district seal / school photo on `Schools.jsx` → `image-alt` (Critical, WCAG 1.1.1).
- "Click here for the school handbook (PDF)" link with non-descriptive text → `link-name` (Critical) or BP `link-in-text-block`.
- Drop `<th scope>` on the grade-portal `<table>` → `scope-attr-valid` / `td-has-headers` (Serious, WCAG 1.3.1).
- Enrollment Step 1 error message rendered without `aria-describedby` association → IGT Forms (manual review).
- Empty heading on the school directory → `empty-heading` (Minor, BP).

### University (`University.jsx`, `Register.jsx`)
- Featured-program text in too-light green on the brand-accent panel → `color-contrast` (Serious, WCAG 1.4.3).
- "Add to cart" buttons with identical accessible name across courses → `identical-links-same-purpose` / IGT Keyboard.
- Course-conflict warning rendered visually red but with no programmatic announcement → IGT Forms.
- Custom `<div role="button">` "Filter by department" without keyboard handlers → IGT Keyboard.

### State Services (`Services.jsx`, `DMV.jsx`, `Benefits.jsx`)
- DMV renewal step-indicator that updates visually but not programmatically (no aria-current, no live region) → IGT Forms / Reading Order.
- Benefits eligibility result panel that fails contrast against the bg-soft → `color-contrast` (Serious, WCAG 1.4.3) or Pro `advanced/text-contrast`.
- Permits / public-records "View PDF" links with placeholder text "Click here" → `link-name` (Critical, WCAG 2.4.4).
- Multi-step DMV form with required indicators only shown via asterisk in the visible label (no `required` or `aria-required`) → IGT Forms.

### City (`City.jsx`, `Permits.jsx`, `Vote.jsx`)
- Permit-application "Address" field missing `<label>` → `label` (Critical, WCAG 3.3.2).
- Voter registration radio group without `<fieldset>`/`<legend>` → IGT Forms (manual review).
- Polling-place "Map placeholder" given role="img" but with a non-descriptive aria-label → IGT Images.
- Council-meetings list with redundant link text ("Read more" × 5) → `identical-links-same-purpose` (Minor, BP).

### Cross-cutting (`PublicLayout.jsx`, `AuthLayout.jsx`)
- Sign-in "Sign in" button with aria-label override that drops the visible label → `label-content-name-mismatch` (Serious, WCAG 2.5.3, Experimental).
- Sidebar nav icon-only buttons (when added) at 20×20 → `target-size` (Serious, WCAG 2.5.8).
- Skip-link removed or hidden → IGT Structure / Keyboard.

## Demo-time toggle recommendations

For the most balanced spread across the four severity buckets when scanning Northbrook in axe DevTools Pro:

- **Best Practices: ON** — surfaces `region`, `heading-order`, `accesskeys`, `image-redundant-alt`, `landmark-*`, `list`, `presentation-role-conflict`, `identical-links-same-purpose`, `empty-heading`, etc. Important for ADA Title II conversations because the rule pack maps closely to WCAG 2.1 AA.
- **Experimental: ON** — adds `label-content-name-mismatch` and similar.
- **Needs Review** counts: `identical-links-same-purpose` and contrast-on-gradient findings live here in axe DevTools.
- **Pro Advanced rule pack** (always on with Pro license) — adds the AI-driven rules.
