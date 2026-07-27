import { useRef, useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import SiteSwitcher from '../../components/SiteSwitcher.jsx';
import { useAuth } from './auth.jsx';
import SearchPopover from './SearchPopover.jsx';

/**
 * Public layout: multi-row consumer-banking header + marketing footer.
 *
 * Header structure (top-to-bottom):
 *   1. FDIC strip — deposit-insurance disclosure
 *   2. Utility nav — audience buckets (left) + support links (right)
 *   3. Logo + search — brand mark left, search input right
 *   4. Product nav — main category links with dropdown carets
 */
export default function PublicLayout() {
  const { isAuthenticated } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const searchBtnRef = useRef(null);

  const productLinks = [
    { to: '/fintech/checking', label: 'Checking' },
    { to: '/fintech/savings', label: 'Savings & CDs' },
    { to: '/fintech/cards', label: 'Credit Cards' },
    { to: '/fintech/mortgages', label: 'Home Loans' },
    { to: '/fintech/mortgages', label: 'Auto Loans' },
    { to: '/fintech/wealth', label: 'Wealth Management' },
    { to: '/fintech/help', label: 'Money Tips' },
  ];

  return (
    <>
      {/* All 4 header rows live inside a single <header role="banner"> so
          axe-core's `region` best-practice rule doesn't fire on any of them. */}
      <header className="site-header" role="banner">
        {/* Row 1 — FDIC strip */}
        <div className="fdic-strip">
          <span>DQBC deposit products:</span>
          <span className="fdic-badge" aria-label="FDIC">
            <span className="fdic-badge-f">F</span>
            <span className="fdic-badge-d">D</span>
            <span className="fdic-badge-i">I</span>
            <span className="fdic-badge-c">C</span>
          </span>
          <span>FDIC-Insured — Backed by the full faith and credit of the U.S. Government</span>
        </div>

        {/* Row 2 — Utility nav */}
        <div className="utility-nav">
          <nav aria-label="Audience">
            <ul>
              <li><NavLink to="/fintech" end>Personal</NavLink></li>
              <li><NavLink to="/fintech/wealth">Wealth Management</NavLink></li>
              <li><NavLink to="/fintech/business">Business</NavLink></li>
              <li><NavLink to="/fintech/business#institutions">Corporations &amp; Institutions</NavLink></li>
            </ul>
          </nav>
          <nav aria-label="Support">
            <ul>
              <li><Link to="/fintech/legal#security">Security</Link></li>
              <li><Link to="/fintech/about">About Us</Link></li>
              <li>
                <a href="#es" onClick={(e) => e.preventDefault()} className="lang-switch">
                  <span className="globe-icon" aria-hidden="true">🌐</span>
                  En español
                </a>
              </li>
              <li className="utility-divider" aria-hidden="true">|</li>
              <li><Link to="/fintech/help#contact">Contact Us</Link></li>
              <li><Link to="/fintech/help">Help</Link></li>
            </ul>
          </nav>
        </div>

        {/* Row 3 — Logo + search */}
        <div className="logo-search-row">
          <Link className="brand-logo" to="/fintech" aria-label="DQBC home">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 16" width="34" height="22" aria-hidden="true">
                <path d="M2 8 L10 4 L18 8 L10 12 Z" fill="#b71c1c" />
                <rect x="0" y="14" width="24" height="1.5" fill="#0a2540" />
                <rect x="0" y="11" width="24" height="1.5" fill="#0a2540" />
                <rect x="0" y="8" width="14" height="1.5" fill="#0a2540" />
              </svg>
            </span>
            <span className="brand-wordmark">DQBC</span>
          </Link>

          <div className="header-search">
            <label htmlFor="header-search-input" className="sr-only">Search DQBC</label>
            <input
              id="header-search-input"
              ref={searchBtnRef}
              type="search"
              placeholder="Search"
              onFocus={() => setSearchOpen(true)}
            />
            <button
              type="button"
              className="header-search-btn"
              aria-label="Submit search"
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-5-5" />
              </svg>
            </button>
            <SearchPopover
              open={searchOpen}
              onClose={() => setSearchOpen(false)}
              returnFocusRef={searchBtnRef}
            />
          </div>
        </div>

        {/* Row 4 — Product nav */}
        <div className="product-nav">
          <nav aria-label="Primary">
            <ul>
              {productLinks.map((p) => (
                <li key={p.label}>
                  <NavLink to={p.to}>
                    {p.label}
                    <span className="nav-caret" aria-hidden="true">▾</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="product-nav-cta">
            {isAuthenticated ? (
              <Link className="btn-link" to="/fintech/dashboard">My accounts</Link>
            ) : (
              <Link className="btn-link" to="/fintech/login">Sign in</Link>
            )}
          </div>
        </div>
      </header>

      <main id="main-content">
        <Outlet />
      </main>

      <footer className="fintech-footer" role="contentinfo">
        <div className="footer-grid">
          <div>
            <div className="fintech-brand" style={{ color: '#fff' }}>
              <span className="fintech-mark" aria-hidden="true" /> DQBC
            </div>
            <p style={{ fontSize: 13, color: '#b8c4d6', margin: '6px 0 12px' }}>
              Deque Banking Corporation
            </p>
            <p style={{ fontSize: 13, maxWidth: 320, margin: 0 }}>
              Banking, lending, and wealth services for the way you actually live.
              FDIC insured. Equal housing lender.
            </p>
          </div>
          <div>
            <h3>Personal</h3>
            <ul>
              <li><Link to="/fintech/checking">Checking</Link></li>
              <li><Link to="/fintech/savings">Savings</Link></li>
              <li><Link to="/fintech/credit-cards">Credit cards</Link></li>
              <li><Link to="/fintech/mortgages">Mortgages</Link></li>
            </ul>
          </div>
          <div>
            <h3>Business</h3>
            <ul>
              <li><Link to="/fintech/business#services">Business checking</Link></li>
              <li><Link to="/fintech/business#services">Lending</Link></li>
              <li><Link to="/fintech/business#services">Treasury</Link></li>
              <li><Link to="/fintech/wealth">Wealth management</Link></li>
            </ul>
          </div>
          <div>
            <h3>Company</h3>
            <ul>
              <li><Link to="/fintech/about">About</Link></li>
              <li><Link to="/fintech/help">Help &amp; support</Link></li>
              <li><Link to="/fintech/legal">Legal &amp; disclosures</Link></li>
              <li><Link to="/fintech/legal#accessibility">Accessibility</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Deque Banking Corporation. All rights reserved.
        </div>
      </footer>

      <SiteSwitcher activeId="fintech" />
    </>
  );
}
