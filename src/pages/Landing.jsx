import { Link } from 'react-router-dom';
import { SECTORS } from '../data/sectors.js';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-top">
        <div className="brand-row">
          <span className="logo-mark" aria-hidden="true">⌬</span>
          <span className="logo-text">Deque Demo Library</span>
        </div>
        <a
          className="docs-link"
          href="https://docs.deque.com/devtools-for-web/en"
          target="_blank"
          rel="noreferrer noopener"
        >
          axe DevTools docs ↗
        </a>
      </header>

      <main className="landing-main">
        <section className="hero-block">
          <h1>Five sites. One toolkit.</h1>
          <p className="hero-sub">
            A Solutions Engineering demo library showcasing Deque's accessibility
            toolkit across five real-world sectors. Each site contains
            intentionally engineered accessibility issues that{' '}
            <strong>axe DevTools</strong>, <strong>axe Linter</strong>,{' '}
            <strong>Advanced Rules</strong>, and the{' '}
            <strong>Developer Hub</strong> are designed to find, explain, and fix.
          </p>
          <div className="hero-cta">
            <a className="btn-pill primary" href="#sectors">Browse sectors</a>
            <a
              className="btn-pill ghost"
              href="https://docs.deque.com/developer-hub/en"
              target="_blank"
              rel="noreferrer noopener"
            >
              Developer Hub
            </a>
          </div>
        </section>

        <section id="sectors" className="sectors-block">
          <h2>Pick a sector to demo</h2>
          <div className="sector-grid">
            {SECTORS.map((s) => (
              <Link
                key={s.id}
                to={s.path}
                className="sector-card"
                style={{
                  '--card-accent': s.accent,
                  '--card-deep': s.accentDeep,
                }}
              >
                <div className="card-stripe" aria-hidden="true" />
                <div className="card-body">
                  <span className="card-tag">{s.tag}</span>
                  <h3>{s.name}</h3>
                  <p>{s.blurb}</p>
                  <span className="card-cta">
                    {s.status === 'ready'
                      ? 'Open demo →'
                      : 'Stub — coming soon →'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="toolkit-block">
          <h2>What you can demo</h2>
          <div className="toolkit-grid">
            <div>
              <h4>axe DevTools (browser)</h4>
              <p className="muted">
                Run a scan on any page; surface critical, serious, and moderate
                issues with guided remediation.
              </p>
            </div>
            <div>
              <h4>axe Linter</h4>
              <p className="muted">
                Catch issues at write-time — directly inside JSX components and HTML.
              </p>
            </div>
            <div>
              <h4>Advanced Rules / IGT</h4>
              <p className="muted">
                Intelligent Guided Tests for the things automation alone can't
                catch — focus traps, keyboard support, color-only meaning.
              </p>
            </div>
            <div>
              <h4>Developer Hub</h4>
              <p className="muted">
                Centralized triage, scan history, and team-wide reporting.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-foot">
        Built for the Deque Solutions Engineering team. ©{' '}
        {new Date().getFullYear()} — internal demo asset.
      </footer>
    </div>
  );
}
