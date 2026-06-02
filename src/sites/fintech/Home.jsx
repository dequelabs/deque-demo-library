import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './auth.jsx';

/**
 * DQBC marketing homepage.
 * Clean accessible baseline. All controls are labeled, contrast passes,
 * landmarks are semantic, headings are hierarchical, and the carousel
 * has a working pause control. Phase 2 will introduce documented
 * accessibility issues — see ACCESSIBILITY_ISSUES.md.
 */
export default function FintechHome() {
  const { isAuthenticated } = useAuth();
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const slides = [
    {
      quote: '"Finally, a bank that respects my time."',
      body: "The mobile app is fast and the savings rate is the best I've seen.",
      who: 'Priya R., small business owner',
    },
    {
      quote: '"Got pre-approved for our mortgage in under 10 minutes."',
      body: 'Their team made buying our first home feel doable.',
      who: 'Marcus & Jenna T.',
    },
    {
      quote: '"My financial advisor actually picks up the phone."',
      body: "I've never felt more confident about my retirement plan.",
      who: 'Elena K., retired teacher',
    },
  ];

  // Auto-advancing testimonial carousel with a working pause control.
  const timer = useRef(null);
  useEffect(() => {
    if (paused) return undefined;
    timer.current = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer.current);
  }, [paused, slides.length]);

  return (
    <>
      <section className="fintech-hero" aria-labelledby="hero-heading">
        <div>
          <span className="fintech-pill">
            New · Smart Savings 4.25% APY
            {/* PHASE-2 a11y issue MT-026 — see ACCESSIBILITY_ISSUES.md
                Inline ascending bar-chart SVG with role="img" but no <title>,
                no aria-label, no aria-labelledby. axe-core `svg-img-alt`
                fires Serious (WCAG 1.1.1) because an svg[role="img"] must
                have an accessible name. */}
            <svg role="img" width="28" height="14" viewBox="0 0 28 14" style={{ marginLeft: 8, verticalAlign: 'middle' }}>
              <rect x="0" y="9" width="4" height="5" fill="#1a7a4d" />
              <rect x="6" y="6" width="4" height="8" fill="#1a7a4d" />
              <rect x="12" y="3" width="4" height="11" fill="#1a7a4d" />
              <rect x="18" y="1" width="4" height="13" fill="#1a7a4d" />
            </svg>
          </span>
          <h1 id="hero-heading">Banking that works as hard as you do.</h1>
          <p className="sub">
            Manage checking, savings, investments, and lending all in one place.
            Backed by 100 years of trust and modern, mobile-first tools.
          </p>
          {/* PHASE-2 a11y issue MT-030 — see ACCESSIBILITY_ISSUES.md
              Pivoted from `aria-prohibited-attr` (which surfaced as
              Needs Review because the <p> had visible text content).
              Now: a "Show more" disclosure button with aria-expanded="yes"
              — invalid value. Valid values are "true" / "false" only.
              axe-core `aria-valid-attr-value` fires Critical (WCAG 4.1.2). */}
          <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>
            Smart money, simple banking.{' '}
            <button
              type="button"
              className="btn-link"
              aria-expanded="yes"
              onClick={(e) => e.preventDefault()}
            >
              Show more
            </button>
          </p>
          <div className="flex gap-12">
            <Link className="btn btn-primary" to={isAuthenticated ? '/fintech/dashboard' : '/fintech/login'}>
              {isAuthenticated ? 'Go to your accounts' : 'Get started'}
            </Link>
            <Link className="btn btn-outline" to="/fintech/savings">
              See Smart Savings
            </Link>
          </div>
        </div>

        <div className="fintech-hero-visual">
          {/* PHASE-2 a11y issue MT-001 — see ACCESSIBILITY_ISSUES.md
              Was: <img src="/fintech-hero.svg" alt="" role="presentation" />
              Removed alt + role to trigger axe-core `image-alt` (Critical, WCAG 1.1.1). */}
          <img src="/fintech-hero.svg" />
        </div>
      </section>

      <section className="fintech-section alt" aria-labelledby="features-heading">
        <h2 id="features-heading" className="section-title">Everything you need from a modern bank</h2>
        <p className="section-sub">From everyday checking to wealth management, we&apos;ve got you covered.</p>

        {/* PHASE-2 a11y issue MT-025 — see ACCESSIBILITY_ISSUES.md
            "Pick the right account for you" mini-widget: a native <select>
            with options but no associated <label htmlFor>, no aria-label,
            no aria-labelledby, no title attribute. axe-core `select-name`
            fires Critical (WCAG 4.1.2) because the select has no
            accessible name. */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '0 0 24px' }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Pick the right account for you:</span>
          <select style={{ padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6 }}>
            <option value="">Choose an option</option>
            <option value="checking">Everyday checking</option>
            <option value="savings">Smart Savings</option>
            <option value="mortgage">Home mortgage</option>
            <option value="invest">Brokerage / IRA</option>
          </select>
        </div>

        {/* PHASE-2 a11y issue MT-009 — see ACCESSIBILITY_ISSUES.md
            All three feature cards use the same link text "Learn more" but point
            to different destinations (checking, mortgages, brokerage). A screen-
            reader user pulling up a links list sees three identical entries and
            has to guess which is which. axe-core fires
            `identical-links-same-purpose` (Minor — Best Practice / Pro Advanced;
            requires the Best Practices toggle ON in axe DevTools). */}
        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon" aria-hidden="true" />
            <h3>Checking &amp; Savings</h3>
            <p>No monthly fees, no minimums, and a top-tier 4.25% APY savings.</p>
            <Link to="/fintech/checking">Learn more</Link>
          </article>

          <article className="feature-card">
            <div className="feature-icon" aria-hidden="true" />
            <h3>Mortgages &amp; Lending</h3>
            <p>Pre-qualification in minutes. Competitive rates on home and auto.</p>
            <Link to="/fintech/mortgages">Learn more</Link>
          </article>

          <article className="feature-card">
            <div className="feature-icon" aria-hidden="true" />
            <h3>Investing &amp; Retirement</h3>
            <p>Self-directed brokerage and managed portfolios. IRAs and 401(k)s.</p>
            <Link to="/fintech/wealth">Learn more</Link>
          </article>
        </div>
      </section>

      {/* PHASE-2 a11y issue MT-028 — see ACCESSIBILITY_ISSUES.md
          Promotional-rate stripe with white text over a near-white/pale
          gold linear-gradient background. Computed contrast lands around
          2.5–3.5:1. axe-core `color-contrast` typically returns
          Needs Review here (gradient bg defeats single-colour math), but
          axe DevTools Pro Advanced `text-contrast` screenshot-analyses
          the rendered pixels and reports Serious (WCAG 1.4.3) as an
          automatic finding. */}
      <div
        style={{
          background: 'linear-gradient(90deg, #f5e9c4 0%, #ffffff 100%)',
          color: '#ffffff',
          textAlign: 'center',
          padding: '10px 16px',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Limited-time promotional rate: 4.50% APY on new Smart Savings deposits
      </div>

      <section className="fintech-section" aria-labelledby="favorites-heading">
        <h2 id="favorites-heading" className="section-title">Customer favorites</h2>
        <p className="section-sub">A quick look at what our members open most.</p>

        {/* PHASE-2 a11y issue MT-027 — see ACCESSIBILITY_ISSUES.md
            <div role="listbox"> with text-only <div> children — none of
            the children carry role="option". axe-core
            `aria-required-children` fires Critical (WCAG 1.3.1) because
            role=listbox must contain at least one role=option descendant. */}
        <div role="listbox" aria-label="Customer favorites" style={{ maxWidth: 480, margin: '0 auto', border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
          <div style={{ padding: '6px 8px' }}>Smart Savings (4.25% APY)</div>
          <div style={{ padding: '6px 8px' }}>Everyday checking</div>
          <div style={{ padding: '6px 8px' }}>Cash-back credit card</div>
          <div style={{ padding: '6px 8px' }}>30-year fixed mortgage</div>
        </div>

        {/* PHASE-2 a11y issue MT-029 — see ACCESSIBILITY_ISSUES.md
            Informative branch-building photo (signage reads "DQBC
            Downtown") served with alt="". axe DevTools Pro Advanced AI
            `image-informative-has-alt` runs an image classifier and
            recognises this as informative content that should describe
            the location, not a decorative ornament. Fires Minor
            (WCAG 1.1.1) in the Automatic Issues (advanced) bucket. */}
        <img
          src="/branch-photo.svg"
          alt=""
          style={{ display: 'block', margin: '24px auto 0', maxWidth: 320, height: 'auto', borderRadius: 8 }}
        />
      </section>

      {/* PHASE-2 a11y issue MT-011 — see ACCESSIBILITY_ISSUES.md
          The "Spotlight offer" title below is rendered as a styled <div>, not
          an <h2>. Visually it reads as a section heading (28 px, bold, dark
          navy, top margin) but the document outline doesn't include it.
          axe DevTools Pro Advanced `heading-markup` runs a CV pass over a
          screenshot and detects text that visually looks like a heading but
          lacks <h1>-<h6> markup or role="heading". Classic CMS / WYSIWYG
          pattern when a content editor uses bold + size to "make it a
          heading" instead of the heading tool. AI-credit-using rule. */}
      <section className="fintech-section alt">
        {/* PHASE-2 a11y issue MT-012 — see ACCESSIBILITY_ISSUES.md
            The ornament-divider.svg is purely decorative (a thin gold line
            with three dot/ring shapes — no content meaning), but its alt
            text describes it verbosely. axe DevTools Pro Advanced
            `image-decorative` runs an AI/CV classifier and reports decorative
            images that have unnecessary alt text. AI-credit-using rule.
            Correct treatment for a decorative ornament: `alt=""`, or
            `role="presentation"`, or `aria-hidden="true"`. */}
        <img
          src="/ornament-divider.svg"
          alt="A delicate horizontal gold-toned ornamental divider featuring three centered dot and ring motifs flanked by tapered horizontal lines, evoking classic financial branding"
          style={{ display: 'block', margin: '0 auto 24px', maxWidth: 400, height: 'auto' }}
        />
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--brand-deep)',
            margin: '0 0 8px',
            textAlign: 'center',
          }}
        >
          Spotlight offer
        </div>
        <p className="section-sub">
          Open a Smart Savings account this month and earn a $200 bonus after
          your first qualifying deposit.
        </p>
      </section>

      <section className="fintech-section" aria-labelledby="numbers-heading">
        <h2 id="numbers-heading" className="section-title">By the numbers</h2>
        <p className="section-sub">A century of trust, expressed in figures.</p>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-num">2.4M</span>
            <span className="stat-label">Active customers</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">$48B</span>
            <span className="stat-label">Assets under management</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">4.9★</span>
            <span className="stat-label">Average app rating</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">1923</span>
            <span className="stat-label">Founded</span>
          </div>
        </div>

        <p className="preview-divider">Here&apos;s what yours could look like</p>

        <div className="preview-grid" role="list">
          <article className="preview-card" role="listitem">
            <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', margin: '0 0 12px' }}>
              Emergency fund goal
            </h3>
            <div className="goal-amount">$6,500 <span>of $10,000</span></div>
            <div
              role="progressbar"
              aria-label="Emergency fund progress"
              aria-valuenow={65}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuetext="65 percent of goal reached"
              className="goal-bar"
            >
              <div className="goal-bar-fill" style={{ width: '65%' }} />
            </div>
            <div className="goal-meta">
              <span>65% there</span>
              <span>Goal: Sept 2026</span>
            </div>
          </article>

          <article className="preview-card" role="listitem">
            <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', margin: '0 0 12px' }}>
              Credit health
            </h3>
            <div className="credit-score">720 <span>· Good</span></div>
            <div
              role="meter"
              aria-label="Credit score, 720 out of 850"
              aria-valuenow={720}
              aria-valuemin={300}
              aria-valuemax={850}
              className="credit-bar"
            >
              <div className="credit-bar-fill" style={{ width: '76%' }} />
            </div>
            <div className="goal-meta">
              <span>+12 this month</span>
              <span>Updated today</span>
            </div>
          </article>

          <article className="preview-card" role="listitem">
            <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', margin: '0 0 12px' }}>
              Two-factor authentication
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 18px' }}>
              Add a second verification step to every sign-in.
            </p>
            <button
              type="button"
              role="switch"
              aria-checked="true"
              aria-label="Two-factor authentication"
              className="mfa-switch"
            >
              <span className="mfa-switch-thumb" aria-hidden="true" />
            </button>
          </article>
        </div>
      </section>

      <section className="fintech-section alt" aria-labelledby="testimonials-heading">
        <h2 id="testimonials-heading" className="section-title">What our customers say</h2>
        <p className="section-sub">Real stories from real DQBC members.</p>

        <div
          className="fintech-carousel"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
        >
          {slides.map((s, i) => (
            <div
              key={i}
              className={'fintech-carousel-slide' + (i === slide ? ' active' : '')}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${slides.length}`}
              aria-hidden={i !== slide}
            >
              <blockquote>
                <h3>{s.quote}</h3>
                <p>{s.body}</p>
                <footer className="muted">— {s.who}</footer>
              </blockquote>
            </div>
          ))}

          <div className="fintech-carousel-controls">
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              aria-label={paused ? 'Resume testimonial carousel' : 'Pause testimonial carousel'}
            >
              {paused ? '▶' : '❚❚'}
            </button>
            <button
              type="button"
              onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)}
              aria-label="Previous testimonial"
            >‹</button>
            <button
              type="button"
              onClick={() => setSlide((s) => (s + 1) % slides.length)}
              aria-label="Next testimonial"
            >›</button>
          </div>
        </div>
      </section>

      <section className="fintech-section" aria-labelledby="status-heading">
        <h2 id="status-heading" className="section-title">System status</h2>
        <ul className="status-row" style={{ listStyle: 'none', padding: 0 }}>
          <li><span className="status-dot green" aria-hidden="true" /> Online banking <span className="muted">— Operational</span></li>
          <li><span className="status-dot green" aria-hidden="true" /> Mobile app <span className="muted">— Operational</span></li>
          <li><span className="status-dot yellow" aria-hidden="true" /> Wire transfers <span className="muted">— Degraded</span></li>
          <li><span className="status-dot red" aria-hidden="true" /> Card disputes portal <span className="muted">— Outage</span></li>
        </ul>
      </section>

      <section className="fintech-section alt" aria-labelledby="newsletter-heading">
        <div className="container text-center" style={{ maxWidth: 560 }}>
          <h2 id="newsletter-heading">Get money tips in your inbox</h2>
          <p className="muted">A short, weekly note from our team. No spam.</p>
          <form
            className="flex gap-8 mt-16"
            onSubmit={(e) => { e.preventDefault(); }}
            aria-label="Newsletter subscription"
          >
            <label htmlFor="newsletter-email" className="sr-only" style={{
              position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
              overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
            }}>
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              style={{ flex: 1, padding: '11px 12px', border: '1px solid var(--border)', borderRadius: 6 }}
            />
            <button className="btn btn-primary" type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}
