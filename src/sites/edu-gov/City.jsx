import { Link } from 'react-router-dom';

/**
 * City of Cedarbrook — public home page.
 * Renders inside <PublicLayout>.
 */
export default function City() {
  return (
    <>
      <section className="nbc-hero" aria-labelledby="city-h">
        <div>
          <span className="nbc-pill">City of Cedarbrook</span>
          <h1 id="city-h">City of Cedarbrook</h1>
          <p className="sub">
            Your local government for the 32,000 residents of Cedarbrook —
            permits, voting, utilities, and community services in one place.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="btn btn-primary" to="/edu-gov/city/permits">Apply for a permit</Link>
            <Link className="btn btn-outline" to="/edu-gov/city/vote">Register to vote</Link>
          </div>
        </div>
        <div className="nbc-hero-visual" aria-hidden="true">
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="30" y="50" width="30" height="55" fill="rgba(255,255,255,0.16)" />
            <rect x="65" y="35" width="30" height="70" fill="rgba(255,255,255,0.20)" />
            <rect x="100" y="60" width="30" height="45" fill="rgba(255,255,255,0.16)" />
            <path d="M20 105h120" />
          </svg>
        </div>
      </section>

      <section className="nbc-section" aria-labelledby="mayor-h">
        <h2 id="mayor-h" className="section-title">A message from the mayor</h2>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontStyle: 'italic' }}>
            "Cedarbrook has always been a city that punches above its weight. As we
            kick off the new fiscal year, we are doubling investment in our parks,
            modernizing the permit office, and rolling out curbside compost
            citywide. I'm grateful for every resident who makes this city home."
          </p>
          <p style={{ marginTop: 12, fontWeight: 600, color: 'var(--brand-deep)' }}>
            — Mayor Linnea Ortega
          </p>
        </div>
      </section>

      <section className="nbc-section alt" aria-labelledby="city-svc-h">
        <h2 id="city-svc-h" className="section-title">City services</h2>
        <p className="section-sub">Most services are available online.</p>
        <div className="service-grid">
          <Link className="service-card" to="/edu-gov/city/permits">
            <div className="service-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
            </div>
            <h3>Permits</h3>
            <p>Building, electrical, plumbing, sign, and demolition permits.</p>
            <span className="count">Apply online</span>
          </Link>
          <Link className="service-card" to="/edu-gov/city/vote">
            <div className="service-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
            </div>
            <h3>Voter registration</h3>
            <p>Register, update your address, or look up your polling place.</p>
            <span className="count">Next election Nov 5</span>
          </Link>
          <Link className="service-card" to="/edu-gov/city">
            <div className="service-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M8 6V4h8v2" /></svg>
            </div>
            <h3>Trash &amp; recycling</h3>
            <p>Pickup schedules, holiday changes, and bulky waste.</p>
            <span className="count">Weekly pickup</span>
          </Link>
          <Link className="service-card" to="/edu-gov/city">
            <div className="service-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>
            </div>
            <h3>Utilities</h3>
            <p>Pay your water, sewer, and stormwater bill online.</p>
            <span className="count">Auto-pay available</span>
          </Link>
          <Link className="service-card" to="/edu-gov/city">
            <div className="service-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></svg>
            </div>
            <h3>Council meetings</h3>
            <p>Agendas, minutes, and live-streamed meetings.</p>
            <span className="count">2nd &amp; 4th Tuesdays</span>
          </Link>
          <Link className="service-card" to="/edu-gov/city">
            <div className="service-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5a2 2 0 0 1 2-2h3l2 4-2 1a11 11 0 0 0 6 6l1-2 4 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5z" /></svg>
            </div>
            <h3>311 / Report a problem</h3>
            <p>Report potholes, graffiti, missed pickups, and more.</p>
            <span className="count">24/7 reporting</span>
          </Link>
        </div>
      </section>

      <section className="nbc-section" aria-labelledby="council-h">
        <h2 id="council-h" className="section-title">Upcoming council meetings</h2>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <ul className="activity-strip">
            <li><span>Regular Council Meeting — FY budget hearing</span><span className="when">Sep 10, 7:00 PM</span></li>
            <li><span>Planning Commission — Birchwood rezoning</span><span className="when">Sep 17, 6:30 PM</span></li>
            <li><span>Regular Council Meeting — public comment open</span><span className="when">Sep 24, 7:00 PM</span></li>
          </ul>
        </div>
      </section>

      <section className="nbc-section alt" aria-labelledby="city-news-h">
        <h2 id="city-news-h" className="section-title">City news</h2>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <ul className="activity-strip">
            <li><span>Curbside compost rolls out citywide this fall</span><span className="when">Aug 30</span></li>
            <li><span>Cedar Park playground reopens after renovation</span><span className="when">Aug 22</span></li>
            <li><span>Free bike-safety classes every Saturday in September</span><span className="when">Aug 18</span></li>
          </ul>
        </div>
      </section>
    </>
  );
}
