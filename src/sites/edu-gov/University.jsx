import { Link } from 'react-router-dom';
import { useAuth } from './auth.jsx';

/**
 * Northbrook State University — public home page.
 * Renders inside <PublicLayout>. No auth required to view.
 */
export default function University() {
  const { isAuthenticated } = useAuth();

  const featuredPrograms = [
    { id: 'cs',  name: 'Computer Science, B.S.',        dept: 'School of Engineering' },
    { id: 'en',  name: 'English Literature, B.A.',      dept: 'College of Arts & Letters' },
    { id: 'bi',  name: 'Biological Sciences, B.S.',     dept: 'College of Sciences' },
    { id: 'ps',  name: 'Public Policy, M.P.P.',         dept: 'School of Public Affairs' },
    { id: 'ar',  name: 'Studio Art, B.F.A.',            dept: 'College of Arts & Letters' },
    { id: 'nu',  name: 'Nursing, B.S.N.',               dept: 'College of Health Sciences' },
    { id: 'bu',  name: 'Business Administration, B.B.A.', dept: 'School of Business' },
  ];

  const ctaTo = isAuthenticated ? '/edu-gov/university/register' : '/edu-gov/login';
  const ctaLabel = isAuthenticated ? 'Register for courses' : 'Sign in to register for courses';

  return (
    <>
      <section className="nbc-hero" aria-labelledby="nsu-h">
        <div>
          <span className="nbc-pill">Northbrook State University</span>
          <h1 id="nsu-h">Northbrook State University</h1>
          <p className="sub">
            A public research university serving the Pacific Northwest with
            87 undergraduate and graduate programs across seven colleges.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="btn btn-primary" to={ctaTo}>{ctaLabel}</Link>
            <Link className="btn btn-outline" to="/edu-gov/university">Visit campus</Link>
          </div>
        </div>
        <div className="nbc-hero-visual" aria-hidden="true">
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M80 20 L150 50 L80 80 L10 50 Z" fill="rgba(255,255,255,0.18)" />
            <path d="M30 60 V90 C30 100 130 100 130 90 V60" />
            <path d="M80 80 V100" />
          </svg>
        </div>
      </section>

      {/* PHASE-2 a11y issue NB-IGT-004 (Headings IGT) — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          <h4> placed directly after the page <h1> with no <h2>/<h3> in
          between. The Headings IGT walks the SE through verifying the
          heading outline; big skips like h1 → h4 break document
          structure for screen-reader navigation. */}
      <section style={{ maxWidth: 720, margin: '0 auto 16px' }}>
        <h4 style={{ color: 'var(--brand-deep)', margin: '0 0 6px' }}>Quick facts</h4>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
          NSU is a Carnegie R2 research institution founded in 1907.
        </p>
      </section>

      <section className="nbc-section" aria-labelledby="why-h">
        {/* PHASE-2 a11y issue NB-086 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Campus photo <img> with NO alt attribute. axe-core `image-alt`
            fires Critical (WCAG 1.1.1). SLED pattern: hero/gallery shots
            slip in without alt during marketing refreshes. */}
        <img src="/nsu-campus.jpg" width="320" height="160" style={{ display: 'block', margin: '0 auto 16px' }} />

        {/* PHASE-2 a11y issue NB-087 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Program filter <select> with NO label or aria-label. axe-core
            `select-name` fires Critical (WCAG 4.1.2). SLED pattern:
            campus directories trust placeholder option text as the
            label. */}
        <select defaultValue="" style={{ marginBottom: 12 }}>
          <option value="" disabled>Program area…</option>
          <option value="eng">Engineering</option>
          <option value="arts">Arts &amp; Letters</option>
        </select>

        {/* PHASE-2 a11y issue NB-088 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Icon-only "share" button with NO accessible name. axe-core
            `button-name` fires Critical (WCAG 4.1.2). SLED pattern:
            social-share toolbars drop the text label. */}
        <button type="button" style={{ background: 'none', border: '1px solid var(--border)', padding: 6, marginRight: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="6" cy="12" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="18" cy="18" r="2" />
            <path d="M8 11l8-4" /><path d="M8 13l8 4" />
          </svg>
        </button>

        {/* PHASE-2 a11y issue NB-089 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Empty anchor with NO text or aria-label. axe-core `link-name`
            fires Critical (WCAG 2.4.4). SLED pattern: placeholder "more
            info" links remain in the DOM with no body. */}
        <a href="/edu-gov/university" onClick={(e) => e.preventDefault()} style={{ display: 'inline-block', width: 24, height: 24, border: '1px solid var(--border)' }} />

        {/* PHASE-2 a11y issue NB-090 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            "US News rank" <svg role="img"> with NO <title>. axe-core
            `svg-img-alt` fires Serious (WCAG 1.1.1). SLED pattern:
            ranking badges treated as decoration despite carrying info. */}
        <svg role="img" width="40" height="40" viewBox="0 0 40 40" style={{ verticalAlign: 'middle' }}>
          <circle cx="20" cy="20" r="18" fill="#0a66c2" />
          <text x="20" y="25" textAnchor="middle" fill="#fff" fontSize="13">#14</text>
        </svg>

        <h2 id="why-h" className="section-title">Why NSU</h2>
        <p className="section-sub">
          A flagship public university with the personal feel of a small college.
        </p>
        <div className="service-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: 1000 }}>
          <article className="service-card">
            <div className="service-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
            </div>
            <h3>Flexible scheduling</h3>
            <p>Online, hybrid, and evening courses for working students and families.</p>
          </article>
          <article className="service-card">
            <div className="service-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-7 9 7-9 7z" /><path d="M5 13v6h14v-6" /></svg>
            </div>
            <h3>Top-ranked faculty</h3>
            <p>Researchers and practitioners with industry and field experience.</p>
          </article>
          <article className="service-card">
            <div className="service-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
            </div>
            <h3>In-state tuition</h3>
            <p>Among the lowest in the region, with generous need-based aid.</p>
          </article>
        </div>
      </section>

      <section className="nbc-section alt" aria-labelledby="stats-h">
        <h2 id="stats-h" className="section-title">NSU at a glance</h2>
        <div className="service-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: 1000 }}>
          <article className="service-card" style={{ alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--brand-deep)' }}>12,400</div>
            <p>Enrolled students</p>
          </article>
          <article className="service-card" style={{ alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--brand-deep)' }}>87</div>
            <p>Degree programs</p>
          </article>
          {/* PHASE-2 a11y issue NB-002 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Stat label "Six-year graduation rate" inline-styled with
              color #b8a87a (warm sand) on the bg-soft section background
              (~2.3:1). axe-core `color-contrast` fires Serious (WCAG 1.4.3).
              Common SLED audit finding: institutional brand colors used as
              text on light backgrounds without contrast verification. */}
          <article className="service-card" style={{ alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--brand-deep)' }}>92%</div>
            <p style={{ color: '#b8a87a' }}>Six-year graduation rate</p>
          </article>
        </div>
      </section>

      <section className="nbc-section" aria-labelledby="programs-h">
        <h2 id="programs-h" className="section-title">Featured programs</h2>
        <p className="section-sub">A sample of NSU's most popular degrees.</p>

        {/* PHASE-2 a11y issue NB-091 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            <div role="listbox"> with plain <div> children (no
            role="option"). axe-core `aria-required-children` fires
            Critical (WCAG 1.3.1). SLED pattern: custom program-picker
            dropdowns ship without required option roles. */}
        <div role="listbox" aria-label="Programs" style={{ border: '1px solid var(--border)', borderRadius: 6, maxWidth: 320, margin: '0 auto 12px' }}>
          <div style={{ padding: 6 }}>Computer Science</div>
          <div style={{ padding: 6 }}>English Literature</div>
          <div style={{ padding: 6 }}>Nursing</div>
        </div>

        {/* PHASE-2 a11y issue NB-092 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Graduation-rate <div role="meter"> with NO accessible name.
            axe-core `aria-meter-name` fires Critical (WCAG 1.1.1).
            SLED pattern: KPI bars rendered without meter names. */}
        <div role="meter" aria-valuenow={92} aria-valuemin={0} aria-valuemax={100} style={{ height: 6, background: '#e5e7eb', maxWidth: 320, margin: '0 auto 12px' }}>
          <div style={{ width: '92%', height: '100%', background: '#0a66c2' }} />
        </div>

        {/* PHASE-2 a11y issue NB-093 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Empty <span role="tooltip">. axe-core `aria-tooltip-name`
            fires Serious (WCAG 4.1.2). SLED pattern: tooltip mount
            nodes with no content. */}
        <span role="tooltip" id="nsu-tip" />

        {/* PHASE-2 a11y issue NB-094 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            `lang="xx"` is not a valid BCP-47 subtag. axe-core
            `valid-lang` fires Serious (WCAG 3.1.2). SLED pattern:
            "translations available" caption mis-spells lang. */}
        <span lang="xx" style={{ fontSize: 12 }}>Información en español</span>

        {/* PHASE-2 a11y issue NB-095 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Stray <dt> outside any <dl>. axe-core `dlitem` fires
            Serious (WCAG 1.3.1). SLED pattern: stray markup leftover
            from a card refactor. */}
        <dt>Program</dt>

        {/* PHASE-2 a11y issue NB-096 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Focusable <button> inside aria-hidden="true" subtree.
            axe-core `aria-hidden-focus` fires Serious (WCAG 4.1.2).
            SLED pattern: hidden helper menus retain tabbable controls. */}
        <div aria-hidden="true">
          <button type="button">Hidden help</button>
        </div>

        {/* PHASE-2 a11y issue NB-097 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            <span> with `aria-colindex` (only valid on row/cell roles).
            axe-core `aria-prohibited-attr` fires Serious (WCAG 4.1.2).
            SLED pattern: ARIA grid attributes leak onto non-grid nodes. */}
        <span aria-colindex={2}>ranked</span>

        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <ul className="activity-strip">
            {featuredPrograms.map((p) => (
              <li key={p.id}>
                <span><strong>{p.name}</strong></span>
                <span className="when">{p.dept}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="nbc-section alt" aria-labelledby="reg-h">
        <h2 id="reg-h" className="section-title">Ready to register?</h2>
        <p className="section-sub">
          {isAuthenticated
            ? 'Your registration window is open. Pick courses and reserve your seat.'
            : 'Sign in to your Northbrook Connect account to browse and register for courses.'}
        </p>
        <div style={{ textAlign: 'center' }}>
          <Link className="btn btn-primary" to={ctaTo}>{ctaLabel}</Link>
        </div>
      </section>
    </>
  );
}
