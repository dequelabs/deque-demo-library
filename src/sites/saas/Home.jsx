import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Pulsegrid marketing home — Datadog-inspired dark hero.
 *
 * Intentional axe/IGT issues (see PULSEGRID_ACCESSIBILITY_ISSUES.md):
 *   PG-001 image-alt          — hero screenshot has empty alt on informative image
 *   PG-002 heading-order       — h1 → h3 (skips h2) on the "Trusted by" strip
 *   PG-003 color-contrast      — "Meet Bits AI" hero eyebrow uses low-contrast violet
 *   PG-004 link-name           — social icon anchor in "customers" logos has no accessible name
 *   PG-006 identical-links-same-purpose — four "Learn more" links to different products
 *   PG-007 button-name         — "close-announce" icon button lacks a label
 *   PG-009 landmark-unique     — two <nav> in Products area without unique labels
 *   PG-010 aria-required-children — role="tablist" with plain <div> children (no role="tab")
 *   PG-025 (advanced) image-decorative — customer-logo images have redundant alt text
 *   PG-IGT-002 (Structure)     — page renders a second <h1> in the promo band
 *   PG-IGT-003 (Headings)      — visually large "That's a wrap" text is a <div>, not h#
 */
export default function Home() {
  const [activeProduct, setActiveProduct] = useState('apm');

  const products = [
    { id: 'infra',    label: 'Infrastructure Monitoring', copy: 'Track every host, container, and serverless function in real time.' },
    { id: 'logs',     label: 'Log Management',            copy: 'Ingest, index, and archive 100% of your logs — from any source.' },
    { id: 'apm',      label: 'Application Performance',   copy: 'Distributed traces, service maps, and code-level profiling.' },
    { id: 'ai',       label: 'Bits AI Observability',     copy: 'Correlate anomalies, summarize incidents, and draft runbooks with AI.' },
    { id: 'security', label: 'Cloud Security',            copy: 'Detect misconfigurations, threats, and vulnerabilities across your stack.' },
  ];
  const activeProductData = products.find((p) => p.id === activeProduct);

  return (
    <>
      {/* HERO */}
      <section className="pg-hero" aria-labelledby="hero-title">
        {/* PG-003: violet text on the dark bg has ~3.1:1 contrast (needs 4.5) */}
        <div style={{ color: '#4f46e5', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          ✦ Meet Bits AI — now generally available
        </div>
        <h1 id="hero-title" className="pg-hero-title">
          <span className="pg-grad">AI-Powered</span> Observability<br />
          and Security
        </h1>
        <p className="pg-hero-sub">
          See inside every request, log, and host — then let Pulsegrid's copilot tell you exactly what to do next.
        </p>
        <div className="pg-hero-cta">
          <Link to="/saas/login" className="pg-btn pg-btn--primary">Get started free</Link>
          <a href="#demo" onClick={(e) => e.preventDefault()} className="pg-btn pg-btn--outline">Watch a demo</a>
        </div>

        {/* PG-001: informative dashboard screenshot has empty alt */}
        <div className="pg-hero-visual" role="img" aria-label="">
          <PulsegridDashboardHero />
        </div>
      </section>

      {/* CUSTOMER LOGOS */}
      <section className="pg-logos" id="customers">
        {/* PG-002: skips h2 — jumps h1 → h3 */}
        <h3 className="pg-logos-title">Trusted by engineering teams at</h3>
        <div className="pg-logos-row">
          {['NORTHWIND', 'ITAUE', 'PERPLEXA', 'FICO', 'MIDJOURNAL', 'DUST'].map((name) => (
            /* PG-025 (advanced/image-decorative): decorative logo has redundant alt="{name} logo" */
            <span key={name} className="pg-logo-tile" role="img" aria-label={`${name} logo`}>
              {name}
            </span>
          ))}
          {/* PG-004: anchor with only an icon and no accessible name */}
          <a href="#more-customers" onClick={(e) => e.preventDefault()} style={{ color: 'var(--pg-text-secondary)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </a>
        </div>
      </section>

      {/* TAG CLOUD + PROMO */}
      <section className="pg-tag-cloud">
        <div className="pg-tags" aria-hidden="true">
          {[
            'AI OBSERVABILITY', 'DISTRIBUTED TRACING', 'RUM', 'LOG PIPELINES',
            'INFRASTRUCTURE', 'ANOMALY DETECTION', 'INCIDENT MANAGEMENT',
            'CLOUD SIEM', 'CSPM', 'SYNTHETIC MONITORING', 'DATABASE MONITORING',
            'NETWORK PERFORMANCE', 'BITS AI', 'SERVICE CATALOG',
          ].map((t) => <span key={t} className="pg-tag">{t}</span>)}
        </div>
        <div>
          <h2>One platform. Every signal.</h2>
          <p style={{ margin: '12px 0' }}>
            Pulsegrid connects metrics, traces, logs, RUM, and security posture in a single query surface — so you can pivot from a spike in latency to the exact line of code that caused it in seconds.
          </p>
          <a href="#learn-more" onClick={(e) => e.preventDefault()} className="pg-btn pg-btn--outline">Explore the platform</a>
        </div>
      </section>

      {/* PROMO BAND */}
      <section className="pg-promo-band" id="dash">
        {/* PG-IGT-002: second <h1> on page (structural) */}
        <h1 style={{ fontSize: 28, margin: 0 }}>DASH 2026 — That's a wrap!</h1>
        <p style={{ margin: '8px 0 0' }}>
          {/* PG-007: icon button without accessible name */}
          <button
            type="button"
            style={{ background: 'transparent', border: 'none', color: '#fff', marginRight: 8, cursor: 'pointer' }}
            onClick={() => {}}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          Every keynote, product launch, and hands-on lab from our engineering conference — on demand.
        </p>
        <a href="#dash-replay" onClick={(e) => e.preventDefault()} className="pg-promo-band-cta">Watch on demand</a>
      </section>

      {/* PRODUCTS TWO-COLUMN */}
      <section className="pg-products" id="apm" aria-labelledby="products-heading">
        <div>
          <h2 id="products-heading" style={{ fontSize: 28, marginBottom: 20 }}>Products</h2>

          {/* PG-010: role="tablist" without children with role="tab" — using plain <li> */}
          <ul className="pg-products-list" role="tablist">
            {products.map((p) => (
              <li
                key={p.id}
                className={activeProduct === p.id ? 'is-active' : ''}
                onClick={() => setActiveProduct(p.id)}
              >
                {p.label}
              </li>
            ))}
          </ul>

          {/* PG-009: two navs without unique aria-label on the same page */}
          <nav style={{ marginTop: 20 }}>
            <a href="#compare" onClick={(e) => e.preventDefault()}>Compare plans</a>
            {' · '}
            <a href="#docs" onClick={(e) => e.preventDefault()}>Read the docs</a>
          </nav>
        </div>
        <div className="pg-products-preview">
          <div>
            <h3>{activeProductData?.label}</h3>
            <p style={{ margin: '12px 0 20px' }}>{activeProductData?.copy}</p>
            {/* PG-006: 4 identical "Learn more" links, only the 5th varies */}
            {activeProduct === 'apm' ? (
              <a href="#apm-learn" onClick={(e) => e.preventDefault()}>Learn more →</a>
            ) : activeProduct === 'infra' ? (
              <a href="#infra-learn" onClick={(e) => e.preventDefault()}>Learn more →</a>
            ) : activeProduct === 'logs' ? (
              <a href="#logs-learn" onClick={(e) => e.preventDefault()}>Learn more →</a>
            ) : activeProduct === 'security' ? (
              <a href="#security-learn" onClick={(e) => e.preventDefault()}>Learn more →</a>
            ) : (
              <a href="#ai-learn" onClick={(e) => e.preventDefault()}>Explore Bits AI capabilities →</a>
            )}
          </div>
        </div>
      </section>

      {/* CAREERS */}
      <section className="pg-careers" id="careers">
        <div>
          {/* PG-IGT-003: visually large heading rendered as <div>, not h# */}
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Join Our Pack</div>
          <p style={{ marginBottom: 20 }}>
            We're a team of engineers, designers, and researchers building the platform we always wanted. Fully remote, generous benefits, and yes — dogs welcome.
          </p>
          <a href="#jobs" onClick={(e) => e.preventDefault()} className="pg-btn pg-btn--outline">See open roles</a>
        </div>
        <div className="pg-careers-visual" aria-hidden="true">P</div>
      </section>

      {/* BOTTOM CTA */}
      <section className="pg-bottom-cta">
        <h2>Start monitoring in 5 minutes.</h2>
        <p>14-day free trial. No credit card. Full-featured.</p>
        <Link to="/saas/login" className="pg-btn">Get started free</Link>
      </section>
    </>
  );
}

/**
 * Miniature "dashboard screenshot" rendered inline so the marketing page has
 * a real Datadog-style visual anchor without shipping a PNG. Uses SVG.
 * PG-023 (advanced/text-contrast): tiny label text uses gray on gray.
 */
function PulsegridDashboardHero() {
  return (
    <svg viewBox="0 0 1000 400" width="100%" style={{ display: 'block', borderRadius: 8 }} aria-hidden="true">
      <defs>
        <linearGradient id="hgViolet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6366f1" stopOpacity="0.4" />
          <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hgFuchsia" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d946ef" stopOpacity="0.35" />
          <stop offset="1" stopColor="#d946ef" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1000" height="400" fill="#0a0a15" rx="6" />

      {/* KPI tiles */}
      {['Apdex 0.94', 'Errors 0.13%', 'p95 312ms', 'CPU 68%'].map((label, i) => (
        <g key={label} transform={`translate(${20 + i * 200}, 20)`}>
          <rect width="180" height="80" fill="#17162a" stroke="#2d2c48" rx="4" />
          {/* PG-023: 8px text at low contrast for advanced/text-contrast */}
          <text x="12" y="20" fill="#6b6d8a" fontSize="9">{label.split(' ')[0].toUpperCase()}</text>
          <text x="12" y="48" fill="#e6e8f0" fontSize="20" fontWeight="700">{label.split(' ')[1]}</text>
          <polyline
            fill="none" stroke="#6366f1" strokeWidth="1.5"
            points={`12,68 30,64 48,60 66,62 84,58 102,54 120,50 138,56 156,48 168,52`}
          />
        </g>
      ))}

      {/* Big area chart */}
      <g transform="translate(20, 120)">
        <rect width="620" height="260" fill="#17162a" stroke="#2d2c48" rx="4" />
        <text x="16" y="24" fill="#a3a5bd" fontSize="12" fontWeight="600">Request rate — last 4h</text>
        <path
          d="M 20 220 L 60 200 L 100 170 L 140 190 L 180 150 L 220 130 L 260 155 L 300 110 L 340 130 L 380 105 L 420 145 L 460 115 L 500 90 L 540 120 L 580 100 L 600 115 L 600 240 L 20 240 Z"
          fill="url(#hgViolet)"
        />
        <path
          d="M 20 220 L 60 200 L 100 170 L 140 190 L 180 150 L 220 130 L 260 155 L 300 110 L 340 130 L 380 105 L 420 145 L 460 115 L 500 90 L 540 120 L 580 100 L 600 115"
          fill="none" stroke="#6366f1" strokeWidth="2"
        />
        <path
          d="M 20 235 L 60 230 L 100 220 L 140 225 L 180 210 L 220 205 L 260 215 L 300 195 L 340 205 L 380 190 L 420 210 L 460 195 L 500 180 L 540 200 L 580 185 L 600 195 L 600 240 L 20 240 Z"
          fill="url(#hgFuchsia)"
        />
        <line x1="0" y1="240" x2="620" y2="240" stroke="#2d2c48" />
      </g>

      {/* Right column — hex heatmap simulation */}
      <g transform="translate(660, 120)">
        <rect width="320" height="260" fill="#17162a" stroke="#2d2c48" rx="4" />
        <text x="16" y="24" fill="#a3a5bd" fontSize="12" fontWeight="600">Host saturation</text>
        {Array.from({ length: 48 }).map((_, i) => {
          const col = i % 8;
          const row = Math.floor(i / 8);
          const hue = (i * 37) % 7 === 0 ? '#ef4444' : (i * 19) % 3 === 0 ? '#f59e0b' : '#22c55e';
          const op = 0.4 + ((i * 13) % 50) / 100;
          return (
            <rect
              key={i}
              x={20 + col * 36}
              y={44 + row * 32}
              width="30" height="26" rx="3"
              fill={hue} fillOpacity={op}
            />
          );
        })}
      </g>
    </svg>
  );
}
