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
          {/* PHASE-2 a11y issue NB-147 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Mayor headshot <img> with NO alt attribute. axe-core
              `image-alt` fires Critical (WCAG 1.1.1). SLED pattern: city
              home pages show mayor/council photos without alt text. */}
          <img src="/mayor-ortega.jpg" width="96" height="96" style={{ borderRadius: '50%' }} />
          <p style={{ fontStyle: 'italic' }}>
            "Cedarbrook has always been a city that punches above its weight. As we
            kick off the new fiscal year, we are doubling investment in our parks,
            modernizing the permit office, and rolling out curbside compost
            citywide. I'm grateful for every resident who makes this city home."
          </p>
          <p style={{ marginTop: 12, fontWeight: 600, color: 'var(--brand-deep)' }}>
            — Mayor Linnea Ortega
          </p>
          {/* PHASE-2 a11y issue NB-148 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              "Find a service" <select> with no label / aria-label.
              axe-core `select-name` fires Critical (WCAG 4.1.2). SLED
              pattern: city-home service filter selects ship unlabeled. */}
          <select style={{ marginTop: 12 }}>
            <option>Find a service…</option>
            <option>Permits</option>
            <option>Voting</option>
            <option>Trash</option>
          </select>

          {/* PHASE-2 a11y issue NB-149 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Empty "Click here" anchor with NO accessible text. axe-core
              `link-name` fires Critical (WCAG 2.4.4). SLED pattern: empty
              decorative links remain after a CMS migration. */}
          <a href="/city/about" onClick={(e) => e.preventDefault()} aria-label="" style={{ marginLeft: 8 }} />

          {/* PHASE-2 a11y issue NB-150 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Icon-only social-share button with NO accessible name.
              axe-core `button-name` fires Critical (WCAG 4.1.2). SLED
              pattern: social-share toolbars use icon-only buttons. */}
          <button type="button" style={{ background: 'none', border: '1px solid var(--border)', padding: 6, marginLeft: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
            </svg>
          </button>

          {/* PHASE-2 a11y issue NB-151 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              City-emblem <svg role="img"> with NO <title>. axe-core
              `svg-img-alt` fires Serious (WCAG 1.1.1). SLED pattern: city
              emblems ship as inline SVG with no textual equivalent. */}
          <svg role="img" width="40" height="40" viewBox="0 0 40 40" style={{ verticalAlign: 'middle', marginLeft: 8 }}>
            <circle cx="20" cy="20" r="18" fill="#0a66c2" />
            <path d="M12 22l8-10 8 10" stroke="#fff" strokeWidth="2" fill="none" />
          </svg>

          {/* PHASE-2 a11y issue NB-152 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              <div role="listbox"> with no role="option" children. axe-core
              `aria-required-children` fires Critical (WCAG 1.3.1). SLED
              pattern: empty listbox stubs remain after a state change. */}
          <div role="listbox" aria-label="Quick services" style={{ display: 'inline-flex', gap: 4 }}>
            <span>Permits</span>
            <span>Vote</span>
          </div>

          {/* PHASE-2 a11y issue NB-153 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              `lang="qq"` is not a valid BCP-47 primary subtag. axe-core
              `valid-lang` fires Serious (WCAG 3.1.2). SLED pattern:
              translated city slogans get placeholder lang codes. */}
          <span lang="qq" style={{ fontSize: 12, marginLeft: 8 }}>Civitas Cedarbrook</span>

          {/* PHASE-2 a11y issue NB-154 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Stray <dt> outside any <dl>. axe-core `dlitem` fires Serious
              (WCAG 1.3.1). SLED pattern: leftover dt from a converted
              card. */}
          <dt style={{ display: 'none' }}>Population</dt>

          {/* PHASE-2 a11y issue NB-155 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Pale-taupe caption (#cdbf9f on #fff ~2.0:1). axe-core
              `color-contrast` fires Serious (WCAG 1.4.3). SLED pattern:
              city-page captions use brand-tint text on white. */}
          <p style={{ color: '#cdbf9f', background: '#ffffff', fontSize: 13, margin: '4px 0 0' }}>
            Mayor's office, City Hall — 100 Cedar Ave
          </p>

          {/* PHASE-2 a11y issue NB-156 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Air-quality <div role="meter"> with NO accessible name.
              axe-core `aria-meter-name` fires Critical (WCAG 1.1.1). SLED
              pattern: city dashboards show AQI as bar without naming. */}
          <div role="meter" aria-valuenow={42} aria-valuemin={0} aria-valuemax={500} style={{ height: 6, background: '#e5e7eb', maxWidth: 240, margin: '8px 0' }}>
            <div style={{ width: '8%', height: '100%', background: '#0a66c2' }} />
          </div>

          {/* PHASE-2 a11y issue NB-157 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              autoComplete="address-zip" is not a valid WHATWG token.
              axe-core `autocomplete-valid` fires Serious (WCAG 1.3.5).
              SLED pattern: city-home address inputs use invented
              autocomplete tokens. */}
          <input type="text" autoComplete="address-zip" placeholder="ZIP" style={{ display: 'none' }} />

          {/* PHASE-2 a11y issue NB-158 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              <object> with NO accessible name (no aria-label / title /
              fallback). axe-core `object-alt` fires Serious (WCAG 1.1.1).
              SLED pattern: embedded SVG/PDF assets ship without
              alternative text. */}
          <object data="/city-seal.svg" type="image/svg+xml" style={{ display: 'none' }} />

          {/* PHASE-2 a11y issue NB-159 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Empty <span role="tooltip"> placeholder. axe-core
              `aria-tooltip-name` fires Serious (WCAG 4.1.2). SLED
              pattern: tooltip mount nodes ship with no body. */}
          <span role="tooltip" id="city-tip" />
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
          {/* PHASE-2 a11y issue NB-008 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Three "Read more" links share identical accessible names but
              point to different destinations (budget / rezoning / comment).
              A screen-reader user pulling up the links list sees three
              identical entries and can't tell them apart. axe-core
              `identical-links-same-purpose` (Minor, Best Practice) surfaces
              this as a Needs-Review finding by default and a Best-Practice
              violation when BP is ON. Classic gov-portal pattern. */}
          <ul className="activity-strip">
            <li>
              <span>Regular Council Meeting — FY budget hearing</span>
              <span className="when">Sep 10, 7:00 PM</span>
              <a href="/city/meetings/budget-hearing" style={{ marginLeft: 12 }}>Read more</a>
            </li>
            <li>
              <span>Planning Commission — Birchwood rezoning</span>
              <span className="when">Sep 17, 6:30 PM</span>
              <a href="/city/meetings/birchwood-rezoning" style={{ marginLeft: 12 }}>Read more</a>
            </li>
            <li>
              <span>Regular Council Meeting — public comment open</span>
              <span className="when">Sep 24, 7:00 PM</span>
              <a href="/city/meetings/public-comment" style={{ marginLeft: 12 }}>Read more</a>
            </li>
          </ul>
        </div>
      </section>

      {/* PHASE-2 a11y issue NB-IGT-003 (Structure IGT) — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          Orphan <section> with no aria-label, no aria-labelledby, and no
          heading inside. The Structure IGT verifies that every region
          landmark has an accessible name. axe-core's region rule may
          flag this in Needs Review. */}
      <section style={{ maxWidth: 720, margin: '0 auto 24px', padding: 12 }}>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
          City Hall is closed on state holidays and the day after Thanksgiving.
        </p>
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
