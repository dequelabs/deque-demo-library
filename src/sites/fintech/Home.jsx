import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * DQBC marketing homepage — big-bank consumer-banking layout.
 *
 * Composition (top-to-bottom, within a full-width blue hero container):
 *   - Two-column hero: login card (left) + card promo grid (right)
 *   - Below-hero light band with cash offer + tiers + testimonial
 *   - Sticky bottom banner (dismissible)
 *
 * All 11 Phase-2 a11y issues from the previous marketing layout are
 * preserved (MT-001, MT-009, MT-011, MT-012, MT-025, MT-026, MT-027,
 * MT-028, MT-029, MT-030, IGT-016). See ACCESSIBILITY_ISSUES.md.
 */
export default function FintechHome() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [saveId, setSaveId] = useState(false);
  const [stripeVisible, setStripeVisible] = useState(true);

  const cards = [
    {
      badge: '$200',
      label: 'online bonus offer',
      note: 'No annual fee.',
      title: 'Customized Cash Rewards',
      cta: '6% choice category cash back offer',
      color: 'red',
      to: '/fintech/cards',
    },
    {
      badge: '$200',
      label: 'online bonus offer',
      note: 'No annual fee.',
      title: 'Unlimited Cash Rewards',
      cta: '2% unlimited cash back offer',
      color: 'silver',
      to: '/fintech/checking',
    },
    {
      badge: '25,000',
      label: 'online bonus points offer',
      note: 'No annual fee.',
      title: 'Travel Rewards',
      cta: 'Unlimited 1.5 points for every $1 spent on all purchases',
      color: 'blue',
      to: '/fintech/savings',
    },
    {
      badge: '0%',
      label: 'intro APR offer',
      note: 'No annual fee.',
      title: 'DQBCard®',
      cta: 'Intro APR offer for 21 billing cycles',
      color: 'white',
      to: '/fintech/mortgages',
      newOffer: true,
    },
  ];

  return (
    <>
      {/* ========================================================
         HERO — full-bleed blue container wrapping login + promos
         ======================================================== */}
      <section className="dqbc-hero-wrap" aria-labelledby="hero-heading">
        <div className="dqbc-hero-inner">
          {/* LEFT — Login card ---------------------------------- */}
          <aside className="login-card" aria-labelledby="login-heading">
            <div className="login-card-accent" aria-hidden="true" />
            <h2 id="login-heading" className="sr-only">Sign in to online banking</h2>

            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="home-userid" className="login-label">User ID</label>
              <input
                id="home-userid"
                type="text"
                autoComplete="username"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />

              <label htmlFor="home-password" className="login-label">Password</label>
              <input
                id="home-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label className="login-checkbox">
                <input
                  type="checkbox"
                  checked={saveId}
                  onChange={(e) => setSaveId(e.target.checked)}
                />
                <span>Save user ID</span>
              </label>

              {/* PHASE-3 a11y issue IGT-022 (Keyboard IGT) — see ACCESSIBILITY_ISSUES.md
                  Positive `tabIndex={5}` on the Log in button pulls it out of
                  natural DOM tab order (would be reached after all tab-order=0
                  elements). axe-core `tabindex` fires Serious as BP
                  (WCAG 2.4.3); the Keyboard IGT walks the SE through the full
                  tab traversal, revealing the anomaly visually. */}
              <button type="submit" className="btn-login" tabIndex={5}>Log in</button>

              <Link to="/fintech/forgot" className="login-forgot">
                Forgot user ID/password?
              </Link>

              {/* PHASE-2 a11y issue IGT-016 (Reading Order IGT) —
                  see ACCESSIBILITY_ISSUES.md. The "Security & Help / Enroll"
                  pair uses `flexDirection: 'row-reverse'`. Visual order
                  (Security & Help, then Enroll) reverses DOM order (Enroll
                  first, then Security & Help). */}
              <div
                className="login-secondary"
                style={{ display: 'flex', flexDirection: 'row-reverse', gap: 16 }}
              >
                <Link to="/fintech/enroll">Enroll</Link>
                <Link to="/fintech/help">Security &amp; Help</Link>
              </div>

              {/* PHASE-2 a11y issue MT-030 — see ACCESSIBILITY_ISSUES.md
                  "Show additional login options" carries aria-expanded="yes"
                  which is invalid. Valid: "true" / "false". axe-core
                  `aria-valid-attr-value` fires Critical (WCAG 4.1.2). */}
              <button
                type="button"
                className="login-more"
                aria-expanded="yes"
                onClick={(e) => e.preventDefault()}
              >
                Show additional login options
              </button>
            </form>

            <Link to="/fintech/checking" className="btn-open-account">
              <span className="dollar-icon" aria-hidden="true">$</span>
              Open an account
            </Link>

            {/* PHASE-3 a11y issue MT-081 — see ACCESSIBILITY_ISSUES.md
                Fine-print terms disclosure at ~2.4:1 contrast (light grey
                on white). axe-core `color-contrast` fires Serious
                (WCAG 1.4.3). */}
            <p className="fine-print">
              Terms and conditions apply. Message and data rates may apply.
              {' '}
              {/* PHASE-3 a11y issue MT-086 — see ACCESSIBILITY_ISSUES.md
                  <span> is focusable via tabIndex={0} + click handler but has
                  no interactive role. Screen readers announce it as plain
                  text; keyboard users can Tab to it but there's nothing
                  telling AT it's actionable. axe-core `focus-order-semantics`
                  fires Minor as BP — WCAG 2.4.3. */}
              <span
                className="fine-print-more"
                tabIndex={0}
                onClick={(e) => { e.preventDefault(); }}
              >
                Read full terms
              </span>
            </p>

            {/* PHASE-3 a11y issue MT-085 — see ACCESSIBILITY_ISSUES.md
                Container carries aria-hidden="true" so screen readers skip
                its contents — but the inner <Link> is still in the natural
                tab order. Keyboard users can Tab into content that AT users
                can never reach. axe-core `aria-hidden-focus` fires Serious
                (WCAG 4.1.2). */}
            <div aria-hidden="true" className="archive-hint">
              <Link to="/fintech/help#archive">View last quarter&apos;s offers</Link>
            </div>

            {/* PHASE-2 a11y issue MT-027 — see ACCESSIBILITY_ISSUES.md
                <div role="listbox"> with text-only <div> children — none
                carry role="option". axe-core `aria-required-children`
                fires Critical (WCAG 1.3.1). */}
            <div
              className="popular-listbox"
              role="listbox"
              aria-label="Popular products"
            >
              <div className="popular-listbox-title">Popular products</div>
              <div className="popular-listbox-item">Smart Savings (4.25% APY)</div>
              <div className="popular-listbox-item">Everyday checking</div>
              <div className="popular-listbox-item">Cash-back credit card</div>
              <div className="popular-listbox-item">30-year fixed mortgage</div>
            </div>
          </aside>

          {/* RIGHT — Promo card grid ---------------------------- */}
          <div className="promo-panel">
            {/* PHASE-3 a11y issue MT-084 — see ACCESSIBILITY_ISSUES.md
                "Featured this month" section-eyebrow rendered as a styled
                <div>, not an <h2>. Visually reads as a section heading
                (bold, uppercase, spaced) but doesn't participate in the
                document outline. axe DevTools Pro Advanced `heading-markup`
                runs a CV pass over a screenshot and detects text that
                visually looks like a heading but lacks h1-h6 markup or
                role="heading". AI-credit-using rule. */}
            <div className="featured-this-month">Featured this month</div>

            <h1 id="hero-heading" className="promo-heading">
              Choose the card that works for you
            </h1>

            {/* PHASE-2 a11y issue MT-025 — see ACCESSIBILITY_ISSUES.md
                "Filter by:" mini-widget — native <select> with no label,
                no aria-label, no aria-labelledby, no title. axe-core
                `select-name` fires Critical (WCAG 4.1.2). */}
            <div className="promo-filter">
              <span className="promo-filter-hint">Filter by:</span>
              <select className="promo-filter-select">
                <option value="">All cards</option>
                <option value="cash">Cash back</option>
                <option value="travel">Travel</option>
                <option value="apr">0% intro APR</option>
              </select>
            </div>

            <div className="promo-grid">
              {cards.map((c, i) => (
                <article key={i} className={'promo-card promo-card--' + c.color}>
                  <div className="promo-card-badge">
                    <span className="promo-badge-value">{c.badge}</span>
                    {i === 0 && (
                      /* PHASE-2 a11y issue MT-026 — see ACCESSIBILITY_ISSUES.md
                         Inline ascending bar-chart <svg role="img"> next to
                         the first promo card's badge — no <title>, no
                         aria-label, no aria-labelledby. axe-core `svg-img-alt`
                         fires Serious (WCAG 1.1.1). */
                      <svg
                        role="img"
                        width="24"
                        height="12"
                        viewBox="0 0 28 14"
                        style={{ marginLeft: 6, verticalAlign: 'middle' }}
                      >
                        <rect x="0" y="9" width="4" height="5" fill="#43a047" />
                        <rect x="6" y="6" width="4" height="8" fill="#43a047" />
                        <rect x="12" y="3" width="4" height="11" fill="#43a047" />
                        <rect x="18" y="1" width="4" height="13" fill="#43a047" />
                      </svg>
                    )}
                  </div>
                  <div className="promo-label">{c.label}</div>
                  <div className="promo-note">{c.note}</div>

                  {/* Card visual */}
                  <div className={'card-art card-art--' + c.color} aria-hidden="true">
                    {c.newOffer && <span className="card-art-new-offer">NEW OFFER</span>}
                    <span className="card-art-contactless">))))</span>
                    <span className="card-art-chip" />
                    <span className="card-art-brand">DQBC</span>
                    <span className="card-art-network">
                      {i === 3 ? '⬤⬤' : 'VISA'}
                    </span>
                  </div>

                  <div className="promo-title">{c.title}</div>

                  <Link to={c.to} className="promo-cta-btn">
                    <span className="promo-cta-text">{c.cta}</span>
                  </Link>

                  {/* PHASE-2 a11y issue MT-009 — see ACCESSIBILITY_ISSUES.md
                      Small secondary "Learn more" link below each card's
                      primary CTA. All 4 have identical text "Learn more"
                      but point to different destinations (per-card hash
                      anchors on /fintech/cards). axe-core
                      `identical-links-same-purpose` (Minor BP — requires
                      Best Practices toggle ON in axe DevTools). */}
                  <Link to={c.to} className="promo-learn-more">Learn more</Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
         MT-028 promo stripe (kept from previous design)
         ======================================================== */}
      {/* PHASE-2 a11y issue MT-028 — see ACCESSIBILITY_ISSUES.md
          Promotional-rate stripe with white text over a near-white/pale-gold
          linear-gradient background. Contrast lands around 2.5–3.5:1.
          axe-core `color-contrast` returns Needs Review (gradient defeats
          single-colour math); axe DevTools Pro Advanced `text-contrast`
          screenshot-analyses the rendered pixels and reports Serious
          (WCAG 1.4.3). */}
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

      {/* ========================================================
         BOTTOM band — cash offer + tiers + testimonial
         ======================================================== */}
      <section className="dqbc-bottom-wrap" aria-labelledby="offers-heading">
        {/* MT-012: decorative ornament with verbose alt */}
        {/* PHASE-2 a11y issue MT-012 — see ACCESSIBILITY_ISSUES.md
            Ornament divider is purely decorative but the alt text describes
            it verbosely. axe DevTools Pro Advanced `image-decorative` (AI/CV)
            fires Minor (WCAG 1.1.1). */}
        <img
          src="/ornament-divider.svg"
          alt="A delicate horizontal gold-toned ornamental divider featuring three centered dot and ring motifs flanked by tapered horizontal lines, evoking classic financial branding"
          style={{ display: 'block', margin: '0 auto 24px', maxWidth: 400, height: 'auto' }}
        />

        <h2 id="offers-heading" className="sr-only">Featured offers</h2>

        <div className="dqbc-bottom-grid">
          {/* Cash offer card */}
          <div className="cash-offer-card">
            <div className="cash-offer-eyebrow">NEW CHECKING CUSTOMERS</div>

            {/* PHASE-2 a11y issue MT-011 — see ACCESSIBILITY_ISSUES.md
                "Cash offer up to $500" title is a styled <div>, not an
                <h2>/<h3>. axe DevTools Pro Advanced `heading-markup` (AI/CV)
                fires Serious (WCAG 1.3.1). */}
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: '#b71c1c',
                margin: '4px 0 12px',
                lineHeight: 1.15,
              }}
            >
              Cash offer up to $500
            </div>
            <p className="cash-offer-body">
              Start by opening a new eligible checking account.
            </p>
            <Link to="/fintech/checking" className="cash-offer-details">
              See details
            </Link>
          </div>

          {/* Tiered amounts */}
          <div className="cash-offer-tiers" aria-hidden="true">
            <div className="tier tier--small">
              <span className="tier-amount"><sup>$</sup>100</span>
              <span className="tier-label">cash offer</span>
            </div>
            <div className="tier tier--medium">
              <span className="tier-amount"><sup>$</sup>300</span>
              <span className="tier-label">cash offer</span>
            </div>
            <div className="tier tier--large">
              <span className="tier-amount"><sup>$</sup>500</span>
              <span className="tier-label">cash offer</span>
            </div>
          </div>

          {/* Testimonial */}
          <div className="testimonial-card">
            <div className="testimonial-content">
              <blockquote className="testimonial-quote">
                &ldquo;I&apos;ve moved up from intern to managing director&rdquo;
              </blockquote>
              <p className="testimonial-body">
                We asked teammates like Priya R., &ldquo;What makes this company
                a great place to work?&rdquo;
              </p>
              <Link to="/fintech/stories" className="testimonial-link">
                Read their stories
                {/* PHASE-3 a11y issue MT-080 — see ACCESSIBILITY_ISSUES.md
                    Nested <button> inside an <a> (React Router <Link>).
                    Interactive elements must not be nested — axe-core
                    `nested-interactive` fires Serious (WCAG 4.1.2). */}
                <button
                  type="button"
                  className="testimonial-preview-btn"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                  ▶ Preview
                </button>
              </Link>
            </div>
            {/* PHASE-2 a11y issue MT-001 — see ACCESSIBILITY_ISSUES.md
                Employee testimonial photo — Unsplash headshot. Missing
                alt attribute entirely. axe-core `image-alt` fires Critical
                (WCAG 1.1.1). */}
            <img
              className="testimonial-photo"
              src="https://images.unsplash.com/photo-1713947506242-8fcae733d158?q=80&w=1200&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>

      {/* ========================================================
         Better Money Habits — educational tiles
         ======================================================== */}
      <section className="money-habits-wrap" aria-labelledby="habits-heading">
        <div className="money-habits">
          <h2 id="habits-heading" className="money-habits-heading">
            Better Money Habits<sup>&reg;</sup>
          </h2>
          <p className="money-habits-sub">
            Free financial education. No login required.
          </p>

          <div className="money-habits-grid">
            <article className="habit-tile">
              <div className="habit-tile-icon" aria-hidden="true">💰</div>
              <h3>Saving &amp; budgeting</h3>
              <p>The 50/30/20 rule, emergency funds, and how to automate the boring parts.</p>
              <Link to="/fintech/help#saving">Read the guide</Link>
            </article>

            <article className="habit-tile">
              <div className="habit-tile-icon" aria-hidden="true">🏠</div>
              <h3>Buying a home</h3>
              <p>Pre-qualification, down payments, and closing costs demystified.</p>
              <Link to="/fintech/mortgages">Explore mortgages</Link>
            </article>

            <article className="habit-tile">
              <div className="habit-tile-icon" aria-hidden="true">📈</div>
              <h3>Investing basics</h3>
              <p>Brokerage vs. IRA, index funds vs. active, and what "risk tolerance" really means.</p>
              <Link to="/fintech/wealth">Start investing</Link>
            </article>

            <article className="habit-tile">
              <div className="habit-tile-icon" aria-hidden="true">🎓</div>
              <h3>Managing credit</h3>
              <p>Your credit score, how it's calculated, and habits that improve it over time.</p>
              <Link to="/fintech/cards">Review credit tips</Link>
            </article>
          </div>
        </div>
      </section>

      {/* ========================================================
         Branch footer — MT-029 + IGT-021 + MT-079
         ======================================================== */}
      <section className="branch-footer" aria-labelledby="branch-heading">
        <div className="branch-footer-inner">
          <div className="branch-footer-copy">
            <h2 id="branch-heading" className="branch-footer-heading">
              Find a DQBC branch near you
            </h2>
            <p>
              350+ locations across the U.S., open Monday through Saturday.
              Book an appointment online or walk in — we're happy to help.
            </p>
            <Link to="/fintech/help#branches" className="btn btn-outline btn-outline--on-light">
              Find a branch
            </Link>

            {/* PHASE-3 a11y issue IGT-021 (Images IGT) — see ACCESSIBILITY_ISSUES.md
                Small branch thumbnail whose alt attribute is a verbatim copy
                of the visible <figcaption>. axe-core `image-redundant-alt`
                fires Minor (BP); Images IGT surfaces this in its alt-text
                quality walkthrough. */}
            <figure className="branch-thumb">
              <img
                src="/branch-photo.svg"
                alt="DQBC Downtown branch"
                className="branch-thumb-img"
              />
              <figcaption>DQBC Downtown branch</figcaption>
            </figure>
          </div>

          {/* PHASE-2 a11y issue MT-029 — see ACCESSIBILITY_ISSUES.md
              Informative branch-building photo served with alt="". axe
              DevTools Pro Advanced `image-informative-has-alt` (AI
              classifier) fires Minor (WCAG 1.1.1). */}
          <img
            src="/branch-photo.svg"
            alt=""
            className="branch-footer-hero"
          />
        </div>

        {/* PHASE-3 a11y issue MT-079 — see ACCESSIBILITY_ISSUES.md
            "Back to top" chevron link with no visible text, no aria-label,
            no aria-labelledby, no title. Its only child is an <svg
            aria-hidden="true">. axe-core `link-name` fires Critical
            (WCAG 2.4.4/4.1.2). */}
        <a href="#top" className="back-to-top">
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </a>
      </section>

      {/* ========================================================
         Sticky bottom offer banner (dismissible)
         ======================================================== */}
      {stripeVisible && (
        <div className="sticky-offer" role="complementary" aria-label="Featured offer">
          <div className="sticky-offer-inner">
            <span className="sticky-offer-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b71c1c" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="1" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            </span>
            <span className="sticky-offer-text">
              <strong>CASH OFFER UP TO $500</strong> for new checking customers
            </span>
            <Link to="/fintech/checking" className="sticky-offer-link">
              See details &gt;
            </Link>
            {/* PHASE-3 a11y issue IGT-023 (Keyboard IGT) — see ACCESSIBILITY_ISSUES.md
                "Save for later" is a fake <div role="button" tabIndex={0}> with
                onClick only — no onKeyDown / onKeyUp handler. Keyboard users can
                Tab to it but can't activate it with Enter or Space. axe-core
                `keyboard` rules typically miss this custom-widget pattern; the
                Keyboard IGT catches it as a hard fail by simulating actual key
                presses on every focusable element. */}
            <div
              role="button"
              tabIndex={0}
              className="sticky-offer-save"
              onClick={() => window.alert('Offer saved')}
            >
              <span aria-hidden="true">★</span> Save for later
            </div>
            {/* PHASE-3 a11y issue MT-082 — see ACCESSIBILITY_ISSUES.md
                Sticky-offer's close button is icon-only: no visible text, no
                aria-label, no aria-labelledby, no title, and the SVG child
                is aria-hidden. axe-core `button-name` fires Critical
                (WCAG 4.1.2) because the button has no accessible name. */}
            <button
              type="button"
              className="sticky-offer-close"
              onClick={() => setStripeVisible(false)}
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 2 L12 12 M12 2 L2 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
