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
| NB-010 | Home              | `Home.jsx` Eyebrow pill uses a low-contrast grey (#a8a8a8 on white) ~2.5:1        | 1.4.3   | `color-contrast`              | Serious  | axe-core | Live     |
| NB-011 | Home              | `Home.jsx` Decorative-looking hero badge <img> ships with NO alt attribute        | 1.1.1   | `image-alt`                   | Critical | axe-core | Live     |
| NB-012 | Home              | `Home.jsx` Icon-only header utility button (mobile menu toggle) has NO accessibl… | 4.1.2   | `button-name`                 | Critical | axe-core | Live     |
| NB-013 | Home              | `Home.jsx` "Find a service" quick-jump <select> has NO associated label or aria-… | 4.1.2   | `select-name`                 | Critical | axe-core | Live     |
| NB-014 | Home              | `Home.jsx` Inline mini-chart <svg role="img"> with NO <title> or aria-label       | 1.1.1   | `svg-img-alt`                 | Serious  | axe-core | Live     |
| NB-015 | Home              | `Home.jsx` "Popular services" <div role="listbox"> with <div> children that lack… | 1.3.1   | `aria-required-children`      | Critical | axe-core | Live     |
| NB-016 | Home              | `Home.jsx` Disclosure button uses aria-expanded="yes" instead of "true"           | 4.1.2   | `aria-valid-attr-value`       | Critical | axe-core | Live     |
| NB-017 | Home              | `Home.jsx` Page-progress indicator <div role="progressbar"> with NO aria-label /… | 1.1.1   | `aria-progressbar-name`       | Critical | axe-core | Live     |
| NB-018 | Home              | `Home.jsx` Empty <span role="tooltip"> placeholder                                | 4.1.2   | `aria-tooltip-name`           | Serious  | axe-core | Live     |
| NB-019 | Home              | `Home.jsx` Stray <dt> outside of any <dl>                                         | 1.3.1   | `dlitem`                      | Serious  | axe-core | Live     |
| NB-020 | Home              | `Home.jsx` `lang="xyz"` is not a valid BCP-47 tag                                 | 3.1.2   | `valid-lang`                  | Serious  | axe-core | Live     |
| NB-021 | Home              | `Home.jsx` Empty social/follow anchor (icon stripped) with NO text, NO aria-labe… | 2.4.4   | `link-name`                   | Critical | axe-core | Live     |
| NB-022 | Home              | `Home.jsx` Newsletter signup uses autoComplete="emailaddr" — not a valid WHATWG … | 1.3.5   | `autocomplete-valid`          | Serious  | axe-core | Live     |
| NB-023 | Login             | `Login.jsx` Inline brand logo <svg role="img"> with NO <title> / aria-label       | 1.1.1   | `svg-img-alt`                 | Serious  | axe-core | Live     |
| NB-024 | Login             | `Login.jsx` Decorative <div role="img"> seal has NO accessible name               | 1.1.1   | `role-img-alt`                | Serious  | axe-core | Live     |
| NB-025 | Login             | `Login.jsx` Stray <dt> outside any <dl>                                           | 1.3.1   | `dlitem`                      | Serious  | axe-core | Live     |
| NB-026 | Login             | `Login.jsx` `lang="frx"` is not a valid BCP-47 subtag                             | 3.1.2   | `valid-lang`                  | Serious  | axe-core | Live     |
| NB-027 | Login             | `Login.jsx` "Recent usernames" `<div role="combobox" aria-controls="recent-users-list">` — missing `aria-expanded`, missing accessible name, and `aria-controls` references a non-existent id. **Co-fires 3 rules.** | 4.1.2   | `aria-required-attr` + `aria-input-field-name` + `aria-valid-attr-value` | Critical | axe-core | Live     |
| NB-028 | Login             | `Login.jsx` `aria-labeledby` (one L) typo — should be `aria-labelledby`           | 4.1.2   | `aria-valid-attr`             | Critical | axe-core | Live     |
| NB-029 | Login             | `Login.jsx` Disclaimer text uses a near-grey on white (~2.4:1)                    | 1.4.3   | `color-contrast`              | Serious  | axe-core | Live     |
| NB-030 | Login             | `Login.jsx` Password-strength <div role="progressbar"> with NO aria-label / aria… | 1.1.1   | `aria-progressbar-name`       | Critical | axe-core | Live     |
| NB-031 | Login             | `Login.jsx` Empty <span role="tooltip"> placeholder                               | 4.1.2   | `aria-tooltip-name`           | Serious  | axe-core | Live     |
| NB-032 | Login             | `Login.jsx` Extra "Security question" <input> uses a styled <span> instead of a … | 3.3.2   | `label`                       | Critical | axe-core | Live     |
| NB-033 | Login             | `Login.jsx` role="button" combined with `aria-required="true"`, an attribute not… | 4.1.2   | `aria-allowed-attr`           | Critical | axe-core | Live     |
| NB-034 | Login             | `Login.jsx` `<input type="button">` with NO `value` attribute has no accessible … | 4.1.2   | `input-button-name`           | Critical | axe-core | Live     |
| NB-035 | Login             | `Login.jsx` Empty supplemental terms <a> (icon-only PDF link stripped)            | 2.4.4   | `link-name`                   | Critical | axe-core | Live     |
| NB-036 | Account           | `Account.jsx` Icon-only "Settings" cog button has NO text / aria-label            | 4.1.2   | `button-name`                 | Critical | axe-core | Live     |
| NB-037 | Account           | `Account.jsx` "Profile completeness" <div role="meter"> with NO aria-label        | 1.1.1   | `aria-meter-name`             | Critical | axe-core | Live     |
| NB-038 | Account           | `Account.jsx` "Jump to section" <select> has NO label or aria-label               | 4.1.2   | `select-name`                 | Critical | axe-core | Live     |
| NB-039 | Account           | `Account.jsx` "Show announcements" <button role="switch"> has no inner text and … | 4.1.2   | `aria-toggle-field-name`      | Serious  | axe-core | Live     |
| NB-040 | Account           | `Account.jsx` Stat label uses a light grey #b0b0b0 on white (~2.6:1)              | 1.4.3   | `color-contrast`              | Serious  | axe-core | Live     |
| NB-041 | Account           | `Account.jsx` Tablist <div role="tablist"> contains <div> children that lack rol… | 1.3.1   | `aria-required-children`      | Critical | axe-core | Live     |
| NB-042 | Account           | `Account.jsx` Empty quick-link <a> (icon-only) with NO accessible name            | 2.4.4   | `link-name`                   | Critical | axe-core | Live     |
| NB-043 | Account           | `Account.jsx` Inline activity icon <svg role="img"> with NO <title> / aria-label  | 1.1.1   | `svg-img-alt`                 | Serious  | axe-core | Live     |
| NB-044 | Account           | `Account.jsx` `lang="qz"` is not a valid BCP-47 subtag                            | 3.1.2   | `valid-lang`                  | Serious  | axe-core | Live     |
| NB-045 | Account           | `Account.jsx` Empty <span role="tooltip">                                         | 4.1.2   | `aria-tooltip-name`           | Serious  | axe-core | Live     |
| NB-046 | Account           | `Account.jsx` Stray <dd> outside any <dl>                                         | 1.3.1   | `dlitem`                      | Serious  | axe-core | Live     |
| NB-047 | Account           | `Account.jsx` Custom search field uses <div role="searchbox" contentEditable> wi… | 4.1.2   | `aria-input-field-name`       | Moderate | axe-core | Live     |
| NB-048 | Account           | `Account.jsx` `aria-discribedby` (mis-spelled) — should be `aria-describedby`     | 4.1.2   | `aria-valid-attr`             | Critical | axe-core | Live     |
| NB-049 | Schools           | `Schools.jsx` Icon-only "filter" button has NO accessible name                    | 4.1.2   | `button-name`                 | Critical | axe-core | Live     |
| NB-050 | Schools           | `Schools.jsx` Inline informational chart <svg role="img"> with NO <title>         | 1.1.1   | `svg-img-alt`                 | Serious  | axe-core | Live     |
| NB-051 | Schools           | `Schools.jsx` Meta line "x children enrolled" rendered in light grey (#b5b5b5 on… | 1.4.3   | `color-contrast`              | Serious  | axe-core | Live     |
| NB-052 | Schools           | `Schools.jsx` "Districts" <div role="listbox"> with plain <div> children (no rol… | 1.3.1   | `aria-required-children`      | Critical | axe-core | Live     |
| NB-053 | Schools           | `Schools.jsx` "Grade level" <select> has NO label or aria-label                   | 4.1.2   | `select-name`                 | Critical | axe-core | Live     |
| NB-054 | Schools           | `Schools.jsx` `lang="zz"` is not a valid BCP-47 subtag                            | 3.1.2   | `valid-lang`                  | Serious  | axe-core | Live     |
| NB-055 | Schools           | `Schools.jsx` Stray <dt> outside of any <dl>                                      | 1.3.1   | `dlitem`                      | Serious  | axe-core | Live     |
| NB-056 | Schools           | `Schools.jsx` Enrollment <div role="meter"> with NO aria-label                    | 1.1.1   | `aria-meter-name`             | Critical | axe-core | Live     |
| NB-057 | Schools           | `Schools.jsx` Empty <span role="tooltip"> placeholder                             | 4.1.2   | `aria-tooltip-name`           | Serious  | axe-core | Live     |
| NB-058 | Schools           | `Schools.jsx` `aria-orientation="diagonal"` is not a permitted value              | 4.1.2   | `aria-valid-attr-value`       | Critical | axe-core | Live     |
| NB-059 | Schools           | `Schools.jsx` <object data="..."> embed with NO fallback / aria-label / inner co… | 1.1.1   | `object-alt`                  | Serious  | axe-core | Live     |
| NB-060 | Enroll            | `Enroll.jsx` Decorative-but-meaningful district crest <svg role="img"> with NO <… | 1.1.1   | `svg-img-alt`                 | Serious  | axe-core | Live     |
| NB-061 | Enroll            | `Enroll.jsx` Step progress <div role="progressbar"> with NO aria-label / aria-la… | 1.1.1   | `aria-progressbar-name`       | Critical | axe-core | Live     |
| NB-062 | Enroll            | `Enroll.jsx` Helper text uses #bababa on white (~2.4:1)                           | 1.4.3   | `color-contrast`              | Serious  | axe-core | Live     |
| NB-063 | Enroll            | `Enroll.jsx` `lang="enus"` is not a valid BCP-47 tag (should be "en-US")          | 3.1.2   | `valid-lang`                  | Serious  | axe-core | Live     |
| NB-064 | Enroll            | `Enroll.jsx` Stray <dt> outside any <dl>                                          | 1.3.1   | `dlitem`                      | Serious  | axe-core | Live     |
| NB-065 | Enroll            | `Enroll.jsx` Focusable <button> wrapped inside <span aria-hidden="true">, creati… | 4.1.2   | `aria-hidden-focus`           | Serious  | axe-core | Live     |
| NB-066 | Enroll            | `Enroll.jsx` "Middle name" field uses a styled <span> instead of a real <label>   | 3.3.2   | `label`                       | Critical | axe-core | Live     |
| NB-067 | Enroll            | `Enroll.jsx` Age field uses `autoComplete="age"` — not a valid WHATWG token       | 1.3.5   | `autocomplete-valid`          | Serious  | axe-core | Live     |
| NB-068 | Enroll            | `Enroll.jsx` Extra "Preferred language" <select> has NO label or aria-label       | 4.1.2   | `select-name`                 | Critical | axe-core | Live     |
| NB-069 | Enroll            | `Enroll.jsx` Custom <div role="combobox"> missing required `aria-expanded`        | 4.1.2   | `aria-required-attr`          | Critical | axe-core | Live     |
| NB-070 | Enroll            | `Enroll.jsx` `aria-labeledby` (one L) typo on the field group note                | 4.1.2   | `aria-valid-attr`             | Critical | axe-core | Live     |
| NB-071 | Enroll            | `Enroll.jsx` role="presentation" combined with `aria-required="true"`, an attrib… | 4.1.2   | `aria-allowed-attr`           | Critical | axe-core | Live     |
| NB-072 | Enroll            | `Enroll.jsx` Icon-only "info" button has NO accessible name                       | 4.1.2   | `button-name`                 | Critical | axe-core | Live     |
| NB-073 | Grades            | `Grades.jsx` Student headshot <img> with NO alt attribute                         | 1.1.1   | `image-alt`                   | Critical | axe-core | Live     |
| NB-074 | Grades            | `Grades.jsx` Empty parent-portal anchor (icon-only print link with NO text, NO a… | 2.4.4   | `link-name`                   | Critical | axe-core | Live     |
| NB-075 | Grades            | `Grades.jsx` Icon-only "download report card" button with NO accessible name      | 4.1.2   | `button-name`                 | Critical | axe-core | Live     |
| NB-076 | Grades            | `Grades.jsx` Semester label rendered in pale taupe (#cdbf9f on #fff ~2.0:1)       | 1.4.3   | `color-contrast`              | Serious  | axe-core | Live     |
| NB-077 | Grades            | `Grades.jsx` GPA trend <svg role="img"> with NO <title>                           | 1.1.1   | `svg-img-alt`                 | Serious  | axe-core | Live     |
| NB-078 | Grades            | `Grades.jsx` `lang="latn"` is not a valid BCP-47 primary subtag                   | 3.1.2   | `valid-lang`                  | Serious  | axe-core | Live     |
| NB-079 | Grades            | `Grades.jsx` GPA <div role="meter"> with NO accessible name                       | 1.1.1   | `aria-meter-name`             | Critical | axe-core | Live     |
| NB-080 | Grades            | `Grades.jsx` Empty <span role="tooltip"> placeholder                              | 4.1.2   | `aria-tooltip-name`           | Serious  | axe-core | Live     |
| NB-081 | Grades            | `Grades.jsx` `aria-labeledby` is a typo of `aria-labelledby`                      | 4.1.2   | `aria-valid-attr`             | Critical | axe-core | Live     |
| NB-082 | Grades            | `Grades.jsx` Stray <dt> outside any <dl>                                          | 1.3.1   | `dlitem`                      | Serious  | axe-core | Live     |
| NB-083 | Grades            | `Grades.jsx` <button> with `aria-rowindex` (only valid on row/cell roles)         | 4.1.2   | `aria-prohibited-attr`        | Serious  | axe-core | Live     |
| NB-084 | Grades            | `Grades.jsx` Empty <div role="tablist"> with NO role="tab" children               | 1.3.1   | `aria-required-children`      | Critical | axe-core | Live     |
| NB-085 | Grades            | `Grades.jsx` <td headers="missing-id"> references a non-existent id               | 1.3.1   | `td-headers-attr`             | Serious  | axe-core | Live     |
| NB-086 | University        | `University.jsx` Campus photo <img> with NO alt attribute                         | 1.1.1   | `image-alt`                   | Critical | axe-core | Live     |
| NB-087 | University        | `University.jsx` Program filter <select> with NO label or aria-label              | 4.1.2   | `select-name`                 | Critical | axe-core | Live     |
| NB-088 | University        | `University.jsx` Icon-only "share" button with NO accessible name                 | 4.1.2   | `button-name`                 | Critical | axe-core | Live     |
| NB-089 | University        | `University.jsx` Empty anchor with NO text or aria-label                          | 2.4.4   | `link-name`                   | Critical | axe-core | Live     |
| NB-090 | University        | `University.jsx` "US News rank" <svg role="img"> with NO <title>                  | 1.1.1   | `svg-img-alt`                 | Serious  | axe-core | Live     |
| NB-091 | University        | `University.jsx` <div role="listbox"> with plain <div> children (no role="option… | 1.3.1   | `aria-required-children`      | Critical | axe-core | Live     |
| NB-092 | University        | `University.jsx` Graduation-rate <div role="meter"> with NO accessible name       | 1.1.1   | `aria-meter-name`             | Critical | axe-core | Live     |
| NB-093 | University        | `University.jsx` Empty <span role="tooltip">                                      | 4.1.2   | `aria-tooltip-name`           | Serious  | axe-core | Live     |
| NB-094 | University        | `University.jsx` `lang="xx"` is not a valid BCP-47 subtag                         | 3.1.2   | `valid-lang`                  | Serious  | axe-core | Live     |
| NB-095 | University        | `University.jsx` Stray <dt> outside any <dl>                                      | 1.3.1   | `dlitem`                      | Serious  | axe-core | Live     |
| NB-096 | University        | `University.jsx` Focusable <button> inside aria-hidden="true" subtree             | 4.1.2   | `aria-hidden-focus`           | Serious  | axe-core | Live     |
| NB-097 | University        | `University.jsx` <span> with `aria-colindex` (only valid on row/cell roles)       | 4.1.2   | `aria-prohibited-attr`        | Serious  | axe-core | Live     |
| NB-098 | Register (Univ.)  | `Register.jsx` Subtitle rendered in low-contrast brand sand (#cdbf9f on #fff ~2.… | 1.4.3   | `color-contrast`              | Serious  | axe-core | Live     |
| NB-099 | Register (Univ.)  | `Register.jsx` Icon-only "help" button with NO accessible name                    | 4.1.2   | `button-name`                 | Critical | axe-core | Live     |
| NB-100 | Register (Univ.)  | `Register.jsx` "Registration progress" <svg role="img"> with NO <title>           | 1.1.1   | `svg-img-alt`                 | Serious  | axe-core | Live     |
| NB-101 | Register (Univ.)  | `Register.jsx` `lang="zz"` is not a valid BCP-47 subtag                           | 3.1.2   | `valid-lang`                  | Serious  | axe-core | Live     |
| NB-102 | Register (Univ.)  | `Register.jsx` Cart <div role="progressbar"> with NO accessible name              | 1.1.1   | `aria-progressbar-name`       | Serious  | axe-core | Live     |
| NB-103 | Register (Univ.)  | `Register.jsx` `aria-labeledby` typo of `aria-labelledby`                         | 4.1.2   | `aria-valid-attr`             | Critical | axe-core | Live     |
| NB-104 | Register (Univ.)  | `Register.jsx` `role="presentation"` with `aria-required="true"`                  | 4.1.2   | `aria-allowed-attr`           | Serious  | axe-core | Live     |
| NB-105 | Register (Univ.)  | `Register.jsx` <h2> with `aria-rowindex` (only valid on row/cell roles)           | 4.1.2   | `aria-prohibited-attr`        | Serious  | axe-core | Live     |
| NB-106 | Register (Univ.)  | `Register.jsx` "Intended major" input with NO associated <label>                  | 1.3.1   | `label`                       | Critical | axe-core | Live     |
| NB-107 | Register (Univ.)  | `Register.jsx` `autocomplete="major"` is not a valid HTML autofill token          | 1.3.5   | `autocomplete-valid`          | Serious  | axe-core | Live     |
| NB-108 | Register (Univ.)  | `Register.jsx` Extra "Term" <select> with NO label or aria-label                  | 4.1.2   | `select-name`                 | Critical | axe-core | Live     |
| NB-109 | Register (Univ.)  | `Register.jsx` <div role="combobox"> missing required `aria-expanded`             | 4.1.2   | `aria-required-attr`          | Critical | axe-core | Live     |
| NB-110 | Services          | `Services.jsx` Service-hub hero icon <img> with NO alt attribute                  | 1.1.1   | `image-alt`                   | Critical | axe-core | Live     |
| NB-111 | Services          | `Services.jsx` Agency filter <select> with NO label or aria-label                 | 4.1.2   | `select-name`                 | Critical | axe-core | Live     |
| NB-112 | Services          | `Services.jsx` "Click here" link with non-descriptive accessible name — wait, li… | 2.4.4   | `link-name`                   | Critical | axe-core | Live     |
| NB-113 | Services          | `Services.jsx` Icon-only "favorite" button with NO accessible name                | 4.1.2   | `button-name`                 | Critical | axe-core | Live     |
| NB-114 | Services          | `Services.jsx` "Service activity" <svg role="img"> with NO <title>                | 1.1.1   | `svg-img-alt`                 | Serious  | axe-core | Live     |
| NB-115 | Services          | `Services.jsx` <div role="listbox"> with plain <div> children (no role="option")  | 1.3.1   | `aria-required-children`      | Critical | axe-core | Live     |
| NB-116 | Services          | `Services.jsx` Empty <span role="tooltip">                                        | 4.1.2   | `aria-tooltip-name`           | Serious  | axe-core | Live     |
| NB-117 | Services          | `Services.jsx` `lang="qq"` is not a valid BCP-47 subtag                           | 3.1.2   | `valid-lang`                  | Serious  | axe-core | Live     |
| NB-118 | Services          | `Services.jsx` Stray <dt> outside any <dl>                                        | 1.3.1   | `dlitem`                      | Serious  | axe-core | Live     |
| NB-119 | Services          | `Services.jsx` "Avg wait" rendered in pale taupe (#cdbf9f on #fff ~2.0:1)         | 1.4.3   | `color-contrast`              | Serious  | axe-core | Live     |
| NB-120 | Services          | `Services.jsx` Wait-time <div role="meter"> with NO accessible name               | 1.1.1   | `aria-meter-name`             | Critical | axe-core | Live     |
| NB-121 | Services          | `Services.jsx` `aria-orientation="diagonal"` is not a permitted value             | 4.1.2   | `aria-valid-attr-value`       | Critical | axe-core | Live     |
| NB-122 | Services          | `Services.jsx` `autocomplete="agency"` is not a valid HTML autofill token         | 1.3.5   | `autocomplete-valid`          | Serious  | axe-core | Live     |
| NB-123 | DMV               | `DMV.jsx` Subtitle rendered in pale brand sand (#cdbf9f on #fff ~2.0:1)           | 1.4.3   | `color-contrast`              | Serious  | axe-core | Live     |
| NB-124 | DMV               | `DMV.jsx` Icon-only "help" button with NO accessible name                         | 4.1.2   | `button-name`                 | Critical | axe-core | Live     |
| NB-125 | DMV               | `DMV.jsx` Renewal-shield <svg role="img"> with NO <title>                         | 1.1.1   | `svg-img-alt`                 | Serious  | axe-core | Live     |
| NB-126 | DMV               | `DMV.jsx` `lang="zz"` is not a valid BCP-47 subtag                                | 3.1.2   | `valid-lang`                  | Serious  | axe-core | Live     |
| NB-127 | DMV               | `DMV.jsx` `aria-labeledby` typo of `aria-labelledby`                              | 4.1.2   | `aria-valid-attr`             | Critical | axe-core | Live     |
| NB-128 | DMV               | `DMV.jsx` `role="presentation"` with `aria-required="true"`                       | 4.1.2   | `aria-allowed-attr`           | Serious  | axe-core | Live     |
| NB-129 | DMV               | `DMV.jsx` Empty <span role="tooltip">                                             | 4.1.2   | `aria-tooltip-name`           | Serious  | axe-core | Live     |
| NB-130 | DMV               | `DMV.jsx` Stray <dt> outside any <dl>                                             | 1.3.1   | `dlitem`                      | Serious  | axe-core | Live     |
| NB-131 | DMV               | `DMV.jsx` "VIN lookup" input with NO associated <label>                           | 1.3.1   | `label`                       | Critical | axe-core | Live     |
| NB-132 | DMV               | `DMV.jsx` `autocomplete="vehicle-vin"` is not a valid HTML autofill token         | 1.3.5   | `autocomplete-valid`          | Serious  | axe-core | Live     |
| NB-133 | DMV               | `DMV.jsx` Extra "Plate state" <select> with NO label or aria-label                | 4.1.2   | `select-name`                 | Critical | axe-core | Live     |
| NB-134 | DMV               | `DMV.jsx` <div role="combobox"> missing required `aria-expanded`                  | 4.1.2   | `aria-required-attr`          | Critical | axe-core | Live     |
| NB-135 | Benefits          | `Benefits.jsx` Was: <label htmlFor="ben-household">Household size</label> Replac… | 3.3.2   | `label`                       | Critical | axe-core | Live     |
| NB-136 | Benefits          | `Benefits.jsx` `autoComplete="benefit"` is not a valid WHATWG token               | 1.3.5   | `autocomplete-valid`          | Serious  | axe-core | Live     |
| NB-137 | Benefits          | `Benefits.jsx` <select> with no label / aria-label                                | 4.1.2   | `select-name`                 | Critical | axe-core | Live     |
| NB-138 | Benefits          | `Benefits.jsx` role="combobox" missing required aria-expanded attribute           | 4.1.2   | `aria-required-attr`          | Critical | axe-core | Live     |
| NB-139 | Benefits          | `Benefits.jsx` aria-orientation="diagonal" is not a valid token (only horizontal… | 4.1.2   | `aria-valid-attr-value`       | Critical | axe-core | Live     |
| NB-140 | Benefits          | `Benefits.jsx` Icon-only "Print eligibility" button with NO accessible name       | 4.1.2   | `button-name`                 | Critical | axe-core | Live     |
| NB-141 | Benefits          | `Benefits.jsx` SNAP/Medicaid badge <svg role="img"> with NO <title>               | 1.1.1   | `svg-img-alt`                 | Serious  | axe-core | Live     |
| NB-142 | Benefits          | `Benefits.jsx` Pale taupe disclosure subhead (#cdbf9f on #fff ~2.0:1)             | 1.4.3   | `color-contrast`              | Serious  | axe-core | Live     |
| NB-143 | Benefits          | `Benefits.jsx` `lang="zz"` is not a valid BCP-47 primary subtag                   | 3.1.2   | `valid-lang`                  | Serious  | axe-core | Live     |
| NB-144 | Benefits          | `Benefits.jsx` Stray <dt> outside any <dl>                                        | 1.3.1   | `dlitem`                      | Serious  | axe-core | Live     |
| NB-145 | Benefits          | `Benefits.jsx` Eligibility-likelihood <div role="meter"> with NO accessible name  | 1.1.1   | `aria-meter-name`             | Critical | axe-core | Live     |
| NB-146 | Benefits          | `Benefits.jsx` <button> with aria-rowindex (only valid on row/cell roles)         | 4.1.2   | `aria-prohibited-attr`        | Serious  | axe-core | Live     |
| NB-147 | City home         | `City.jsx` Mayor headshot <img> with NO alt attribute                             | 1.1.1   | `image-alt`                   | Critical | axe-core | Live     |
| NB-148 | City home         | `City.jsx` "Find a service" <select> with no label / aria-label                   | 4.1.2   | `select-name`                 | Critical | axe-core | Live     |
| NB-149 | City home         | `City.jsx` Empty "Click here" anchor with NO accessible text                      | 2.4.4   | `link-name`                   | Critical | axe-core | Live     |
| NB-150 | City home         | `City.jsx` Icon-only social-share button with NO accessible name                  | 4.1.2   | `button-name`                 | Critical | axe-core | Live     |
| NB-151 | City home         | `City.jsx` City-emblem <svg role="img"> with NO <title>                           | 1.1.1   | `svg-img-alt`                 | Serious  | axe-core | Live     |
| NB-152 | City home         | `City.jsx` <div role="listbox"> with no role="option" children                    | 1.3.1   | `aria-required-children`      | Critical | axe-core | Live     |
| NB-153 | City home         | `City.jsx` `lang="qq"` is not a valid BCP-47 primary subtag                       | 3.1.2   | `valid-lang`                  | Serious  | axe-core | Live     |
| NB-154 | City home         | `City.jsx` Stray <dt> outside any <dl>                                            | 1.3.1   | `dlitem`                      | Serious  | axe-core | Live     |
| NB-155 | City home         | `City.jsx` Pale-taupe caption (#cdbf9f on #fff ~2.0:1)                            | 1.4.3   | `color-contrast`              | Serious  | axe-core | Live     |
| NB-156 | City home         | `City.jsx` Air-quality <div role="meter"> with NO accessible name                 | 1.1.1   | `aria-meter-name`             | Critical | axe-core | Live     |
| NB-157 | City home         | `City.jsx` autoComplete="address-zip" is not a valid WHATWG token                 | 1.3.5   | `autocomplete-valid`          | Serious  | axe-core | Live     |
| NB-158 | City home         | `City.jsx` <object> with NO accessible name (no aria-label / title / fallback)    | 1.1.1   | `object-alt`                  | Serious  | axe-core | Live     |
| NB-159 | City home         | `City.jsx` Empty <span role="tooltip"> placeholder                                | 4.1.2   | `aria-tooltip-name`           | Serious  | axe-core | Live     |
| NB-160 | Permits (City)    | `Permits.jsx` Unlabeled "Permit type" <select> with no label / aria-label         | 4.1.2   | `select-name`                 | Critical | axe-core | Live     |
| NB-161 | Permits (City)    | `Permits.jsx` Icon-only "Save draft" button with NO accessible name               | 4.1.2   | `button-name`                 | Critical | axe-core | Live     |
| NB-162 | Permits (City)    | `Permits.jsx` Empty anchor (icon-only export link, no text, no aria-label)        | 2.4.4   | `link-name`                   | Critical | axe-core | Live     |
| NB-163 | Permits (City)    | `Permits.jsx` Zoning sparkline <svg role="img"> with NO <title>                   | 1.1.1   | `svg-img-alt`                 | Serious  | axe-core | Live     |
| NB-164 | Permits (City)    | `Permits.jsx` `lang="latn"` is not a valid BCP-47 primary subtag                  | 3.1.2   | `valid-lang`                  | Serious  | axe-core | Live     |
| NB-165 | Permits (City)    | `Permits.jsx` Stray <dt> outside any <dl>                                         | 1.3.1   | `dlitem`                      | Serious  | axe-core | Live     |
| NB-166 | Permits (City)    | `Permits.jsx` Permit-volume <div role="meter"> with NO accessible name            | 1.1.1   | `aria-meter-name`             | Critical | axe-core | Live     |
| NB-167 | Permits (City)    | `Permits.jsx` role="combobox" missing required aria-expanded                      | 4.1.2   | `aria-required-attr`          | Critical | axe-core | Live     |
| NB-168 | Permits (City)    | `Permits.jsx` `aria-labeledby` is a typo of `aria-labelledby`                     | 4.1.2   | `aria-valid-attr`             | Critical | axe-core | Live     |
| NB-169 | Permits (City)    | `Permits.jsx` Pale-taupe required-marker (#cdbf9f on #fff ~2.0:1)                 | 1.4.3   | `color-contrast`              | Serious  | axe-core | Live     |
| NB-170 | Permits (City)    | `Permits.jsx` Review-stage <div role="progressbar"> with NO accessible name       | 1.1.1   | `aria-progressbar-name`       | Serious  | axe-core | Live     |
| NB-171 | Permits (City)    | `Permits.jsx` `autoComplete="cost"` is not a valid WHATWG token                   | 1.3.5   | `autocomplete-valid`          | Serious  | axe-core | Live     |
| NB-172 | Vote              | `Vote.jsx` Was: <label htmlFor="vote-first">First name</label>. Replaced with a … | 3.3.2   | `label`                       | Critical | axe-core | Live     |
| NB-173 | Vote              | `Vote.jsx` `autoComplete="voter"` is not a valid WHATWG token                     | 1.3.5   | `autocomplete-valid`          | Serious  | axe-core | Live     |
| NB-174 | Vote              | `Vote.jsx` Extra unlabeled "Party" <select> with no label / aria-label            | 4.1.2   | `select-name`                 | Critical | axe-core | Live     |
| NB-175 | Vote              | `Vote.jsx` <div role="searchbox" contentEditable> with NO accessible name         | 4.1.2   | `aria-input-field-name`       | Serious  | axe-core | Live     |
| NB-176 | Vote              | `Vote.jsx` Icon-only "Look up registration" button with NO accessible name        | 4.1.2   | `button-name`                 | Critical | axe-core | Live     |
| NB-177 | Vote              | `Vote.jsx` "I voted" badge <svg role="img"> with NO <title>                       | 1.1.1   | `svg-img-alt`                 | Serious  | axe-core | Live     |
| NB-178 | Vote              | `Vote.jsx` Pale-taupe disclaimer (#cdbf9f on #fff ~2.0:1)                         | 1.4.3   | `color-contrast`              | Serious  | axe-core | Live     |
| NB-179 | Vote              | `Vote.jsx` `lang="zz"` is not a valid BCP-47 primary subtag                       | 3.1.2   | `valid-lang`                  | Serious  | axe-core | Live     |
| NB-180 | Vote              | `Vote.jsx` Stray <dt> outside any <dl>                                            | 1.3.1   | `dlitem`                      | Serious  | axe-core | Live     |
| NB-181 | Vote              | `Vote.jsx` <div role="radiogroup"> with NO role="radio" children                  | 1.3.1   | `aria-required-children`      | Critical | axe-core | Live     |
| NB-182 | Vote              | `Vote.jsx` Empty "More info" anchor (no text, no aria-label)                      | 2.4.4   | `link-name`                   | Critical | axe-core | Live     |
| NB-183 | Vote              | `Vote.jsx` Turnout <div role="meter"> with NO accessible name                     | 1.1.1   | `aria-meter-name`             | Critical | axe-core | Live     |
| NB-184 | Vote              | `Vote.jsx` Empty <span role="tooltip"> placeholder                                | 4.1.2   | `aria-tooltip-name`           | Serious  | axe-core | Live     |
| NB-185 | Every page (`.btn-outline`) | `theme.css` — `.btn-outline:focus, :focus-visible { outline: none; box-shadow: none }` | 2.4.7 | `advanced/css-focus-visible`         | Serious  | **Pro Advanced** (no AI credits — CSS state diff) | Live |
| NB-186 | Home              | `Home.jsx` "What's new this month" `<div>` styled like an h2 (24 px / 700 / brand-deep)                            | 1.3.1 | `advanced/heading-markup`            | Serious  | **Pro Advanced** (uses AI credits — CV) | Live |
| NB-187 | Home              | `Home.jsx` `/ornament-divider.svg` decorative ornament with verbose alt                                            | 1.1.1 | `advanced/image-decorative`          | Minor    | **Pro Advanced** (uses AI credits — image classifier) | Live |
| NB-188 | Schools           | `Schools.jsx` `/cedarbrook-elementary.svg` informative school photo served `alt=""`                                | 1.1.1 | `advanced/image-informative-has-alt` | Minor    | **Pro Advanced** (uses AI credits — image classifier) | Live |
| NB-189 | Home              | `Home.jsx` SNAP/Medicaid/LIHEAP promo banner — white text on sand-to-white gradient (~2.5–3:1)                     | 1.4.3 | `advanced/text-contrast`             | Serious  | **Pro Advanced** | Live |
| NB-190 | Account           | `Account.jsx` "Quick actions" `<div>` styled as an h2 (22 px / 700 / brand-deep)                                   | 1.3.1 | `advanced/heading-markup`            | Serious  | **Pro Advanced** (uses AI credits — CV) | Live |
| NB-191 | DMV               | `DMV.jsx` "Save $5 with online renewal" banner — gold text on white-to-pale-gold gradient                          | 1.4.3 | `advanced/text-contrast`             | Serious  | **Pro Advanced** | Live |

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

### Batch 4 — verification cheat sheet

| ID     | Steps to reach | Expected finding |
| ------ | -------------- | ---------------- |
| NB-010 | Scan Home (Home.jsx) | Serious: `color-contrast` — Eyebrow pill uses a low-contrast grey (#a8a8a8 on white) ~2.5:1 |
| NB-011 | Scan Home (Home.jsx) | Critical: `image-alt` — Decorative-looking hero badge <img> ships with NO alt attribute |
| NB-012 | Scan Home (Home.jsx) | Critical: `button-name` — Icon-only header utility button (mobile menu toggle) has NO accessible name |
| NB-013 | Scan Home (Home.jsx) | Critical: `select-name` — "Find a service" quick-jump <select> has NO associated label or aria-label |
| NB-014 | Scan Home (Home.jsx) | Serious: `svg-img-alt` — Inline mini-chart <svg role="img"> with NO <title> or aria-label |
| NB-015 | Scan Home (Home.jsx) | Critical: `aria-required-children` — "Popular services" <div role="listbox"> with <div> children that lack role="option" |
| NB-016 | Scan Home (Home.jsx) | Critical: `aria-valid-attr-value` — Disclosure button uses aria-expanded="yes" instead of "true" |
| NB-017 | Scan Home (Home.jsx) | Critical: `aria-progressbar-name` — Page-progress indicator <div role="progressbar"> with NO aria-label / aria-labelledby |
| NB-018 | Scan Home (Home.jsx) | Serious: `aria-tooltip-name` — Empty <span role="tooltip"> placeholder |
| NB-019 | Scan Home (Home.jsx) | Serious: `dlitem` — Stray <dt> outside of any <dl> |
| NB-020 | Scan Home (Home.jsx) | Serious: `valid-lang` — `lang="xyz"` is not a valid BCP-47 tag |
| NB-021 | Scan Home (Home.jsx) | Critical: `link-name` — Empty social/follow anchor (icon stripped) with NO text, NO aria-label, NO title |
| NB-022 | Scan Home (Home.jsx) | Serious: `autocomplete-valid` — Newsletter signup uses autoComplete="emailaddr" — not a valid WHATWG token |
| NB-023 | Scan Login (Login.jsx) | Serious: `svg-img-alt` — Inline brand logo <svg role="img"> with NO <title> / aria-label |
| NB-024 | Scan Login (Login.jsx) | Serious: `role-img-alt` — Decorative <div role="img"> seal has NO accessible name |
| NB-025 | Scan Login (Login.jsx) | Serious: `dlitem` — Stray <dt> outside any <dl> |
| NB-026 | Scan Login (Login.jsx) | Serious: `valid-lang` — `lang="frx"` is not a valid BCP-47 subtag |
| NB-027 | Scan Login (Login.jsx) | Critical: `aria-required-attr` — "Recent usernames" custom combobox <div role="combobox"> is missing required `aria-expanded` |
| NB-028 | Scan Login (Login.jsx) | Critical: `aria-valid-attr` — `aria-labeledby` (one L) typo — should be `aria-labelledby` |
| NB-029 | Scan Login (Login.jsx) | Serious: `color-contrast` — Disclaimer text uses a near-grey on white (~2.4:1) |
| NB-030 | Scan Login (Login.jsx) | Critical: `aria-progressbar-name` — Password-strength <div role="progressbar"> with NO aria-label / aria-labelledby |
| NB-031 | Scan Login (Login.jsx) | Serious: `aria-tooltip-name` — Empty <span role="tooltip"> placeholder |
| NB-032 | Scan Login (Login.jsx) | Critical: `label` — Extra "Security question" <input> uses a styled <span> instead of a real <label> |
| NB-033 | Scan Login (Login.jsx) | Critical: `aria-allowed-attr` — role="button" combined with `aria-required="true"`, an attribute not allowed on that role |
| NB-034 | Scan Login (Login.jsx) | Critical: `input-button-name` — `<input type="button">` with NO `value` attribute has no accessible name |
| NB-035 | Scan Login (Login.jsx) | Critical: `link-name` — Empty supplemental terms <a> (icon-only PDF link stripped) |
| NB-036 | Scan Account (Account.jsx) | Critical: `button-name` — Icon-only "Settings" cog button has NO text / aria-label |
| NB-037 | Scan Account (Account.jsx) | Critical: `aria-meter-name` — "Profile completeness" <div role="meter"> with NO aria-label |
| NB-038 | Scan Account (Account.jsx) | Critical: `select-name` — "Jump to section" <select> has NO label or aria-label |
| NB-039 | Scan Account (Account.jsx) | Serious: `aria-toggle-field-name` — "Show announcements" <button role="switch"> has no inner text and no aria-label |
| NB-040 | Scan Account (Account.jsx) | Serious: `color-contrast` — Stat label uses a light grey #b0b0b0 on white (~2.6:1) |
| NB-041 | Scan Account (Account.jsx) | Critical: `aria-required-children` — Tablist <div role="tablist"> contains <div> children that lack role="tab" |
| NB-042 | Scan Account (Account.jsx) | Critical: `link-name` — Empty quick-link <a> (icon-only) with NO accessible name |
| NB-043 | Scan Account (Account.jsx) | Serious: `svg-img-alt` — Inline activity icon <svg role="img"> with NO <title> / aria-label |
| NB-044 | Scan Account (Account.jsx) | Serious: `valid-lang` — `lang="qz"` is not a valid BCP-47 subtag |
| NB-045 | Scan Account (Account.jsx) | Serious: `aria-tooltip-name` — Empty <span role="tooltip"> |
| NB-046 | Scan Account (Account.jsx) | Serious: `dlitem` — Stray <dd> outside any <dl> |
| NB-047 | Scan Account (Account.jsx) | Moderate: `aria-input-field-name` — Custom search field uses <div role="searchbox" contentEditable> with NO aria-label / aria-labelledby |
| NB-048 | Scan Account (Account.jsx) | Critical: `aria-valid-attr` — `aria-discribedby` (mis-spelled) — should be `aria-describedby` |
| NB-049 | Scan Schools (Schools.jsx) | Critical: `button-name` — Icon-only "filter" button has NO accessible name |
| NB-050 | Scan Schools (Schools.jsx) | Serious: `svg-img-alt` — Inline informational chart <svg role="img"> with NO <title> |
| NB-051 | Scan Schools (Schools.jsx) | Serious: `color-contrast` — Meta line "x children enrolled" rendered in light grey (#b5b5b5 on white ~2.4:1) |
| NB-052 | Scan Schools (Schools.jsx) | Critical: `aria-required-children` — "Districts" <div role="listbox"> with plain <div> children (no role="option") |
| NB-053 | Scan Schools (Schools.jsx) | Critical: `select-name` — "Grade level" <select> has NO label or aria-label |
| NB-054 | Scan Schools (Schools.jsx) | Serious: `valid-lang` — `lang="zz"` is not a valid BCP-47 subtag |
| NB-055 | Scan Schools (Schools.jsx) | Serious: `dlitem` — Stray <dt> outside of any <dl> |
| NB-056 | Scan Schools (Schools.jsx) | Critical: `aria-meter-name` — Enrollment <div role="meter"> with NO aria-label |
| NB-057 | Scan Schools (Schools.jsx) | Serious: `aria-tooltip-name` — Empty <span role="tooltip"> placeholder |
| NB-058 | Scan Schools (Schools.jsx) | Critical: `aria-valid-attr-value` — `aria-orientation="diagonal"` is not a permitted value |
| NB-059 | Scan Schools (Schools.jsx) | Serious: `object-alt` — <object data="..."> embed with NO fallback / aria-label / inner content |
| NB-060 | Scan Enroll (Enroll.jsx) | Serious: `svg-img-alt` — Decorative-but-meaningful district crest <svg role="img"> with NO <title>/aria-label |
| NB-061 | Scan Enroll (Enroll.jsx) | Critical: `aria-progressbar-name` — Step progress <div role="progressbar"> with NO aria-label / aria-labelledby |
| NB-062 | Scan Enroll (Enroll.jsx) | Serious: `color-contrast` — Helper text uses #bababa on white (~2.4:1) |
| NB-063 | Scan Enroll (Enroll.jsx) | Serious: `valid-lang` — `lang="enus"` is not a valid BCP-47 tag (should be "en-US") |
| NB-064 | Scan Enroll (Enroll.jsx) | Serious: `dlitem` — Stray <dt> outside any <dl> |
| NB-065 | Scan Enroll (Enroll.jsx) | Serious: `aria-hidden-focus` — Focusable <button> wrapped inside <span aria-hidden="true">, creating a focusable but AT-hidden control |
| NB-066 | Scan Enroll (Enroll.jsx) | Critical: `label` — "Middle name" field uses a styled <span> instead of a real <label> |
| NB-067 | Scan Enroll (Enroll.jsx) | Serious: `autocomplete-valid` — Age field uses `autoComplete="age"` — not a valid WHATWG token |
| NB-068 | Scan Enroll (Enroll.jsx) | Critical: `select-name` — Extra "Preferred language" <select> has NO label or aria-label |
| NB-069 | Scan Enroll (Enroll.jsx) | Critical: `aria-required-attr` — Custom <div role="combobox"> missing required `aria-expanded` |
| NB-070 | Scan Enroll (Enroll.jsx) | Critical: `aria-valid-attr` — `aria-labeledby` (one L) typo on the field group note |
| NB-071 | Scan Enroll (Enroll.jsx) | Critical: `aria-allowed-attr` — role="presentation" combined with `aria-required="true"`, an attribute disallowed by that role |
| NB-072 | Scan Enroll (Enroll.jsx) | Critical: `button-name` — Icon-only "info" button has NO accessible name |
| NB-073 | Scan Grades (Grades.jsx) | Critical: `image-alt` — Student headshot <img> with NO alt attribute |
| NB-074 | Scan Grades (Grades.jsx) | Critical: `link-name` — Empty parent-portal anchor (icon-only print link with NO text, NO aria-label) |
| NB-075 | Scan Grades (Grades.jsx) | Critical: `button-name` — Icon-only "download report card" button with NO accessible name |
| NB-076 | Scan Grades (Grades.jsx) | Serious: `color-contrast` — Semester label rendered in pale taupe (#cdbf9f on #fff ~2.0:1) |
| NB-077 | Scan Grades (Grades.jsx) | Serious: `svg-img-alt` — GPA trend <svg role="img"> with NO <title> |
| NB-078 | Scan Grades (Grades.jsx) | Serious: `valid-lang` — `lang="latn"` is not a valid BCP-47 primary subtag |
| NB-079 | Scan Grades (Grades.jsx) | Critical: `aria-meter-name` — GPA <div role="meter"> with NO accessible name |
| NB-080 | Scan Grades (Grades.jsx) | Serious: `aria-tooltip-name` — Empty <span role="tooltip"> placeholder |
| NB-081 | Scan Grades (Grades.jsx) | Critical: `aria-valid-attr` — `aria-labeledby` is a typo of `aria-labelledby` |
| NB-082 | Scan Grades (Grades.jsx) | Serious: `dlitem` — Stray <dt> outside any <dl> |
| NB-083 | Scan Grades (Grades.jsx) | Serious: `aria-prohibited-attr` — <button> with `aria-rowindex` (only valid on row/cell roles) |
| NB-084 | Scan Grades (Grades.jsx) | Critical: `aria-required-children` — Empty <div role="tablist"> with NO role="tab" children |
| NB-085 | Scan Grades (Grades.jsx) | Serious: `td-headers-attr` — <td headers="missing-id"> references a non-existent id |
| NB-086 | Scan University (University.jsx) | Critical: `image-alt` — Campus photo <img> with NO alt attribute |
| NB-087 | Scan University (University.jsx) | Critical: `select-name` — Program filter <select> with NO label or aria-label |
| NB-088 | Scan University (University.jsx) | Critical: `button-name` — Icon-only "share" button with NO accessible name |
| NB-089 | Scan University (University.jsx) | Critical: `link-name` — Empty anchor with NO text or aria-label |
| NB-090 | Scan University (University.jsx) | Serious: `svg-img-alt` — "US News rank" <svg role="img"> with NO <title> |
| NB-091 | Scan University (University.jsx) | Critical: `aria-required-children` — <div role="listbox"> with plain <div> children (no role="option") |
| NB-092 | Scan University (University.jsx) | Critical: `aria-meter-name` — Graduation-rate <div role="meter"> with NO accessible name |
| NB-093 | Scan University (University.jsx) | Serious: `aria-tooltip-name` — Empty <span role="tooltip"> |
| NB-094 | Scan University (University.jsx) | Serious: `valid-lang` — `lang="xx"` is not a valid BCP-47 subtag |
| NB-095 | Scan University (University.jsx) | Serious: `dlitem` — Stray <dt> outside any <dl> |
| NB-096 | Scan University (University.jsx) | Serious: `aria-hidden-focus` — Focusable <button> inside aria-hidden="true" subtree |
| NB-097 | Scan University (University.jsx) | Serious: `aria-prohibited-attr` — <span> with `aria-colindex` (only valid on row/cell roles) |
| NB-098 | Scan Register (Univ.) (Register.jsx) | Serious: `color-contrast` — Subtitle rendered in low-contrast brand sand (#cdbf9f on #fff ~2.0:1) |
| NB-099 | Scan Register (Univ.) (Register.jsx) | Critical: `button-name` — Icon-only "help" button with NO accessible name |
| NB-100 | Scan Register (Univ.) (Register.jsx) | Serious: `svg-img-alt` — "Registration progress" <svg role="img"> with NO <title> |
| NB-101 | Scan Register (Univ.) (Register.jsx) | Serious: `valid-lang` — `lang="zz"` is not a valid BCP-47 subtag |
| NB-102 | Scan Register (Univ.) (Register.jsx) | Serious: `aria-progressbar-name` — Cart <div role="progressbar"> with NO accessible name |
| NB-103 | Scan Register (Univ.) (Register.jsx) | Critical: `aria-valid-attr` — `aria-labeledby` typo of `aria-labelledby` |
| NB-104 | Scan Register (Univ.) (Register.jsx) | Serious: `aria-allowed-attr` — `role="presentation"` with `aria-required="true"` |
| NB-105 | Scan Register (Univ.) (Register.jsx) | Serious: `aria-prohibited-attr` — <h2> with `aria-rowindex` (only valid on row/cell roles) |
| NB-106 | Scan Register (Univ.) (Register.jsx) | Critical: `label` — "Intended major" input with NO associated <label> |
| NB-107 | Scan Register (Univ.) (Register.jsx) | Serious: `autocomplete-valid` — `autocomplete="major"` is not a valid HTML autofill token |
| NB-108 | Scan Register (Univ.) (Register.jsx) | Critical: `select-name` — Extra "Term" <select> with NO label or aria-label |
| NB-109 | Scan Register (Univ.) (Register.jsx) | Critical: `aria-required-attr` — <div role="combobox"> missing required `aria-expanded` |
| NB-110 | Scan Services (Services.jsx) | Critical: `image-alt` — Service-hub hero icon <img> with NO alt attribute |
| NB-111 | Scan Services (Services.jsx) | Critical: `select-name` — Agency filter <select> with NO label or aria-label |
| NB-112 | Scan Services (Services.jsx) | Critical: `link-name` — "Click here" link with non-descriptive accessible name — wait, link-name fires only when there is NO name. Use empty anchor instead |
| NB-113 | Scan Services (Services.jsx) | Critical: `button-name` — Icon-only "favorite" button with NO accessible name |
| NB-114 | Scan Services (Services.jsx) | Serious: `svg-img-alt` — "Service activity" <svg role="img"> with NO <title> |
| NB-115 | Scan Services (Services.jsx) | Critical: `aria-required-children` — <div role="listbox"> with plain <div> children (no role="option") |
| NB-116 | Scan Services (Services.jsx) | Serious: `aria-tooltip-name` — Empty <span role="tooltip"> |
| NB-117 | Scan Services (Services.jsx) | Serious: `valid-lang` — `lang="qq"` is not a valid BCP-47 subtag |
| NB-118 | Scan Services (Services.jsx) | Serious: `dlitem` — Stray <dt> outside any <dl> |
| NB-119 | Scan Services (Services.jsx) | Serious: `color-contrast` — "Avg wait" rendered in pale taupe (#cdbf9f on #fff ~2.0:1) |
| NB-120 | Scan Services (Services.jsx) | Critical: `aria-meter-name` — Wait-time <div role="meter"> with NO accessible name |
| NB-121 | Scan Services (Services.jsx) | Critical: `aria-valid-attr-value` — `aria-orientation="diagonal"` is not a permitted value |
| NB-122 | Scan Services (Services.jsx) | Serious: `autocomplete-valid` — `autocomplete="agency"` is not a valid HTML autofill token |
| NB-123 | Scan DMV (DMV.jsx) | Serious: `color-contrast` — Subtitle rendered in pale brand sand (#cdbf9f on #fff ~2.0:1) |
| NB-124 | Scan DMV (DMV.jsx) | Critical: `button-name` — Icon-only "help" button with NO accessible name |
| NB-125 | Scan DMV (DMV.jsx) | Serious: `svg-img-alt` — Renewal-shield <svg role="img"> with NO <title> |
| NB-126 | Scan DMV (DMV.jsx) | Serious: `valid-lang` — `lang="zz"` is not a valid BCP-47 subtag |
| NB-127 | Scan DMV (DMV.jsx) | Critical: `aria-valid-attr` — `aria-labeledby` typo of `aria-labelledby` |
| NB-128 | Scan DMV (DMV.jsx) | Serious: `aria-allowed-attr` — `role="presentation"` with `aria-required="true"` |
| NB-129 | Scan DMV (DMV.jsx) | Serious: `aria-tooltip-name` — Empty <span role="tooltip"> |
| NB-130 | Scan DMV (DMV.jsx) | Serious: `dlitem` — Stray <dt> outside any <dl> |
| NB-131 | Scan DMV (DMV.jsx) | Critical: `label` — "VIN lookup" input with NO associated <label> |
| NB-132 | Scan DMV (DMV.jsx) | Serious: `autocomplete-valid` — `autocomplete="vehicle-vin"` is not a valid HTML autofill token |
| NB-133 | Scan DMV (DMV.jsx) | Critical: `select-name` — Extra "Plate state" <select> with NO label or aria-label |
| NB-134 | Scan DMV (DMV.jsx) | Critical: `aria-required-attr` — <div role="combobox"> missing required `aria-expanded` |
| NB-135 | Scan Benefits (Benefits.jsx) | Critical: `label` — Was: <label htmlFor="ben-household">Household size</label> Replaced with a styled <span> — input has no programmatic name |
| NB-136 | Scan Benefits (Benefits.jsx) | Serious: `autocomplete-valid` — `autoComplete="benefit"` is not a valid WHATWG token |
| NB-137 | Scan Benefits (Benefits.jsx) | Critical: `select-name` — <select> with no label / aria-label |
| NB-138 | Scan Benefits (Benefits.jsx) | Critical: `aria-required-attr` — role="combobox" missing required aria-expanded attribute |
| NB-139 | Scan Benefits (Benefits.jsx) | Critical: `aria-valid-attr-value` — aria-orientation="diagonal" is not a valid token (only horizontal/vertical/undefined) |
| NB-140 | Scan Benefits (Benefits.jsx) | Critical: `button-name` — Icon-only "Print eligibility" button with NO accessible name |
| NB-141 | Scan Benefits (Benefits.jsx) | Serious: `svg-img-alt` — SNAP/Medicaid badge <svg role="img"> with NO <title> |
| NB-142 | Scan Benefits (Benefits.jsx) | Serious: `color-contrast` — Pale taupe disclosure subhead (#cdbf9f on #fff ~2.0:1) |
| NB-143 | Scan Benefits (Benefits.jsx) | Serious: `valid-lang` — `lang="zz"` is not a valid BCP-47 primary subtag |
| NB-144 | Scan Benefits (Benefits.jsx) | Serious: `dlitem` — Stray <dt> outside any <dl> |
| NB-145 | Scan Benefits (Benefits.jsx) | Critical: `aria-meter-name` — Eligibility-likelihood <div role="meter"> with NO accessible name |
| NB-146 | Scan Benefits (Benefits.jsx) | Serious: `aria-prohibited-attr` — <button> with aria-rowindex (only valid on row/cell roles) |
| NB-147 | Scan City home (City.jsx) | Critical: `image-alt` — Mayor headshot <img> with NO alt attribute |
| NB-148 | Scan City home (City.jsx) | Critical: `select-name` — "Find a service" <select> with no label / aria-label |
| NB-149 | Scan City home (City.jsx) | Critical: `link-name` — Empty "Click here" anchor with NO accessible text |
| NB-150 | Scan City home (City.jsx) | Critical: `button-name` — Icon-only social-share button with NO accessible name |
| NB-151 | Scan City home (City.jsx) | Serious: `svg-img-alt` — City-emblem <svg role="img"> with NO <title> |
| NB-152 | Scan City home (City.jsx) | Critical: `aria-required-children` — <div role="listbox"> with no role="option" children |
| NB-153 | Scan City home (City.jsx) | Serious: `valid-lang` — `lang="qq"` is not a valid BCP-47 primary subtag |
| NB-154 | Scan City home (City.jsx) | Serious: `dlitem` — Stray <dt> outside any <dl> |
| NB-155 | Scan City home (City.jsx) | Serious: `color-contrast` — Pale-taupe caption (#cdbf9f on #fff ~2.0:1) |
| NB-156 | Scan City home (City.jsx) | Critical: `aria-meter-name` — Air-quality <div role="meter"> with NO accessible name |
| NB-157 | Scan City home (City.jsx) | Serious: `autocomplete-valid` — autoComplete="address-zip" is not a valid WHATWG token |
| NB-158 | Scan City home (City.jsx) | Serious: `object-alt` — <object> with NO accessible name (no aria-label / title / fallback) |
| NB-159 | Scan City home (City.jsx) | Serious: `aria-tooltip-name` — Empty <span role="tooltip"> placeholder |
| NB-160 | Scan Permits (City) (Permits.jsx) | Critical: `select-name` — Unlabeled "Permit type" <select> with no label / aria-label |
| NB-161 | Scan Permits (City) (Permits.jsx) | Critical: `button-name` — Icon-only "Save draft" button with NO accessible name |
| NB-162 | Scan Permits (City) (Permits.jsx) | Critical: `link-name` — Empty anchor (icon-only export link, no text, no aria-label) |
| NB-163 | Scan Permits (City) (Permits.jsx) | Serious: `svg-img-alt` — Zoning sparkline <svg role="img"> with NO <title> |
| NB-164 | Scan Permits (City) (Permits.jsx) | Serious: `valid-lang` — `lang="latn"` is not a valid BCP-47 primary subtag |
| NB-165 | Scan Permits (City) (Permits.jsx) | Serious: `dlitem` — Stray <dt> outside any <dl> |
| NB-166 | Scan Permits (City) (Permits.jsx) | Critical: `aria-meter-name` — Permit-volume <div role="meter"> with NO accessible name |
| NB-167 | Scan Permits (City) (Permits.jsx) | Critical: `aria-required-attr` — role="combobox" missing required aria-expanded |
| NB-168 | Scan Permits (City) (Permits.jsx) | Critical: `aria-valid-attr` — `aria-labeledby` is a typo of `aria-labelledby` |
| NB-169 | Scan Permits (City) (Permits.jsx) | Serious: `color-contrast` — Pale-taupe required-marker (#cdbf9f on #fff ~2.0:1) |
| NB-170 | Scan Permits (City) (Permits.jsx) | Serious: `aria-progressbar-name` — Review-stage <div role="progressbar"> with NO accessible name |
| NB-171 | Scan Permits (City) (Permits.jsx) | Serious: `autocomplete-valid` — `autoComplete="cost"` is not a valid WHATWG token |
| NB-172 | Scan Vote (Vote.jsx) | Critical: `label` — Was: <label htmlFor="vote-first">First name</label>. Replaced with a styled <span> — input has no programmatic name |
| NB-173 | Scan Vote (Vote.jsx) | Serious: `autocomplete-valid` — `autoComplete="voter"` is not a valid WHATWG token |
| NB-174 | Scan Vote (Vote.jsx) | Critical: `select-name` — Extra unlabeled "Party" <select> with no label / aria-label |
| NB-175 | Scan Vote (Vote.jsx) | Serious: `aria-input-field-name` — <div role="searchbox" contentEditable> with NO accessible name |
| NB-176 | Scan Vote (Vote.jsx) | Critical: `button-name` — Icon-only "Look up registration" button with NO accessible name |
| NB-177 | Scan Vote (Vote.jsx) | Serious: `svg-img-alt` — "I voted" badge <svg role="img"> with NO <title> |
| NB-178 | Scan Vote (Vote.jsx) | Serious: `color-contrast` — Pale-taupe disclaimer (#cdbf9f on #fff ~2.0:1) |
| NB-179 | Scan Vote (Vote.jsx) | Serious: `valid-lang` — `lang="zz"` is not a valid BCP-47 primary subtag |
| NB-180 | Scan Vote (Vote.jsx) | Serious: `dlitem` — Stray <dt> outside any <dl> |
| NB-181 | Scan Vote (Vote.jsx) | Critical: `aria-required-children` — <div role="radiogroup"> with NO role="radio" children |
| NB-182 | Scan Vote (Vote.jsx) | Critical: `link-name` — Empty "More info" anchor (no text, no aria-label) |
| NB-183 | Scan Vote (Vote.jsx) | Critical: `aria-meter-name` — Turnout <div role="meter"> with NO accessible name |
| NB-184 | Scan Vote (Vote.jsx) | Serious: `aria-tooltip-name` — Empty <span role="tooltip"> placeholder |

### Batch 4 — accessible fix (for reference)

| ID     | Minimal fix |
| ------ | ----------- |
| NB-010 | Raise foreground/background contrast to meet 4.5:1 (3:1 for large text). |
| NB-011 | Add a meaningful `alt` attribute (or `alt=""` if purely decorative). |
| NB-012 | Add visible button text or `aria-label` describing the action. |
| NB-013 | Associate a `<label htmlFor>` with the `<select>` or add `aria-label`. |
| NB-014 | Add `<title>` inside the SVG or an `aria-label` on the `role="img"` SVG. |
| NB-015 | Give each child the correct role (e.g. `role="option"` under `role="listbox"`). |
| NB-016 | Use a valid ARIA value (e.g. `aria-expanded="true"`, not `"yes"`). |
| NB-017 | Add `aria-label` (plus `aria-valuenow/min/max`) to the progressbar. |
| NB-018 | Give the tooltip a text content or `aria-label`. |
| NB-019 | Wrap the `<dt>`/`<dd>` in a `<dl>` (or use semantic alternative). |
| NB-020 | Use a valid BCP-47 language tag (e.g. `lang="en"`, `lang="fr"`). |
| NB-021 | Provide visible text or `aria-label` for the link. |
| NB-022 | Use a valid WHATWG `autocomplete` token (e.g. `email`). |
| NB-023 | Add `<title>` inside the SVG or an `aria-label` on the `role="img"` SVG. |
| NB-024 | Add `aria-label` to `role="img"` element. |
| NB-025 | Wrap the `<dt>`/`<dd>` in a `<dl>` (or use semantic alternative). |
| NB-026 | Use a valid BCP-47 language tag (e.g. `lang="en"`, `lang="fr"`). |
| NB-027 | Add the required ARIA attributes for the role (per the comment). |
| NB-028 | Fix the ARIA attribute name (e.g. `aria-labelledby`, not `aria-labeledby`). |
| NB-029 | Raise foreground/background contrast to meet 4.5:1 (3:1 for large text). |
| NB-030 | Add `aria-label` (plus `aria-valuenow/min/max`) to the progressbar. |
| NB-031 | Give the tooltip a text content or `aria-label`. |
| NB-032 | Use a real `<label htmlFor={id}>` associated with the input. |
| NB-033 | Remove ARIA attributes not allowed on the element/role. |
| NB-034 | Add a `value` (or `aria-label`) to the input button. |
| NB-035 | Provide visible text or `aria-label` for the link. |
| NB-036 | Add visible button text or `aria-label` describing the action. |
| NB-037 | Give the meter an `aria-label`. |
| NB-038 | Associate a `<label htmlFor>` with the `<select>` or add `aria-label`. |
| NB-039 | Give the toggle widget an `aria-label`. |
| NB-040 | Raise foreground/background contrast to meet 4.5:1 (3:1 for large text). |
| NB-041 | Give each child the correct role (e.g. `role="option"` under `role="listbox"`). |
| NB-042 | Provide visible text or `aria-label` for the link. |
| NB-043 | Add `<title>` inside the SVG or an `aria-label` on the `role="img"` SVG. |
| NB-044 | Use a valid BCP-47 language tag (e.g. `lang="en"`, `lang="fr"`). |
| NB-045 | Give the tooltip a text content or `aria-label`. |
| NB-046 | Wrap the `<dt>`/`<dd>` in a `<dl>` (or use semantic alternative). |
| NB-047 | Give the ARIA input field an accessible name. |
| NB-048 | Fix the ARIA attribute name (e.g. `aria-labelledby`, not `aria-labeledby`). |
| NB-049 | Add visible button text or `aria-label` describing the action. |
| NB-050 | Add `<title>` inside the SVG or an `aria-label` on the `role="img"` SVG. |
| NB-051 | Raise foreground/background contrast to meet 4.5:1 (3:1 for large text). |
| NB-052 | Give each child the correct role (e.g. `role="option"` under `role="listbox"`). |
| NB-053 | Associate a `<label htmlFor>` with the `<select>` or add `aria-label`. |
| NB-054 | Use a valid BCP-47 language tag (e.g. `lang="en"`, `lang="fr"`). |
| NB-055 | Wrap the `<dt>`/`<dd>` in a `<dl>` (or use semantic alternative). |
| NB-056 | Give the meter an `aria-label`. |
| NB-057 | Give the tooltip a text content or `aria-label`. |
| NB-058 | Use a valid ARIA value (e.g. `aria-expanded="true"`, not `"yes"`). |
| NB-059 | Add alt content inside the `<object>`. |
| NB-060 | Add `<title>` inside the SVG or an `aria-label` on the `role="img"` SVG. |
| NB-061 | Add `aria-label` (plus `aria-valuenow/min/max`) to the progressbar. |
| NB-062 | Raise foreground/background contrast to meet 4.5:1 (3:1 for large text). |
| NB-063 | Use a valid BCP-47 language tag (e.g. `lang="en"`, `lang="fr"`). |
| NB-064 | Wrap the `<dt>`/`<dd>` in a `<dl>` (or use semantic alternative). |
| NB-065 | Remove focusable descendants from `aria-hidden="true"` ancestors. |
| NB-066 | Use a real `<label htmlFor={id}>` associated with the input. |
| NB-067 | Use a valid WHATWG `autocomplete` token (e.g. `email`). |
| NB-068 | Associate a `<label htmlFor>` with the `<select>` or add `aria-label`. |
| NB-069 | Add the required ARIA attributes for the role (per the comment). |
| NB-070 | Fix the ARIA attribute name (e.g. `aria-labelledby`, not `aria-labeledby`). |
| NB-071 | Remove ARIA attributes not allowed on the element/role. |
| NB-072 | Add visible button text or `aria-label` describing the action. |
| NB-073 | Add a meaningful `alt` attribute (or `alt=""` if purely decorative). |
| NB-074 | Provide visible text or `aria-label` for the link. |
| NB-075 | Add visible button text or `aria-label` describing the action. |
| NB-076 | Raise foreground/background contrast to meet 4.5:1 (3:1 for large text). |
| NB-077 | Add `<title>` inside the SVG or an `aria-label` on the `role="img"` SVG. |
| NB-078 | Use a valid BCP-47 language tag (e.g. `lang="en"`, `lang="fr"`). |
| NB-079 | Give the meter an `aria-label`. |
| NB-080 | Give the tooltip a text content or `aria-label`. |
| NB-081 | Fix the ARIA attribute name (e.g. `aria-labelledby`, not `aria-labeledby`). |
| NB-082 | Wrap the `<dt>`/`<dd>` in a `<dl>` (or use semantic alternative). |
| NB-083 | Fix the underlying `aria-prohibited-attr` failure per the WCAG 4.1.2 requirement. |
| NB-084 | Give each child the correct role (e.g. `role="option"` under `role="listbox"`). |
| NB-085 | Reference valid `<th id>`s from `headers` attribute. |
| NB-086 | Add a meaningful `alt` attribute (or `alt=""` if purely decorative). |
| NB-087 | Associate a `<label htmlFor>` with the `<select>` or add `aria-label`. |
| NB-088 | Add visible button text or `aria-label` describing the action. |
| NB-089 | Provide visible text or `aria-label` for the link. |
| NB-090 | Add `<title>` inside the SVG or an `aria-label` on the `role="img"` SVG. |
| NB-091 | Give each child the correct role (e.g. `role="option"` under `role="listbox"`). |
| NB-092 | Give the meter an `aria-label`. |
| NB-093 | Give the tooltip a text content or `aria-label`. |
| NB-094 | Use a valid BCP-47 language tag (e.g. `lang="en"`, `lang="fr"`). |
| NB-095 | Wrap the `<dt>`/`<dd>` in a `<dl>` (or use semantic alternative). |
| NB-096 | Remove focusable descendants from `aria-hidden="true"` ancestors. |
| NB-097 | Fix the underlying `aria-prohibited-attr` failure per the WCAG 4.1.2 requirement. |
| NB-098 | Raise foreground/background contrast to meet 4.5:1 (3:1 for large text). |
| NB-099 | Add visible button text or `aria-label` describing the action. |
| NB-100 | Add `<title>` inside the SVG or an `aria-label` on the `role="img"` SVG. |
| NB-101 | Use a valid BCP-47 language tag (e.g. `lang="en"`, `lang="fr"`). |
| NB-102 | Add `aria-label` (plus `aria-valuenow/min/max`) to the progressbar. |
| NB-103 | Fix the ARIA attribute name (e.g. `aria-labelledby`, not `aria-labeledby`). |
| NB-104 | Remove ARIA attributes not allowed on the element/role. |
| NB-105 | Fix the underlying `aria-prohibited-attr` failure per the WCAG 4.1.2 requirement. |
| NB-106 | Use a real `<label htmlFor={id}>` associated with the input. |
| NB-107 | Use a valid WHATWG `autocomplete` token (e.g. `email`). |
| NB-108 | Associate a `<label htmlFor>` with the `<select>` or add `aria-label`. |
| NB-109 | Add the required ARIA attributes for the role (per the comment). |
| NB-110 | Add a meaningful `alt` attribute (or `alt=""` if purely decorative). |
| NB-111 | Associate a `<label htmlFor>` with the `<select>` or add `aria-label`. |
| NB-112 | Provide visible text or `aria-label` for the link. |
| NB-113 | Add visible button text or `aria-label` describing the action. |
| NB-114 | Add `<title>` inside the SVG or an `aria-label` on the `role="img"` SVG. |
| NB-115 | Give each child the correct role (e.g. `role="option"` under `role="listbox"`). |
| NB-116 | Give the tooltip a text content or `aria-label`. |
| NB-117 | Use a valid BCP-47 language tag (e.g. `lang="en"`, `lang="fr"`). |
| NB-118 | Wrap the `<dt>`/`<dd>` in a `<dl>` (or use semantic alternative). |
| NB-119 | Raise foreground/background contrast to meet 4.5:1 (3:1 for large text). |
| NB-120 | Give the meter an `aria-label`. |
| NB-121 | Use a valid ARIA value (e.g. `aria-expanded="true"`, not `"yes"`). |
| NB-122 | Use a valid WHATWG `autocomplete` token (e.g. `email`). |
| NB-123 | Raise foreground/background contrast to meet 4.5:1 (3:1 for large text). |
| NB-124 | Add visible button text or `aria-label` describing the action. |
| NB-125 | Add `<title>` inside the SVG or an `aria-label` on the `role="img"` SVG. |
| NB-126 | Use a valid BCP-47 language tag (e.g. `lang="en"`, `lang="fr"`). |
| NB-127 | Fix the ARIA attribute name (e.g. `aria-labelledby`, not `aria-labeledby`). |
| NB-128 | Remove ARIA attributes not allowed on the element/role. |
| NB-129 | Give the tooltip a text content or `aria-label`. |
| NB-130 | Wrap the `<dt>`/`<dd>` in a `<dl>` (or use semantic alternative). |
| NB-131 | Use a real `<label htmlFor={id}>` associated with the input. |
| NB-132 | Use a valid WHATWG `autocomplete` token (e.g. `email`). |
| NB-133 | Associate a `<label htmlFor>` with the `<select>` or add `aria-label`. |
| NB-134 | Add the required ARIA attributes for the role (per the comment). |
| NB-135 | Use a real `<label htmlFor={id}>` associated with the input. |
| NB-136 | Use a valid WHATWG `autocomplete` token (e.g. `email`). |
| NB-137 | Associate a `<label htmlFor>` with the `<select>` or add `aria-label`. |
| NB-138 | Add the required ARIA attributes for the role (per the comment). |
| NB-139 | Use a valid ARIA value (e.g. `aria-expanded="true"`, not `"yes"`). |
| NB-140 | Add visible button text or `aria-label` describing the action. |
| NB-141 | Add `<title>` inside the SVG or an `aria-label` on the `role="img"` SVG. |
| NB-142 | Raise foreground/background contrast to meet 4.5:1 (3:1 for large text). |
| NB-143 | Use a valid BCP-47 language tag (e.g. `lang="en"`, `lang="fr"`). |
| NB-144 | Wrap the `<dt>`/`<dd>` in a `<dl>` (or use semantic alternative). |
| NB-145 | Give the meter an `aria-label`. |
| NB-146 | Fix the underlying `aria-prohibited-attr` failure per the WCAG 4.1.2 requirement. |
| NB-147 | Add a meaningful `alt` attribute (or `alt=""` if purely decorative). |
| NB-148 | Associate a `<label htmlFor>` with the `<select>` or add `aria-label`. |
| NB-149 | Provide visible text or `aria-label` for the link. |
| NB-150 | Add visible button text or `aria-label` describing the action. |
| NB-151 | Add `<title>` inside the SVG or an `aria-label` on the `role="img"` SVG. |
| NB-152 | Give each child the correct role (e.g. `role="option"` under `role="listbox"`). |
| NB-153 | Use a valid BCP-47 language tag (e.g. `lang="en"`, `lang="fr"`). |
| NB-154 | Wrap the `<dt>`/`<dd>` in a `<dl>` (or use semantic alternative). |
| NB-155 | Raise foreground/background contrast to meet 4.5:1 (3:1 for large text). |
| NB-156 | Give the meter an `aria-label`. |
| NB-157 | Use a valid WHATWG `autocomplete` token (e.g. `email`). |
| NB-158 | Add alt content inside the `<object>`. |
| NB-159 | Give the tooltip a text content or `aria-label`. |
| NB-160 | Associate a `<label htmlFor>` with the `<select>` or add `aria-label`. |
| NB-161 | Add visible button text or `aria-label` describing the action. |
| NB-162 | Provide visible text or `aria-label` for the link. |
| NB-163 | Add `<title>` inside the SVG or an `aria-label` on the `role="img"` SVG. |
| NB-164 | Use a valid BCP-47 language tag (e.g. `lang="en"`, `lang="fr"`). |
| NB-165 | Wrap the `<dt>`/`<dd>` in a `<dl>` (or use semantic alternative). |
| NB-166 | Give the meter an `aria-label`. |
| NB-167 | Add the required ARIA attributes for the role (per the comment). |
| NB-168 | Fix the ARIA attribute name (e.g. `aria-labelledby`, not `aria-labeledby`). |
| NB-169 | Raise foreground/background contrast to meet 4.5:1 (3:1 for large text). |
| NB-170 | Add `aria-label` (plus `aria-valuenow/min/max`) to the progressbar. |
| NB-171 | Use a valid WHATWG `autocomplete` token (e.g. `email`). |
| NB-172 | Use a real `<label htmlFor={id}>` associated with the input. |
| NB-173 | Use a valid WHATWG `autocomplete` token (e.g. `email`). |
| NB-174 | Associate a `<label htmlFor>` with the `<select>` or add `aria-label`. |
| NB-175 | Give the ARIA input field an accessible name. |
| NB-176 | Add visible button text or `aria-label` describing the action. |
| NB-177 | Add `<title>` inside the SVG or an `aria-label` on the `role="img"` SVG. |
| NB-178 | Raise foreground/background contrast to meet 4.5:1 (3:1 for large text). |
| NB-179 | Use a valid BCP-47 language tag (e.g. `lang="en"`, `lang="fr"`). |
| NB-180 | Wrap the `<dt>`/`<dd>` in a `<dl>` (or use semantic alternative). |
| NB-181 | Give each child the correct role (e.g. `role="option"` under `role="listbox"`). |
| NB-182 | Provide visible text or `aria-label` for the link. |
| NB-183 | Give the meter an `aria-label`. |
| NB-184 | Give the tooltip a text content or `aria-label`. |

## Pre-existing Phase 1 issues

These are issues that pre-date the Phase 2 effort. They were introduced inadvertently while building the clean baseline (mostly inline body links without underlines). Catalogued here so a customer scan returns no "mystery" findings — every finding has a row.

The `NB-*` IDs above are deliberate Phase 2 additions; the `NB-PL-*` IDs below are Phase 1 Leftovers. Status `Pre-existing` means we know about it, we haven't fixed it, and we're choosing to leave it in for now so demos look realistic.

| ID        | Page(s)            | Component                                                                                  | WCAG  | axe rule              | Severity | Tool     | Status        |
| --------- | ------------------ | ------------------------------------------------------------------------------------------ | ----- | --------------------- | -------- | -------- | ------------- |
| NB-PL-001 | Login              | `Login.jsx` inline body anchors that lack underline / non-color cue: "Create an account" link below the sign-in form, plus "Terms of Use" and "Privacy Notice" in the consent line | 1.4.1 | `link-in-text-block`  | Serious  | axe-core | Pre-existing |

### Notes on the NB-PL set

- **NB-PL-001** mirrors DQBC's `PL-003` / `PL-004` pattern: inline anchors in body copy that are distinguished from surrounding text by color alone. Fix is the same — add `text-decoration: underline` (or another non-color visual indicator) to inline body anchors. Three nodes on the Login page.
- These rows don't get `PHASE-2` inline tags in the source — they pre-date Phase 2. They're tracked here purely for catalog completeness so customer scans don't show "mystery" findings.

### Co-firing notes for NB-027

`NB-027` (Login "Recent usernames" custom combobox) co-fires three axe rules on the same element:

1. **`aria-required-attr` (Critical)** — the deliberate primary issue: `role="combobox"` requires `aria-expanded` and the markup omits it.
2. **`aria-input-field-name` (Moderate)** — combobox is treated as an input field role, so it must have an accessible name; the markup has no `aria-label` / `aria-labelledby`.
3. **`aria-valid-attr-value` (Critical)** — `aria-controls="recent-users-list"` references a non-existent element id.

This is genuinely how real hand-rolled comboboxes fail in production — adding one bad widget reliably surfaces three findings in a single scan. Worth calling out in the demo as "look at how a single component generates a cluster of issues; this is why we recommend axe Linter at write time."

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
