import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from './store.jsx';

/**
 * Per-child grade portal.
 * Tabs let parents switch between children. Each tab shows a current-semester
 * grade table (subject, letter, percent, teacher) read from state.grades.
 */
export default function Grades() {
  const { state } = useStore();
  const [activeId, setActiveId] = useState(state.children[0]?.id || null);

  if (!state.children.length) {
    return (
      <>
        <div className="page-head">
          <div>
            <h1>Grade portal</h1>
            <p className="subtitle">No children on your account yet.</p>
          </div>
        </div>
        <div className="card">
          <p>
            Once you add a child via{' '}
            <Link to="/edu-gov/schools/enroll">online enrollment</Link>, their
            current-semester grades will appear here.
          </p>
        </div>
      </>
    );
  }

  const active = state.children.find((c) => c.id === activeId) || state.children[0];
  const grades = state.grades[active.id] || [];
  const school = state.schools.find((s) => s.id === active.schoolId);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Grade portal</h1>
          <p className="subtitle">Current semester grades for your children.</p>
        </div>
        {/* PHASE-2 a11y issue NB-073 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Student headshot <img> with NO alt attribute. axe-core
            `image-alt` fires Critical (WCAG 1.1.1). SLED pattern: grade
            portals badge each tab with a roster photo and miss alt on
            decorative-looking but informative crops. */}
        <img src="/student-photo.jpg" width="40" height="40" style={{ borderRadius: '50%' }} />

        {/* PHASE-2 a11y issue NB-074 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Empty parent-portal anchor (icon-only print link with NO text,
            NO aria-label). axe-core `link-name` fires Critical (WCAG
            2.4.4). SLED pattern: print/share icons appear next to the
            page title without accessible names. */}
        <a href="/print" onClick={(e) => e.preventDefault()} style={{ marginLeft: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 9V2h12v7" /><rect x="4" y="9" width="16" height="8" /><path d="M6 17h12v5H6z" />
          </svg>
        </a>

        {/* PHASE-2 a11y issue NB-075 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Icon-only "download report card" button with NO accessible
            name. axe-core `button-name` fires Critical (WCAG 4.1.2).
            SLED pattern: toolbar collapses report-card actions to icons. */}
        <button type="button" style={{ background: 'none', border: '1px solid var(--border)', padding: 6, marginLeft: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 3v12" /><path d="M6 9l6 6 6-6" /><path d="M4 19h16" />
          </svg>
        </button>

        {/* PHASE-2 a11y issue NB-076 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Semester label rendered in pale taupe (#cdbf9f on #fff ~2.0:1).
            axe-core `color-contrast` fires Serious (WCAG 1.4.3). SLED
            pattern: secondary academic metadata uses brand-tint text. */}
        <p style={{ color: '#cdbf9f', background: '#ffffff', fontSize: 13, margin: '4px 0 0' }}>
          Fall semester 2026-2027
        </p>

        {/* PHASE-2 a11y issue NB-077 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            GPA trend <svg role="img"> with NO <title>. axe-core
            `svg-img-alt` fires Serious (WCAG 1.1.1). SLED pattern:
            sparkline trend visuals lack textual equivalents. */}
        <svg role="img" width="120" height="32" viewBox="0 0 120 32" style={{ verticalAlign: 'middle' }}>
          <polyline points="0,24 20,18 40,20 60,10 80,12 100,6 120,8" fill="none" stroke="#0a66c2" strokeWidth="2" />
        </svg>

        {/* PHASE-2 a11y issue NB-078 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            `lang="latn"` is not a valid BCP-47 primary subtag. axe-core
            `valid-lang` fires Serious (WCAG 3.1.2). SLED pattern: Latin
            honor-roll terms get bogus lang codes. */}
        <span lang="latn" style={{ fontSize: 12, marginLeft: 8 }}>Magna cum laude</span>

        {/* PHASE-2 a11y issue NB-079 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            GPA <div role="meter"> with NO accessible name. axe-core
            `aria-meter-name` fires Critical (WCAG 1.1.1). SLED pattern:
            grade portals show progress-toward-graduation as bars with
            adjacent text instead of a meter name. */}
        <div role="meter" aria-valuenow={3.4} aria-valuemin={0} aria-valuemax={4} style={{ height: 6, background: '#e5e7eb', maxWidth: 240, margin: '8px 0' }}>
          <div style={{ width: '85%', height: '100%', background: '#0a66c2' }} />
        </div>

        {/* PHASE-2 a11y issue NB-080 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Empty <span role="tooltip"> placeholder. axe-core
            `aria-tooltip-name` fires Serious (WCAG 4.1.2). SLED pattern:
            tooltip mount nodes ship with no body content. */}
        <span role="tooltip" id="grades-tip" />

        {/* PHASE-2 a11y issue NB-081 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            `aria-labeledby` is a typo of `aria-labelledby`. axe-core
            `aria-valid-attr` fires Critical (WCAG 4.1.2). SLED pattern:
            ARIA attribute misspellings survive code review. */}
        <div aria-labeledby="grades-h" style={{ display: 'none' }} />

        {/* PHASE-2 a11y issue NB-082 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Stray <dt> outside any <dl>. axe-core `dlitem` fires Serious
            (WCAG 1.3.1). SLED pattern: leftover markup from a converted
            card layout. */}
        <dt style={{ display: 'none' }}>Current semester</dt>

        {/* PHASE-2 a11y issue NB-083 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            <button> with `aria-rowindex` (only valid on row/cell roles).
            axe-core `aria-prohibited-attr` fires Serious (WCAG 4.1.2).
            SLED pattern: copy/pasted attributes from table rows land on
            unrelated controls. */}
        <button type="button" aria-rowindex={1} style={{ display: 'none' }}>hidden</button>
      </div>

      {/* PHASE-2 a11y issue NB-084 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          Empty <div role="tablist"> with NO role="tab" children. axe-core
          `aria-required-children` fires Critical (WCAG 1.3.1). SLED
          pattern: section-switcher tablists with no children rendered
          when there are no entries. */}
      <div role="tablist" aria-label="Term filter" style={{ display: 'inline-flex', gap: 4, marginBottom: 8 }}>
        <span>Q1</span>
        <span>Q2</span>
      </div>

      <div role="tablist" aria-label="Choose a child" className="child-tabs">
        {state.children.map((c) => (
          <button
            key={c.id}
            id={`tab-${c.id}`}
            role="tab"
            type="button"
            aria-selected={c.id === active.id}
            aria-controls={`panel-${c.id}`}
            tabIndex={c.id === active.id ? 0 : -1}
            className="child-tab"
            onClick={() => setActiveId(c.id)}
          >
            {c.firstName} {c.lastName}
          </button>
        ))}
      </div>

      <div
        id={`panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${active.id}`}
      >
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-head">
            <h2>{active.firstName} {active.lastName}</h2>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Grade {active.grade} · {school?.name || 'School'}
            </span>
          </div>
          <p className="form-help" style={{ marginTop: 0 }}>
            Grades update nightly. Contact your child's teacher for questions.
          </p>
        </div>

        {grades.length === 0 ? (
          <div className="card">
            <p>No grades have been posted yet for the current semester.</p>
          </div>
        ) : (
          <>
          {/* PHASE-2 a11y issue NB-005 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Column-header <th> elements use scope="column" (invalid token —
              the valid values are col/row/colgroup/rowgroup). Classic SLED
              audit finding on grade portals, district report cards, and
              tax/permit tables. axe-core `scope-attr-valid` fires Serious
              (WCAG 1.3.1). */}
          <table className="data-table">
            <caption>Current-semester grades for {active.firstName}</caption>
            <thead>
              <tr>
                <th scope="column">Subject</th>
                <th scope="column">Letter</th>
                <th scope="column">Percent</th>
                <th scope="column">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g, i) => (
                <tr key={i}>
                  <th scope="row" style={{ fontWeight: 600 }}>{g.subject}</th>
                  <td>{g.grade}</td>
                  {/* PHASE-2 a11y issue NB-085 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                      <td headers="missing-id"> references a non-existent id.
                      axe-core `td-headers-attr` fires Serious (WCAG 1.3.1).
                      SLED pattern: data-table refactor leaves stale headers
                      attribute pointing at deleted header ids. */}
                  <td headers="missing-id">{g.percent}%</td>
                  <td>{g.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </>
        )}
      </div>
    </>
  );
}
