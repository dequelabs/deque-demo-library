import { Outlet, Link, NavLink } from 'react-router-dom';
import SiteSwitcher from '../../components/SiteSwitcher.jsx';
import { useAuth } from './auth.jsx';

/**
 * Pulsegrid marketing shell — Datadog-inspired.
 *
 * Structure:
 *   1. Announcement bar (gradient banner)
 *   2. Sticky header — brand + primary nav + login/get-started
 *   3. <Outlet /> for marketing pages
 *   4. Footer — 5-column product/company/resources link grid + social
 *
 * PG-* accessibility issues purposefully introduced here are documented
 * in PULSEGRID_ACCESSIBILITY_ISSUES.md.
 */
export default function PublicLayout() {
  const { isAuthenticated } = useAuth();

  const primary = [
    { to: '/saas', label: 'Product' },
    { to: '/saas#customers', label: 'Customers' },
    { to: '/saas#pricing', label: 'Pricing' },
    { to: '/saas#solutions', label: 'Solutions' },
    { to: '/saas#docs', label: 'Docs' },
  ];

  return (
    <>
      {/* PG-001 (advanced/heading-markup): the "Announcing DASH 2026" text is
          visually styled as a heading but rendered as a <div>. */}
      <div className="pg-announce">
        <strong>DASH 2026</strong> — See what's new in the observability platform.{' '}
        <a href="#dash">Watch the keynote</a>
      </div>

      <header className="pg-public-header" role="banner">
        <Link to="/saas" className="pg-brand" aria-label="Pulsegrid home">
          <span className="pg-brand-mark" aria-hidden="true">P</span>
          Pulsegrid
        </Link>

        <nav aria-label="Primary">
          <ul className="pg-nav-list">
            {primary.map((n) => (
              <li key={n.label}>
                <NavLink to={n.to}>{n.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pg-header-cta">
          {isAuthenticated ? (
            <Link className="pg-btn pg-btn--outline" to="/saas/dashboard">Open dashboard</Link>
          ) : (
            <>
              <Link className="pg-btn pg-btn--ghost" to="/saas/login">Log in</Link>
              <Link className="pg-btn pg-btn--primary" to="/saas/login">Get started free</Link>
            </>
          )}
        </div>
      </header>

      <main id="main-content">
        <Outlet />
      </main>

      <footer className="pg-footer" role="contentinfo">
        <div className="pg-footer-grid">
          <div>
            <div className="pg-brand" style={{ marginBottom: 12 }}>
              <span className="pg-brand-mark" aria-hidden="true">P</span>
              Pulsegrid
            </div>
            <p style={{ fontSize: 13, maxWidth: 260, margin: 0 }}>
              Unified observability, security, and AI-assisted troubleshooting for modern engineering teams.
            </p>
            <div className="pg-social-row">
              <a href="#tw" className="pg-social-icon" onClick={(e) => e.preventDefault()} aria-label="Twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 3h3l-7 8 8 10h-6l-5-6-5 6H3l7-9-8-9h6l4 5z" /></svg>
              </a>
              <a href="#gh" className="pg-social-icon" onClick={(e) => e.preventDefault()} aria-label="GitHub">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0 0 12 2z" /></svg>
              </a>
              <a href="#in" className="pg-social-icon" onClick={(e) => e.preventDefault()} aria-label="LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h2v11H3V9zm5 0h2v1.6c.4-.7 1.3-1.8 3-1.8 3.2 0 3.8 2 3.8 4.7V20h-2v-5.7c0-1.4-.03-3.1-1.9-3.1-1.9 0-2.2 1.4-2.2 3v5.8H8V9z" /></svg>
              </a>
            </div>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><Link to="/saas#apm">APM</Link></li>
              <li><Link to="/saas#infra">Infrastructure</Link></li>
              <li><Link to="/saas#logs">Log Management</Link></li>
              <li><Link to="/saas#rum">Real User Monitoring</Link></li>
              <li><Link to="/saas#security">Security</Link></li>
            </ul>
          </div>
          <div>
            <h4>Solutions</h4>
            <ul>
              <li><Link to="/saas#ai">AI Observability</Link></li>
              <li><Link to="/saas#cloud">Cloud Migration</Link></li>
              <li><Link to="/saas#devsecops">DevSecOps</Link></li>
              <li><Link to="/saas#serverless">Serverless</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="/saas#about">About</Link></li>
              <li><Link to="/saas#careers">Careers</Link></li>
              <li><Link to="/saas#press">Press</Link></li>
              <li><Link to="/saas#partners">Partners</Link></li>
            </ul>
          </div>
          <div>
            <h4>Resources</h4>
            <ul>
              <li><Link to="/saas#docs">Documentation</Link></li>
              <li><Link to="/saas#blog">Blog</Link></li>
              <li><Link to="/saas#events">Events</Link></li>
              <li><Link to="/saas#support">Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="pg-footer-bottom">
          © {new Date().getFullYear()} Pulsegrid, Inc. — Deque Systems demo asset. Cookies · Privacy · Legal
        </div>
      </footer>

      <SiteSwitcher activeId="saas" />
    </>
  );
}
