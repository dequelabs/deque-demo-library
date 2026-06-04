import { Link } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import { useStore } from './store.jsx';

/**
 * Northbrook Connect public homepage.
 * Clean accessible baseline. Phase 2 will surgically introduce documented
 * issues — see ACCESSIBILITY_ISSUES.md (TBD for edu-gov).
 */
export default function Home() {
  const { isAuthenticated, citizen } = useAuth();
  const { state } = useStore();

  const schoolsCount = state.schools.length;
  const childrenCount = state.children.length;
  const vehiclesCount = state.vehicles.length;
  const coursesCount = state.courses.length;

  return (
    <>
      <section className="nbc-hero" aria-labelledby="hero-heading">
        <div>
          {/* PHASE-2 a11y issue NB-010 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Eyebrow pill uses a low-contrast grey (#a8a8a8 on white) ~2.5:1.
              axe-core `color-contrast` fires Serious (WCAG 1.4.3). SLED
              audit pattern: brand "eyebrow" pills get washed out when a
              designer lifts colour from a dark-mode mock without retesting. */}
          <span className="nbc-pill" style={{ color: '#a8a8a8', background: '#ffffff' }}>Northbrook State Portal</span>
          <h1 id="hero-heading">Your state, one login.</h1>
          {/* PHASE-2 a11y issue NB-011 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Decorative-looking hero badge <img> ships with NO alt attribute.
              axe-core `image-alt` fires Critical (WCAG 1.1.1). SLED pattern:
              state seals slip in at the last minute via CMS upload and the
              authoring template never asks for alt text. */}
          <img src="/nb-state-badge.png" width="48" height="48" />
          <p className="sub">
            Manage K-12 enrollment, public university courses, vehicle
            registration, benefits, and city permits — all in one place,
            with one account.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              className="btn btn-primary"
              to={isAuthenticated ? '/edu-gov/account' : '/edu-gov/login'}
            >
              {isAuthenticated ? `Continue as ${citizen.firstName}` : 'Sign in or create account'}
            </Link>
            <Link className="btn btn-outline" to="/edu-gov/schools">
              Browse public schools
            </Link>
            {/* PHASE-2 a11y issue NB-012 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                Icon-only header utility button (mobile menu toggle) has NO
                accessible name. axe-core `button-name` fires Critical
                (WCAG 4.1.2). Common SLED finding when a designer swaps a
                text "Menu" button for a hamburger SVG mid-sprint. */}
            <button type="button" style={{ background: 'none', border: 'none', padding: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="nbc-hero-visual" aria-hidden="true">
          <svg width="180" height="140" viewBox="0 0 180 140" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 120 L60 50 L95 90 L120 60 L170 120 Z" fill="rgba(255,255,255,0.16)" />
            <path d="M10 120 L170 120" />
            <circle cx="140" cy="35" r="14" fill="rgba(255,255,255,0.20)" />
          </svg>
        </div>
      </section>

      <section className="nbc-section" aria-labelledby="services-heading">
        <h2 id="services-heading" className="section-title">Find what you need</h2>
        <p className="section-sub">
          Four service areas, one login. Click through to get started.
        </p>

        {/* PHASE-2 a11y issue NB-013 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            "Find a service" quick-jump <select> has NO associated label or
            aria-label. axe-core `select-name` fires Critical (WCAG 4.1.2).
            SLED audit pattern: dropdowns rendered without visible labels
            relying on a placeholder option, which doesn't satisfy SR users. */}
        <div style={{ maxWidth: 360, margin: '0 auto 20px' }}>
          <select defaultValue="">
            <option value="" disabled>Jump to a service…</option>
            <option value="schools">K-12 schools</option>
            <option value="university">State university</option>
            <option value="dmv">DMV</option>
          </select>
        </div>

        {/* PHASE-2 a11y issue NB-014 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Inline mini-chart <svg role="img"> with NO <title> or aria-label.
            axe-core `svg-img-alt` fires Serious (WCAG 1.1.1). SLED pattern:
            dashboards drop in informational sparklines from a charting
            library that strips titles during SVG optimisation. */}
        <svg role="img" width="120" height="36" viewBox="0 0 120 36" style={{ display: 'block', margin: '0 auto 16px' }}>
          <polyline points="0,30 20,20 40,24 60,10 80,16 100,6 120,12" fill="none" stroke="#0a66c2" strokeWidth="2" />
        </svg>

        {/* PHASE-2 a11y issue NB-015 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            "Popular services" <div role="listbox"> with <div> children that
            lack role="option". axe-core `aria-required-children` fires
            Critical (WCAG 1.3.1). Realistic SLED finding when devs roll
            their own combobox without reading the ARIA pattern. */}
        <div role="listbox" aria-label="Popular services" style={{ maxWidth: 360, margin: '0 auto 16px', border: '1px solid var(--border)', borderRadius: 6 }}>
          <div style={{ padding: 8 }}>Renew vehicle registration</div>
          <div style={{ padding: 8 }}>Apply for SNAP benefits</div>
          <div style={{ padding: 8 }}>Request birth certificate</div>
        </div>

        <div className="service-grid">
          <Link to="/edu-gov/schools" className="service-card">
            <span className="service-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l10 6-10 6L2 9l10-6z" /><path d="M6 11v6c3 2 9 2 12 0v-6" /></svg>
            </span>
            <h3>K-12 schools</h3>
            <p>Online enrollment, grade portal, transcripts, school directory.</p>
            <span className="count">{schoolsCount} schools</span>
          </Link>

          <Link to="/edu-gov/university" className="service-card">
            <span className="service-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7l10 5 10-5-10-5-10 5z" /><path d="M6 10v6c2 2 10 2 12 0v-6" /></svg>
            </span>
            <h3>State university</h3>
            <p>Course catalog, registration, financial aid, transcripts.</p>
            <span className="count">{coursesCount} courses this term</span>
          </Link>

          <Link to="/edu-gov/services" className="service-card">
            <span className="service-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 14h8" /></svg>
            </span>
            <h3>State services</h3>
            <p>DMV, vehicle registration, benefits enrollment, voter records.</p>
            <span className="count">{vehiclesCount} vehicles on file</span>
          </Link>

          <Link to="/edu-gov/city" className="service-card">
            <span className="service-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V8l7-5 7 5v13" /></svg>
            </span>
            <h3>City services</h3>
            <p>Building permits, trash &amp; recycling, parking, parks bookings.</p>
            <span className="count">{childrenCount} household members</span>
          </Link>
        </div>
      </section>

      {/* PHASE-2 a11y issue NB-187 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          Decorative ornament SVG served with verbose alt text. The image
          is purely a gold-toned brand divider — no content meaning — but
          its alt verbosely describes the shapes. axe DevTools Pro
          Advanced `image-decorative` AI classifier recognises the
          decorative intent and flags the over-described alt. Minor
          (WCAG 1.1.1). Realistic SLED pattern: brand decorative elements
          get accidentally described instead of being marked alt="". */}
      <img
        src="/ornament-divider.svg"
        alt="A delicate horizontal gold-toned civic ornamental divider featuring three centered dot and ring motifs flanked by tapered horizontal lines, evoking classic state seal imagery"
        style={{ display: 'block', margin: '0 auto', maxWidth: 400, height: 'auto' }}
      />

      {/* PHASE-2 a11y issue NB-186 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          "What's new this month" rendered as a styled <div> (24 px / 700 /
          brand-deep / centered) — visually a section heading but
          semantically not. axe DevTools Pro Advanced `heading-markup`
          (uses AI / CV) detects the visual heading pattern and reports
          the missing semantic markup. Serious (WCAG 1.3.1). Realistic
          gov-portal pattern: editorial section titles styled by CSS
          instead of using the heading toolbar in the CMS. */}
      <section className="nbc-section">
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--brand-deep)',
            textAlign: 'center',
            margin: '0 0 8px',
          }}
        >
          What's new this month
        </div>
        <p className="section-sub">
          Quick announcements from across Northbrook State agencies.
        </p>
      </section>

      {/* PHASE-2 a11y issue NB-189 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          "Apply for SNAP, Medicaid, or LIHEAP this month" banner with
          near-white text over a sand-to-white gradient. axe-core
          `color-contrast` can't resolve the bg deterministically (it's a
          gradient) so the finding lands in Needs Review; the Pro
          Advanced `text-contrast` rule runs a screenshot pass and
          reports it as a Serious automatic violation (WCAG 1.4.3).
          Realistic SLED pattern: state-benefit promo banners use brand
          gradients without designer contrast checks. */}
      <div
        style={{
          background: 'linear-gradient(90deg, #f4f1e6 0%, #ffffff 100%)',
          color: '#ffffff',
          textAlign: 'center',
          padding: '10px 16px',
          fontSize: 14,
          fontWeight: 600,
          margin: '0 auto 24px',
          maxWidth: 760,
          borderRadius: 6,
        }}
      >
        Apply for SNAP, Medicaid, or LIHEAP this month — find out if you qualify.
      </div>

      <section className="nbc-section alt" aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="section-title">Around the state</h2>
        <p className="section-sub">Recent updates from Northbrook agencies.</p>

        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <ul className="activity-strip">
            <li>
              <span>School year 2026–27 enrollment is now open for all four districts.</span>
              <span className="when">2 days ago</span>
            </li>
            <li>
              <span>DMV vehicle renewal is now fully online — no in-person visit required.</span>
              <span className="when">1 week ago</span>
            </li>
            <li>
              <span>Voter registration deadline for the fall primary is September 14.</span>
              <span className="when">2 weeks ago</span>
            </li>
            <li>
              <span>Northbrook State University spring 2027 catalog is now available.</span>
              <span className="when">3 weeks ago</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="nbc-section" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="section-title">Frequently asked</h2>

        {/* PHASE-2 a11y issue NB-016 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Disclosure button uses aria-expanded="yes" instead of "true".
            axe-core `aria-valid-attr-value` fires Critical (WCAG 4.1.2).
            SLED pattern: designers/devs translate "yes/no" verbally into
            attribute values and ship the wrong literal. */}
        <button type="button" aria-expanded="yes" style={{ display: 'block', margin: '0 auto 12px', background: 'none', border: '1px solid var(--border)', padding: '6px 12px' }}>
          See more FAQs
        </button>

        {/* PHASE-2 a11y issue NB-017 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Page-progress indicator <div role="progressbar"> with NO
            aria-label / aria-labelledby. axe-core `aria-progressbar-name`
            fires Critical (WCAG 1.1.1). SLED pattern: "X% of citizens have
            completed their profile" hero widget that ships without a name. */}
        <div role="progressbar" aria-valuenow={62} aria-valuemin={0} aria-valuemax={100} style={{ height: 8, background: '#e5e7eb', maxWidth: 360, margin: '0 auto 12px' }}>
          <div style={{ width: '62%', height: '100%', background: '#0a66c2' }} />
        </div>

        {/* PHASE-2 a11y issue NB-018 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Empty <span role="tooltip"> placeholder. axe-core
            `aria-tooltip-name` fires Serious (WCAG 4.1.2). SLED pattern:
            tooltip nodes get pre-rendered for hydration and the content
            string is bound later — but the empty node still trips axe. */}
        <span role="tooltip" id="home-tip" style={{ display: 'none' }} />

        {/* PHASE-2 a11y issue NB-019 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Stray <dt> outside of any <dl>. axe-core `dlitem` fires
            Serious (WCAG 1.3.1). SLED pattern: a CMS author copy-pastes
            a definition term out of a richer block and the surrounding
            <dl> never makes it across. */}
        <dt style={{ display: 'none' }}>Helpful term</dt>

        {/* PHASE-2 a11y issue NB-020 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            `lang="xyz"` is not a valid BCP-47 tag. axe-core `valid-lang`
            fires Serious (WCAG 3.1.2). SLED pattern: editors mark up
            multilingual snippets but mis-spell the language subtag
            (often "esp", "frn", "xyz" during testing). */}
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
          <span lang="xyz">Bienvenido a Northbrook Connect.</span>
        </p>

        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <details className="faq-item">
            <summary>Do I need a separate login for each service?</summary>
            <div className="faq-answer">
              No. Your Northbrook Connect account works across schools, the state
              university, state services, and city services.
            </div>
          </details>
          <details className="faq-item">
            <summary>How do I add a child to my account?</summary>
            <div className="faq-answer">
              Sign in, go to <Link to="/edu-gov/schools/enroll">Online enrollment</Link>,
              and complete the 3-step form. Most enrollments are confirmed within
              two business days.
            </div>
          </details>
          <details className="faq-item">
            <summary>Is this portal accessible?</summary>
            <div className="faq-answer">
              Northbrook Connect is built to meet WCAG 2.2 AA. If you encounter a
              barrier, please use the accessibility contact link in the footer.
            </div>
          </details>

          {/* PHASE-2 a11y issue NB-021 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Empty social/follow anchor (icon stripped) with NO text, NO
              aria-label, NO title. axe-core `link-name` fires Critical
              (WCAG 2.4.4). SLED pattern: footer social row uses CSS
              background-image icons; once aria-label is forgotten the link
              becomes nameless. */}
          <p style={{ marginTop: 24, textAlign: 'center' }}>
            <a href="https://example.gov/follow" onClick={(e) => e.preventDefault()} style={{ display: 'inline-block', width: 24, height: 24, border: '1px solid var(--border)', borderRadius: 4 }}></a>
          </p>

          {/* PHASE-2 a11y issue NB-022 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Newsletter signup uses autoComplete="emailaddr" — not a valid
              WHATWG token. axe-core `autocomplete-valid` fires Serious
              (WCAG 1.3.5). SLED pattern: marketing teams write semantic
              guesses for autocomplete strings rather than spec values. */}
          <form style={{ marginTop: 12, textAlign: 'center' }} onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="nb-news-email" style={{ display: 'block', marginBottom: 6 }}>Email for state updates</label>
            <input id="nb-news-email" type="email" autoComplete="emailaddr" />
          </form>
        </div>
      </section>
    </>
  );
}
