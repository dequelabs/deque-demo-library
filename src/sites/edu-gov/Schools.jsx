import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import { useStore } from './store.jsx';

/**
 * Northbrook Public Schools district home.
 * Public (no login required to view). Shows the four-school directory
 * and an upcoming-events strip. A "sign in to enroll" CTA is shown to
 * unauthenticated visitors; the same area shows a "success" banner after
 * the enrollment flow redirects here with state.justEnrolled.
 */
export default function Schools() {
  const { isAuthenticated } = useAuth();
  const { state } = useStore();
  const location = useLocation();
  const justEnrolled = location.state?.justEnrolled;

  return (
    <>
      <section className="nbc-hero" aria-labelledby="schools-h">
        <div>
          <span className="nbc-pill">Northbrook State School District</span>
          <h1 id="schools-h">Northbrook Public Schools</h1>
          <p className="sub">
            Four public schools serving every grade from kindergarten through
            twelfth grade, plus a fully accredited online academy.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link className="btn btn-primary" to="/edu-gov/schools/enroll">
                Enroll a child
              </Link>
            ) : (
              <Link className="btn btn-primary" to="/edu-gov/login">
                Sign in to enroll
              </Link>
            )}
            <Link className="btn btn-outline" to="/edu-gov/schools/grades">
              Grade portal
            </Link>
          </div>
        </div>
        <div className="nbc-hero-visual" aria-hidden="true">
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 100 L80 30 L140 100 Z" fill="rgba(255,255,255,0.16)" />
            <rect x="70" y="60" width="20" height="40" fill="rgba(255,255,255,0.22)" />
            <path d="M10 100 H150" />
          </svg>
        </div>
      </section>

      <section className="nbc-section" aria-labelledby="dir-h">
        {justEnrolled && (
          <div className="alert-success" role="status" style={{ maxWidth: 760, margin: '0 auto 24px' }}>
            <strong>Enrollment received.</strong> We will email you within two
            business days. You can track status from your dashboard.
          </div>
        )}

        {/* PHASE-2 a11y issue NB-001 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            District seal <img> with NO alt attribute. axe-core `image-alt`
            fires Critical (WCAG 1.1.1). Realistic SLED audit finding:
            decorative-looking emblems often skip alt even though they carry
            organisational identity. */}
        <img
          src="/nbps-seal.svg"
          width="64"
          height="64"
          style={{ display: 'block', margin: '0 auto 16px' }}
        />

        <h2 id="dir-h" className="section-title">School directory</h2>
        <p className="section-sub">
          Click any school for principal, address, and contact info.
        </p>

        {/* PHASE-2 a11y issue NB-049 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Icon-only "filter" button has NO accessible name. axe-core
            `button-name` fires Critical (WCAG 4.1.2). SLED pattern:
            directory toolbars condense to icon-only on a redesign and
            text labels are not re-added as aria-label. */}
        <button type="button" style={{ background: 'none', border: '1px solid var(--border)', padding: 6, marginRight: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M3 4h18l-7 8v6l-4 2v-8z" />
          </svg>
        </button>

        {/* PHASE-2 a11y issue NB-050 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Inline informational chart <svg role="img"> with NO <title>.
            axe-core `svg-img-alt` fires Serious (WCAG 1.1.1). SLED
            pattern: district "enrollment trend" sparklines embedded
            without textual equivalents. */}
        <svg role="img" width="120" height="32" viewBox="0 0 120 32" style={{ verticalAlign: 'middle' }}>
          <polyline points="0,28 20,18 40,22 60,12 80,16 100,8 120,14" fill="none" stroke="#0a66c2" strokeWidth="2" />
        </svg>

        {/* PHASE-2 a11y issue NB-051 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Meta line "x children enrolled" rendered in light grey
            (#b5b5b5 on white ~2.4:1). axe-core `color-contrast` fires
            Serious (WCAG 1.4.3). SLED pattern: secondary directory
            metadata gets toned down past AA in pursuit of hierarchy. */}
        <p style={{ color: '#b5b5b5', background: '#ffffff', fontSize: 13 }}>
          {state.schools.length} schools currently in the district.
        </p>

        {/* PHASE-2 a11y issue NB-052 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            "Districts" <div role="listbox"> with plain <div> children
            (no role="option"). axe-core `aria-required-children` fires
            Critical (WCAG 1.3.1). SLED pattern: custom dropdowns roll
            their own listboxes without the required child roles. */}
        <div role="listbox" aria-label="Districts" style={{ border: '1px solid var(--border)', borderRadius: 6, maxWidth: 320, marginBottom: 12 }}>
          <div style={{ padding: 6 }}>Northbrook</div>
          <div style={{ padding: 6 }}>Cedarbrook</div>
          <div style={{ padding: 6 }}>Birchwood</div>
        </div>

        {/* PHASE-2 a11y issue NB-053 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            "Grade level" <select> has NO label or aria-label. axe-core
            `select-name` fires Critical (WCAG 4.1.2). SLED pattern:
            filter dropdowns trust placeholder option text. */}
        <select defaultValue="" style={{ marginRight: 8 }}>
          <option value="" disabled>Grade level…</option>
          <option value="k-5">K-5</option>
          <option value="6-8">6-8</option>
          <option value="9-12">9-12</option>
        </select>

        {/* PHASE-2 a11y issue NB-054 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            `lang="zz"` is not a valid BCP-47 subtag. axe-core
            `valid-lang` fires Serious (WCAG 3.1.2). SLED pattern: the
            "translations available" caption mis-spells the lang code. */}
        <span lang="zz" style={{ fontSize: 12 }}>Disponible en español</span>

        {/* PHASE-2 a11y issue NB-055 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Stray <dt> outside of any <dl>. axe-core `dlitem` fires
            Serious (WCAG 1.3.1). SLED pattern: stray markup leftover
            from a partial conversion to a card layout. */}
        <dt style={{ display: 'none' }}>District name</dt>

        {/* PHASE-2 a11y issue NB-056 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Enrollment <div role="meter"> with NO aria-label. axe-core
            `aria-meter-name` fires Critical (WCAG 1.1.1). SLED
            pattern: district capacity meters rendered as bars with
            external text labels. */}
        <div role="meter" aria-valuenow={1240} aria-valuemin={0} aria-valuemax={2000} style={{ height: 6, background: '#e5e7eb', maxWidth: 300, marginBottom: 12 }}>
          <div style={{ width: '62%', height: '100%', background: '#0a66c2' }} />
        </div>

        {/* PHASE-2 a11y issue NB-057 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Empty <span role="tooltip"> placeholder. axe-core
            `aria-tooltip-name` fires Serious (WCAG 4.1.2). SLED
            pattern: pre-mounted tooltip target nodes with no body. */}
        <span role="tooltip" id="schools-tip" />

        {/* PHASE-2 a11y issue NB-058 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            `aria-orientation="diagonal"` is not a permitted value.
            axe-core `aria-valid-attr-value` fires Critical (WCAG
            4.1.2). SLED pattern: devs guess orientation values to
            match visual layouts. */}
        <div role="separator" aria-orientation="diagonal" style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />

        {/* PHASE-2 a11y issue NB-059 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            <object data="..."> embed with NO fallback / aria-label /
            inner content. axe-core `object-alt` fires Serious (WCAG
            1.1.1). SLED pattern: districts embed SVG maps via
            <object> without textual fallback. */}
        <object data="/district-map.svg" type="image/svg+xml" width="200" height="80" />


        <div className="school-grid">
          {state.schools.map((s) => (
            <article key={s.id} className="school-card" aria-labelledby={`s-${s.id}`}>
              <h3 id={`s-${s.id}`}>{s.name}</h3>
              <div className="meta">Grades {s.grades} · {s.students} students</div>
              <dl>
                <dt>Principal</dt><dd>{s.principal}</dd>
                <dt>Address</dt><dd>{s.address}</dd>
                <dt>Phone</dt><dd>{s.phone}</dd>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="nbc-section alt" aria-labelledby="events-h">
        <h2 id="events-h" className="section-title">Upcoming district events</h2>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <ul className="activity-strip">
            <li><span>Back-to-school night at Cedarbrook Elementary</span><span className="when">Aug 28</span></li>
            <li><span>Birchwood Middle School open house</span><span className="when">Sep 6</span></li>
            <li><span>Northbrook High fall sports kickoff</span><span className="when">Sep 12</span></li>
            <li><span>Westwood Online Academy info session (virtual)</span><span className="when">Sep 15</span></li>
          </ul>
          {/* PHASE-2 a11y issue NB-004 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Icon-only PDF download anchor with NO text content, NO aria-label,
              NO title. Classic SLED audit finding: districts publish the
              student/parent handbook as a PDF, the redesign converts the link
              to a paperclip icon, and the accessible name vanishes. axe-core
              `link-name` fires Critical (WCAG 2.4.4). */}
          <p style={{ marginTop: 16, textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
            Student &amp; parent handbook (2026-2027):
            <a
              href="/nbps-handbook-2026.pdf"
              style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8, padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 4, verticalAlign: 'middle' }}
              onClick={(e) => e.preventDefault()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M9 18l3-3 3 3" />
                <path d="M12 15v-4" />
              </svg>
            </a>
          </p>
        </div>
      </section>

      {!isAuthenticated && (
        <section className="nbc-section" aria-labelledby="cta-h">
          <h2 id="cta-h" className="section-title">Ready to enroll?</h2>
          <p className="section-sub">
            Sign in with your Northbrook Connect account to start a new
            enrollment in about five minutes.
          </p>
          <div style={{ textAlign: 'center' }}>
            <Link className="btn btn-primary" to="/edu-gov/login">
              Sign in to begin
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
