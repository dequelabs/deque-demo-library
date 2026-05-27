import { useRef, useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import SiteSwitcher from '../../components/SiteSwitcher.jsx';
import { useAuth } from './auth.jsx';
import SearchPopover from './SearchPopover.jsx';

/**
 * Public layout: marketing site header + footer.
 * Used by every public marketing page in the FinTech sector.
 */
export default function PublicLayout() {
  const { isAuthenticated } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const searchBtnRef = useRef(null);

  return (
    <>
      {/* Top utility bar */}
      <div className="fintech-topbar">
        <span>FDIC Insured · Member since 1923</span>
        <span>
          <Link to="/fintech/help">Help</Link> &nbsp;|&nbsp;
          <Link to="/fintech/help#branches">Find a branch</Link>
        </span>
      </div>

      <header className="fintech-header" role="banner">
        <Link className="fintech-brand" to="/fintech" aria-label="DQBC home">
          <span className="fintech-mark" aria-hidden="true" />
          DQBC
        </Link>

        <nav aria-label="Primary">
          <ul className="fintech-nav-list">
            <li><NavLink to="/fintech"          end>Personal</NavLink></li>
            <li><NavLink to="/fintech/business">Business</NavLink></li>
            <li><NavLink to="/fintech/wealth">Wealth</NavLink></li>
            <li><NavLink to="/fintech/about">About</NavLink></li>
          </ul>
        </nav>

        <div className="fintech-nav-cta">
          <button
            ref={searchBtnRef}
            type="button"
            className="icon-btn"
            aria-label="Search DQBC"
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
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

          {isAuthenticated ? (
            <Link className="btn btn-primary" to="/fintech/dashboard">My accounts</Link>
          ) : (
            <Link className="btn btn-outline" to="/fintech/login">Sign in</Link>
          )}
          <Link className="btn btn-accent btn-accent--accessible" to="/fintech/login">Open account</Link>
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
            <h4>Personal</h4>
            <ul>
              <li><Link to="/fintech/checking">Checking</Link></li>
              <li><Link to="/fintech/savings">Savings</Link></li>
              <li><Link to="/fintech/credit-cards">Credit cards</Link></li>
              <li><Link to="/fintech/mortgages">Mortgages</Link></li>
            </ul>
          </div>
          <div>
            <h4>Business</h4>
            <ul>
              <li><Link to="/fintech/business#services">Business checking</Link></li>
              <li><Link to="/fintech/business#services">Lending</Link></li>
              <li><Link to="/fintech/business#services">Treasury</Link></li>
              <li><Link to="/fintech/wealth">Wealth management</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
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
