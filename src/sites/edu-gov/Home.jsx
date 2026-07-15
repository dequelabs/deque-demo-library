import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import { useStore } from './store.jsx';

/**
 * Northbrook Connect public homepage — City of Merced 1:1 visual mirror.
 *
 * Layout (top to bottom):
 *   1. Full-bleed hero photo with overlay title + featured-project card
 *   2. Quick-actions gold-circle row (6 primary citizen tasks)
 *   3. "Help Shape Your Northbrook" app-promo band
 *   4. Events & Meetings (calendar + upcoming list)
 *   5. Ornament divider + SNAP/Medicaid promo banner
 *   6. News cards (3 recent items with state-seal thumbnails)
 *   7. Access Hub carousel (5 destination tiles)
 *   8. Stay Connected newsletter + social row
 *
 * All 18 Phase-2 a11y issues from the previous scroll layout are preserved
 * in new locations: NB-010..022 (axe-core WCAG), NB-186/187/189 (Pro
 * Advanced), NB-IGT-010/016 (IGT). See NORTHBROOK_ACCESSIBILITY_ISSUES.md.
 */
export default function Home() {
  const { isAuthenticated, citizen } = useAuth();
  const { state } = useStore();
  const [email, setEmail] = useState('');

  const quickActions = [
    { icon: '📋', label: 'Renew Vehicle Registration', to: '/edu-gov/services' },
    { icon: '🎓', label: 'Enroll Your Student', to: '/edu-gov/schools/enroll' },
    { icon: '💰', label: 'Pay Property Tax', to: '/edu-gov/services' },
    { icon: '🏗️', label: 'File a Permit', to: '/edu-gov/city/permits' },
    { icon: '🗳️', label: 'Voter Registration', to: '/edu-gov/city/vote' },
    { icon: '♻️', label: 'Trash & Recycling', to: '/edu-gov/city' },
  ];

  const meetings = [
    { month: 'JUL', day: '20', title: 'City Council Meeting', time: '06:00 PM' },
    { month: 'JUL', day: '22', title: 'Planning Commission Meeting', time: '06:00 PM - 10:00 PM' },
    { month: 'JUL', day: '25', title: 'School Board Meeting', time: '07:00 PM' },
  ];

  const newsCards = [
    { title: 'School Year 2026–27 enrollment is now open for all four districts.' },
    { title: 'DMV vehicle renewal is now fully online — no in-person visit required.' },
    { title: 'Voter registration deadline for the fall primary is September 14.' },
  ];

  const accessHub = [
    { title: 'Engage Northbrook', desc: 'Share your ideas and contribute to the future of the state.' },
    { title: 'Northbrook Connect', desc: 'Your hub for the latest updates and services.' },
    { title: 'Civic Access', desc: 'Submit applications for permits, planning, or business licenses.' },
    { title: 'Subscribe Northbrook', desc: 'Select from various topics that interest you to be kept informed.' },
    { title: 'Financial Analysis', desc: 'Explore the state\'s budget and actual data online.' },
  ];

  return (
    <>
      {/* ========================================================
         HERO — full-bleed photo with overlay card + carousel controls
         ======================================================== */}
      <section className="merced-hero" aria-labelledby="hero-heading">
        <img
          src="https://images.unsplash.com/photo-1652409647827-2968023f2b6d?q=80&w=3000&auto=format&fit=crop"
          alt=""
          className="merced-hero-bg"
        />

        {/* Carousel dots + pause control */}
        <div className="merced-hero-carousel">
          {/* PHASE-2 a11y issue NB-012 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Icon-only carousel pause button has no accessible name. axe-core
              `button-name` fires Critical (WCAG 4.1.2). Common SLED finding
              when a designer swaps a text "Pause" button for a symbol
              mid-sprint. */}
          <button type="button" className="carousel-pause">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          </button>
          <div className="carousel-dots" aria-hidden="true">
            <span className="dot dot--active" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>

        <h1 id="hero-heading" className="merced-hero-title">
          <span className="merced-hero-title-small">WELCOME TO —</span>
          <span className="merced-hero-title-large">IMAGINE NORTHBROOK</span>
        </h1>

        <div className="merced-hero-card">
          {/* PHASE-2 a11y issue NB-010 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Eyebrow pill uses low-contrast grey (#a8a8a8 on white) ~2.5:1.
              axe-core `color-contrast` fires Serious (WCAG 1.4.3). */}
          <span className="nbc-pill" style={{ color: '#a8a8a8', background: '#ffffff' }}>
            Featured project
          </span>
          <h2 className="merced-hero-card-title">General Plan Project Site</h2>
          <p>
            Imagine Northbrook marks the beginning of an exciting new chapter for
            the state.
          </p>

          {/* PHASE-2 a11y issue NB-IGT-016 (Reading Order IGT) — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              CTA pair uses `flexDirection: 'row-reverse'`. Visual order
              (Sign in, then Learn More) is REVERSE of DOM order. Reading
              Order IGT walks the SE through DOM-vs-visual verification. */}
          <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap' }}>
            <Link
              className="btn btn-primary btn--gold"
              to={isAuthenticated ? '/edu-gov/account' : '/edu-gov/login'}
            >
              {isAuthenticated ? `Continue as ${citizen.firstName}` : 'Sign in or create account'}
            </Link>
            <Link className="btn btn-outline" to="/edu-gov/schools">
              Learn more
            </Link>
          </div>
        </div>

        {/* PHASE-2 a11y issue NB-011 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Decorative-looking hero badge <img> ships with NO alt attribute.
            axe-core `image-alt` fires Critical (WCAG 1.1.1). SLED pattern:
            state seals slip in at the last minute via CMS upload with the
            authoring template never asking for alt text. */}
        <img src="/nb-state-badge.png" width="48" height="48" className="merced-hero-badge" />
      </section>

      {/* ========================================================
         QUICK ACTIONS — 6 gold circular tiles
         ======================================================== */}
      <section className="merced-quick-actions" aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="sr-only">Quick actions</h2>

        {/* PHASE-2 a11y issue NB-013 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            "Jump to a service" <select> has NO label, aria-label, or title.
            axe-core `select-name` fires Critical (WCAG 4.1.2). */}
        <div className="quick-actions-jump">
          <select defaultValue="" className="quick-actions-select">
            <option value="" disabled>Jump to a service…</option>
            <option value="schools">K-12 schools</option>
            <option value="university">State university</option>
            <option value="dmv">DMV</option>
          </select>
          {/* PHASE-2 a11y issue NB-014 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Inline mini-chart <svg role="img"> has NO <title> or aria-label.
              axe-core `svg-img-alt` fires Serious (WCAG 1.1.1). SLED
              pattern: charting libraries strip titles during SVG
              optimisation. */}
          <svg role="img" width="60" height="18" viewBox="0 0 120 36" className="quick-actions-trend">
            <polyline points="0,30 20,20 40,24 60,10 80,16 100,6 120,12" fill="none" stroke="#c9a961" strokeWidth="2" />
          </svg>
        </div>

        <div className="quick-actions-grid">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.to} className="quick-action-tile">
              <span className="quick-action-icon" aria-hidden="true">{a.icon}</span>
              <span className="quick-action-label">{a.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
         HELP SHAPE YOUR NORTHBROOK — app promo
         ======================================================== */}
      <section className="community-shape" aria-labelledby="community-heading">
        <div className="community-shape-inner">
          <div className="community-app-mockup" aria-hidden="true">
            <div className="phone-frame">
              <div className="phone-screen">
                <div className="phone-app-title">Northbrook Connect</div>
                <div className="phone-app-grid">
                  <span>📋</span><span>🎓</span>
                  <span>💰</span><span>🏗️</span>
                  <span>🗳️</span><span>♻️</span>
                </div>
              </div>
            </div>
          </div>

          <div className="community-shape-copy">
            <h2 id="community-heading">Help Shape Your Northbrook</h2>
            <p>
              The Northbrook Connect app is your hub for the latest updates and
              services from Northbrook State. Download the new Northbrook Connect
              app today!
            </p>
            <Link to="/edu-gov/services" className="btn btn--brick">Download Now</Link>
          </div>
        </div>
      </section>

      {/* ========================================================
         EVENTS & MEETINGS
         ======================================================== */}
      <section className="events-meetings" aria-labelledby="events-heading">
        <h2 id="events-heading" className="events-heading">Events &amp; Meetings</h2>

        <div className="events-grid">
          {/* Calendar mockup */}
          <div className="events-calendar" aria-hidden="true">
            <div className="calendar-head">
              <span className="calendar-nav">‹</span>
              <span className="calendar-month">July 2026</span>
              <span className="calendar-nav">›</span>
            </div>
            <div className="calendar-days">
              <span>S</span><span>M</span><span>T</span><span>W</span>
              <span>T</span><span>F</span><span>S</span>
            </div>
            <div className="calendar-grid">
              {[28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((d, i) => (
                <span key={i} className={'calendar-cell' + (d === 14 ? ' calendar-cell--today' : '')}>{d}</span>
              ))}
            </div>
          </div>

          <div className="events-list">
            {meetings.map((m, i) => (
              <div key={i} className="event-item">
                <div className="event-date">
                  <div className="event-date-month">{m.month}</div>
                  <div className="event-date-day">{m.day}</div>
                </div>
                <div className="event-body">
                  <h3>{m.title}</h3>
                  <p>{m.time}</p>
                </div>
              </div>
            ))}

            {/* PHASE-2 a11y issue NB-015 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                "Popular services" <div role="listbox"> with <div> children that
                lack role="option". axe-core `aria-required-children` fires
                Critical (WCAG 1.3.1). SLED pattern: home-grown combobox
                without following the ARIA APG. */}
            <div role="listbox" aria-label="Popular services" className="popular-services-list">
              <div>Renew vehicle registration</div>
              <div>Apply for SNAP benefits</div>
              <div>Request birth certificate</div>
            </div>

            {/* PHASE-2 a11y issue NB-017 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                Page-progress indicator <div role="progressbar"> with NO
                aria-label / aria-labelledby. axe-core `aria-progressbar-name`
                fires Critical (WCAG 1.1.1). SLED pattern: "62% of citizens
                have completed their profile" widget ships without a name. */}
            <div role="progressbar" aria-valuenow={62} aria-valuemin={0} aria-valuemax={100} className="events-progress">
              <div className="events-progress-fill" style={{ width: '62%' }} />
            </div>

            {/* PHASE-2 a11y issue NB-016 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                Disclosure button uses aria-expanded="yes" instead of "true".
                axe-core `aria-valid-attr-value` fires Critical (WCAG 4.1.2). */}
            <button type="button" aria-expanded="yes" className="btn btn--brick events-more">
              More Events
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
         BLUE STRIP — "Stay Updated on News and Events"
         ======================================================== */}
      <section className="news-strip">
        <div className="news-strip-inner">
          <div>
            <h2>Stay Updated on News and Events</h2>
            <p>Follow us on social media to get the latest news and announcements.</p>
          </div>
          <Link to="/edu-gov/services" className="btn btn--gold">Follow Us</Link>
        </div>
      </section>

      {/* ========================================================
         Ornament + SNAP promo banner
         ======================================================== */}
      {/* PHASE-2 a11y issue NB-187 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          Decorative ornament SVG served with verbose alt text. axe DevTools
          Pro Advanced `image-decorative` AI classifier recognises the
          decorative intent and flags the over-described alt. Minor
          (WCAG 1.1.1). */}
      <img
        src="/ornament-divider.svg"
        alt="A delicate horizontal gold-toned civic ornamental divider featuring three centered dot and ring motifs flanked by tapered horizontal lines, evoking classic state seal imagery"
        className="section-ornament"
      />

      {/* PHASE-2 a11y issue NB-189 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          "Apply for SNAP, Medicaid, or LIHEAP this month" banner with
          near-white text over a sand-to-white gradient (~2.5–3:1). axe-core
          `color-contrast` returns Needs Review (gradient defeats math);
          axe DevTools Pro Advanced `text-contrast` screenshot-analyses and
          reports Serious (WCAG 1.4.3). */}
      <div className="snap-banner">
        Apply for SNAP, Medicaid, or LIHEAP this month — find out if you qualify.
      </div>

      {/* ========================================================
         NEWS section
         ======================================================== */}
      <section className="news-section" aria-labelledby="news-heading">
        {/* PHASE-2 a11y issue NB-186 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            "News" rendered as a styled <div> (24 px / 700 / brand-deep /
            centered) — visually a section heading but semantically not.
            axe DevTools Pro Advanced `heading-markup` (AI/CV) detects the
            visual heading pattern and reports the missing semantic markup.
            Serious (WCAG 1.3.1). */}
        <div
          id="news-heading"
          className="news-fake-heading"
        >
          News
        </div>

        <div className="news-grid">
          {newsCards.map((n, i) => (
            <article key={i} className="news-card">
              {/* PHASE-2 a11y issue NB-IGT-010 (Images IGT) — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                  Multiple <img> elements share identical src AND identical alt
                  ("Northbrook State seal"). Two adjacent duplicates trigger
                  the pattern the Images IGT walks through. Also fires
                  axe-core `image-redundant-alt` (BP). */}
              {i < 2 && (
                <img src="/nb-state-seal.png" alt="Northbrook State seal" className="news-card-thumb" />
              )}
              {i >= 2 && (
                <div className="news-card-thumb news-card-thumb--placeholder" aria-hidden="true">
                  <span>NB</span>
                </div>
              )}
              <h3>{n.title}</h3>
            </article>
          ))}
        </div>

        <div className="news-more-wrap">
          <Link to="/edu-gov/services" className="btn btn--brick">More News</Link>
        </div>
      </section>

      {/* ========================================================
         ACCESS HUB — 5-tile carousel row
         ======================================================== */}
      <section className="access-hub" aria-labelledby="hub-heading">
        <h2 id="hub-heading" className="access-hub-heading">Access Hub</h2>

        <div className="access-hub-carousel-wrap">
          <button type="button" className="hub-nav hub-nav--prev" aria-label="Previous">‹</button>
          <div className="access-hub-grid">
            {accessHub.map((tile, i) => (
              <article key={i} className="hub-tile">
                <div className="hub-tile-image" aria-hidden="true">
                  <span className="hub-tile-emoji">{['🏛️','📱','📝','📬','📊'][i]}</span>
                </div>
                <h3>{tile.title}</h3>
                <p>{tile.desc}</p>
              </article>
            ))}
          </div>
          <button type="button" className="hub-nav hub-nav--next" aria-label="Next">›</button>
        </div>

        {/* PHASE-2 a11y issue NB-018 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Empty <span role="tooltip"> placeholder. axe-core
            `aria-tooltip-name` fires Serious (WCAG 4.1.2). SLED pattern:
            tooltip nodes get pre-rendered for hydration and the content
            string is bound later — but the empty node still trips axe. */}
        <span role="tooltip" id="home-tip" style={{ display: 'none' }} />

        {/* PHASE-2 a11y issue NB-019 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Stray <dt> outside of any <dl>. axe-core `dlitem` fires
            Serious (WCAG 1.3.1). SLED pattern: a CMS author copy-pastes a
            definition term out of a richer block and the surrounding <dl>
            never makes it across. */}
        <dt style={{ display: 'none' }}>Helpful term</dt>

        {/* PHASE-2 a11y issue NB-020 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            `lang="xyz"` is not a valid BCP-47 tag. axe-core `valid-lang`
            fires Serious (WCAG 3.1.2). */}
        <p className="access-hub-multilingual">
          <span lang="xyz">Bienvenido a Northbrook Connect.</span>
        </p>
      </section>

      {/* ========================================================
         STAY CONNECTED — newsletter + social
         ======================================================== */}
      <section className="stay-connected" aria-labelledby="stay-heading">
        <div className="stay-connected-inner">
          <h2 id="stay-heading">Stay Connected</h2>
          <p>Sign up for the latest news and updates.</p>

          {/* PHASE-2 a11y issue NB-022 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Newsletter uses autoComplete="emailaddr" — not a valid WHATWG
              token. axe-core `autocomplete-valid` fires Serious (WCAG 1.3.5). */}
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="nb-newsletter-email" className="sr-only">Email Address</label>
            <input
              id="nb-newsletter-email"
              type="email"
              placeholder="Email Address"
              autoComplete="emailaddr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn btn--gold">Subscribe</button>
          </form>

          <div className="social-row">
            <a href="https://facebook.com/northbrook" onClick={(e) => e.preventDefault()} aria-label="Facebook" className="social-icon social-icon--fb">f</a>
            <a href="https://instagram.com/northbrook" onClick={(e) => e.preventDefault()} aria-label="Instagram" className="social-icon social-icon--ig">📷</a>
            {/* PHASE-2 a11y issue NB-021 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                Empty social/follow anchor (icon stripped) with NO text, NO
                aria-label, NO title. axe-core `link-name` fires Critical
                (WCAG 2.4.4). SLED pattern: footer social row uses CSS
                background-image icons; once aria-label is forgotten the
                link becomes nameless. */}
            <a href="https://twitter.com/northbrook" onClick={(e) => e.preventDefault()} className="social-icon social-icon--empty"></a>
            <a href="https://youtube.com/northbrook" onClick={(e) => e.preventDefault()} aria-label="YouTube" className="social-icon social-icon--yt">▶</a>
          </div>
        </div>
      </section>
    </>
  );
}
