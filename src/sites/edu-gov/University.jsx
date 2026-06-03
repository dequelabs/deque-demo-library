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

      <section className="nbc-section" aria-labelledby="why-h">
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
