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
        <h2 id="svc-grid-h" className="section-title">Browse services</h2>
        <p className="section-sub">Pick a category to get started.</p>
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
