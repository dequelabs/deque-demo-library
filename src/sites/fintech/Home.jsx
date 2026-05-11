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
          <span className="fintech-pill">New · Smart Savings 4.25% APY</span>
          <h1 id="hero-heading">Banking that works as hard as you do.</h1>
          <p className="sub">
            Manage checking, savings, investments, and lending all in one place.
            Backed by 100 years of trust and modern, mobile-first tools.
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
          <img src="/fintech-hero.svg" alt="" role="presentation" />
        </div>
      </section>

      <section className="fintech-section alt" aria-labelledby="features-heading">
        <h2 id="features-heading" className="section-title">Everything you need from a modern bank</h2>
        <p className="section-sub">From everyday checking to wealth management, we&apos;ve got you covered.</p>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon" aria-hidden="true" />
            <h3>Checking &amp; Savings</h3>
            <p>No monthly fees, no minimums, and a top-tier 4.25% APY savings.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon" aria-hidden="true" />
            <h3>Mortgages &amp; Lending</h3>
            <p>Pre-qualification in minutes. Competitive rates on home and auto.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon" aria-hidden="true" />
            <h3>Investing &amp; Retirement</h3>
            <p>Self-directed brokerage and managed portfolios. IRAs and 401(k)s.</p>
          </article>
        </div>
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
