import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Northbrook State Services hub — public.
 * Renders inside <PublicLayout>.
 */
export default function Services() {
  const [formSearch, setFormSearch] = useState('');
  const [apptId, setApptId] = useState('');

  return (
    <>
      <section className="nbc-hero" aria-labelledby="svc-h">
        <div>
          <span className="nbc-pill">Northbrook State Services</span>
          <h1 id="svc-h">State services, simplified.</h1>
          <p className="sub">
            One sign-in for the DMV, benefits, taxes, permits, and public records
            across all of Northbrook State.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="btn btn-primary" to="/edu-gov/services/dmv">Renew vehicle</Link>
            <Link className="btn btn-outline" to="/edu-gov/services/benefits">Check benefits</Link>
          </div>
        </div>
        <div className="nbc-hero-visual" aria-hidden="true">
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="20" y="35" width="120" height="60" rx="8" fill="rgba(255,255,255,0.16)" />
            <path d="M30 55h100M30 75h60" />
          </svg>
        </div>
      </section>

      <section className="nbc-section" aria-labelledby="svc-grid-h">
        {/* PHASE-2 a11y issue NB-110 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Service-hub hero icon <img> with NO alt attribute. axe-core
            `image-alt` fires Critical (WCAG 1.1.1). SLED pattern: hub
            mastheads ship without alt during rebrand. */}
        <img src="/services-hub.svg" width="64" height="64" style={{ display: 'block', margin: '0 auto 16px' }} />

        <h2 id="svc-grid-h" className="section-title">Browse services</h2>
        <p className="section-sub">Pick a category to get started.</p>

        {/* PHASE-2 a11y issue NB-111 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Agency filter <select> with NO label or aria-label. axe-core
            `select-name` fires Critical (WCAG 4.1.2). */}
        <select defaultValue="" style={{ marginRight: 8 }}>
          <option value="" disabled>Agency…</option>
          <option value="dmv">DMV</option>
          <option value="dor">Department of Revenue</option>
        </select>

        {/* PHASE-2 a11y issue NB-112 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            "Click here" link with non-descriptive accessible name —
            wait, link-name fires only when there is NO name. Use empty
            anchor instead. axe-core `link-name` fires Critical (WCAG
            2.4.4). SLED pattern: anchor with only an aria-hidden icon. */}
        <a href="/services" onClick={(e) => e.preventDefault()} style={{ marginLeft: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" />
          </svg>
        </a>

        {/* PHASE-2 a11y issue NB-113 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Icon-only "favorite" button with NO accessible name. axe-core
            `button-name` fires Critical (WCAG 4.1.2). */}
        <button type="button" style={{ background: 'none', border: '1px solid var(--border)', padding: 6, marginLeft: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" />
          </svg>
        </button>

        {/* PHASE-2 a11y issue NB-114 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            "Service activity" <svg role="img"> with NO <title>. axe-core
            `svg-img-alt` fires Serious (WCAG 1.1.1). */}
        <svg role="img" width="80" height="24" viewBox="0 0 80 24" style={{ verticalAlign: 'middle', marginLeft: 8 }}>
          <polyline points="0,20 20,12 40,16 60,6 80,10" fill="none" stroke="#0a66c2" strokeWidth="2" />
        </svg>

        {/* PHASE-2 a11y issue NB-115 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            <div role="listbox"> with plain <div> children (no
            role="option"). axe-core `aria-required-children` fires
            Critical (WCAG 1.3.1). */}
        <div role="listbox" aria-label="Sort services" style={{ border: '1px solid var(--border)', borderRadius: 6, maxWidth: 240, marginTop: 8 }}>
          <div style={{ padding: 6 }}>Most popular</div>
          <div style={{ padding: 6 }}>Recently added</div>
        </div>

        {/* PHASE-2 a11y issue NB-116 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Empty <span role="tooltip">. axe-core `aria-tooltip-name`
            fires Serious (WCAG 4.1.2). */}
        <span role="tooltip" id="svc-tip" />

        {/* PHASE-2 a11y issue NB-117 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            `lang="qq"` is not a valid BCP-47 subtag. axe-core
            `valid-lang` fires Serious (WCAG 3.1.2). */}
        <span lang="qq" style={{ fontSize: 12, marginLeft: 8 }}>Servicios en español</span>

        {/* PHASE-2 a11y issue NB-118 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Stray <dt> outside any <dl>. axe-core `dlitem` fires Serious
            (WCAG 1.3.1). */}
        <dt style={{ display: 'none' }}>Agency</dt>

        {/* PHASE-2 a11y issue NB-119 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            "Avg wait" rendered in pale taupe (#cdbf9f on #fff ~2.0:1).
            axe-core `color-contrast` fires Serious (WCAG 1.4.3). */}
        <p style={{ color: '#cdbf9f', background: '#ffffff', fontSize: 13 }}>
          Average wait time: 12 minutes
        </p>

        {/* PHASE-2 a11y issue NB-120 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Wait-time <div role="meter"> with NO accessible name.
            axe-core `aria-meter-name` fires Critical (WCAG 1.1.1). */}
        <div role="meter" aria-valuenow={12} aria-valuemin={0} aria-valuemax={60} style={{ height: 6, background: '#e5e7eb', maxWidth: 240, margin: '8px 0' }}>
          <div style={{ width: '20%', height: '100%', background: '#0a66c2' }} />
        </div>

        {/* PHASE-2 a11y issue NB-121 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            `aria-orientation="diagonal"` is not a permitted value.
            axe-core `aria-valid-attr-value` fires Critical (WCAG 4.1.2). */}
        <div role="separator" aria-orientation="diagonal" style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />

        {/* PHASE-2 a11y issue NB-122 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            `autocomplete="agency"` is not a valid HTML autofill token.
            axe-core `autocomplete-valid` fires Serious (WCAG 1.3.5). */}
        <input type="text" aria-label="Agency search" autoComplete="agency" placeholder="Search agencies" style={{ padding: '6px 10px', marginBottom: 12 }} />

        <div className="service-grid">
          <Link className="service-card" to="/edu-gov/services/dmv">
            <div className="service-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="7" width="18" height="10" rx="2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>
            </div>
            <h3>DMV</h3>
            <p>License renewals, vehicle registration, and title transfers.</p>
            <span className="count">12 services</span>
          </Link>
          <Link className="service-card" to="/edu-gov/services/benefits">
            <div className="service-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l8 4v5c0 4-3 8-8 9-5-1-8-5-8-9V7z" /></svg>
            </div>
            <h3>Benefits</h3>
            <p>SNAP, Medicaid, energy assistance, and more.</p>
            <span className="count">8 programs</span>
          </Link>
          <Link className="service-card" to="/edu-gov/services">
            <div className="service-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h11l5 5v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M16 3v5h5" /></svg>
            </div>
            <h3>Tax filing</h3>
            <p>File state income tax and check refund status.</p>
            <span className="count">Tax season open</span>
          </Link>
          <Link className="service-card" to="/edu-gov/city/permits">
            <div className="service-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
            </div>
            <h3>Permits</h3>
            <p>Building, electrical, and event permits.</p>
            <span className="count">Apply online</span>
          </Link>
          <Link className="service-card" to="/edu-gov/services">
            <div className="service-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M16 16l5 5" /></svg>
            </div>
            <h3>Public records</h3>
            <p>Request birth, death, marriage, and property records.</p>
            <span className="count">Records request</span>
          </Link>
          <Link className="service-card" to="/edu-gov/city">
            <div className="service-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18" /><path d="M5 21V8l7-5 7 5v13" /></svg>
            </div>
            <h3>Local services</h3>
            <p>Find services from your city or county.</p>
            <span className="count">All cities</span>
          </Link>
        </div>
      </section>

      <section className="nbc-section alt" aria-labelledby="quick-h">
        <h2 id="quick-h" className="section-title">Quick links</h2>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <form
            className="card"
            onSubmit={(e) => { e.preventDefault(); }}
            aria-label="Find a state form"
          >
            <div className="form-row" style={{ margin: 0 }}>
              <label htmlFor="form-search">Find a state form</label>
              <input
                id="form-search"
                type="search"
                value={formSearch}
                onChange={(e) => setFormSearch(e.target.value)}
                placeholder="e.g. DL-44, tax extension"
              />
              <p className="form-help">Search across 340+ state agency forms.</p>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }}>
              Search forms
            </button>
          </form>

          <form
            className="card"
            onSubmit={(e) => { e.preventDefault(); }}
            aria-label="Check appointment status"
          >
            <div className="form-row" style={{ margin: 0 }}>
              <label htmlFor="appt-id">Check appointment status</label>
              <input
                id="appt-id"
                type="text"
                value={apptId}
                onChange={(e) => setApptId(e.target.value)}
                placeholder="Confirmation number"
              />
              <p className="form-help">Enter the confirmation number from your email.</p>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }}>
              Check status
            </button>
          </form>
        </div>
      </section>

      <section className="nbc-section" aria-labelledby="updates-h">
        <h2 id="updates-h" className="section-title">Recent updates</h2>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <ul className="activity-strip">
            <li><span>DMV offices closed for holiday on Sep 2</span><span className="when">Aug 29</span></li>
            <li><span>Online renewal fees reduced by 10% through Oct 31</span><span className="when">Aug 15</span></li>
            <li><span>New Spanish-language SNAP application now available</span><span className="when">Aug 1</span></li>
          </ul>
        </div>
      </section>

      <section className="nbc-section alt" aria-labelledby="faq-h">
        <h2 id="faq-h" className="section-title">Frequently asked questions</h2>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <details className="faq-item">
            <summary>Do I need a Northbrook Connect account?</summary>
            <div className="faq-answer">
              Most services are accessible without an account, but signing in
              lets you save progress, pre-fill forms, and track applications.
            </div>
          </details>
          <details className="faq-item">
            <summary>How long do online renewals take?</summary>
            <div className="faq-answer">
              Most renewals are processed within 5 business days. You'll receive
              an email when your new credentials are issued.
            </div>
          </details>
          <details className="faq-item">
            <summary>What forms of payment are accepted?</summary>
            <div className="faq-answer">
              We accept Visa, Mastercard, Discover, and ACH transfer from any US
              bank account. A small convenience fee applies to credit cards.
            </div>
          </details>
        </div>
      </section>
    </>
  );
}
