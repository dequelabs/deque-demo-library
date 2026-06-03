import { Outlet, Link, NavLink } from 'react-router-dom';
import SiteSwitcher from '../../components/SiteSwitcher.jsx';
import { useAuth } from './auth.jsx';

/**
 * Public layout for Northbrook Connect: top utility bar, government-style
 * header with primary nav, and a public footer.
 */
function NBCMark() {
  return (
    <span className="nbc-mark" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 20l5-9 4 6 3-4 6 7z" />
        <path d="M3 20h18" />
      </svg>
    </span>
  );
}

export default function PublicLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Top utility bar */}
      <div className="nbc-topbar">
        <span>Northbrook State · An official government portal</span>
        <span>
          <Link to="/edu-gov">Help</Link> &nbsp;|&nbsp;
          <Link to="/edu-gov">Languages</Link>
        </span>
      </div>

      <header className="nbc-header" role="banner">
        <Link className="nbc-brand" to="/edu-gov" aria-label="Northbrook Connect home">
          <NBCMark />
          Northbrook Connect
        </Link>

        <nav aria-label="Primary">
          <ul className="nbc-nav-list">
            <li><NavLink to="/edu-gov/schools">Schools</NavLink></li>
            <li><NavLink to="/edu-gov/university">University</NavLink></li>
            <li><NavLink to="/edu-gov/services">Services</NavLink></li>
            <li><NavLink to="/edu-gov/city">City</NavLink></li>
            <li><NavLink to="/edu-gov/about">About</NavLink></li>
          </ul>
        </nav>

        <div className="nbc-nav-cta">
          {isAuthenticated ? (
            <Link className="btn btn-primary" to="/edu-gov/account">My account</Link>
          ) : (
            <Link className="btn btn-outline" to="/edu-gov/login">Sign in</Link>
          )}
          <Link className="btn btn-accent--accessible" to="/edu-gov/login">Create account</Link>
        </div>
      </header>

      <main id="main-content">
        <Outlet />
      </main>

      <footer className="nbc-footer" role="contentinfo">
        <div className="footer-grid">
          <div>
            <div className="nbc-brand" style={{ color: '#fff' }}>
              <NBCMark /> Northbrook Connect
            </div>
            <p style={{ fontSize: 13, color: '#aebfb6', margin: '6px 0 12px' }}>
              An official portal of Northbrook State.
            </p>
            <p style={{ fontSize: 13, maxWidth: 320, margin: 0 }}>
              One sign-in for K-12 schools, public university, state services,
              and city services across Northbrook.
            </p>
          </div>
          <div>
            <h4>Schools</h4>
            <ul>
              <li><Link to="/edu-gov/schools">District home</Link></li>
              <li><Link to="/edu-gov/schools/enroll">Online enrollment</Link></li>
              <li><Link to="/edu-gov/schools/grades">Grade portal</Link></li>
              <li><Link to="/edu-gov/schools">School calendar</Link></li>
            </ul>
          </div>
          <div>
            <h4>Government</h4>
            <ul>
              <li><Link to="/edu-gov/services">DMV &amp; vehicles</Link></li>
              <li><Link to="/edu-gov/services">Benefits</Link></li>
              <li><Link to="/edu-gov/city">Permits</Link></li>
              <li><Link to="/edu-gov/city">Voter information</Link></li>
            </ul>
          </div>
          <div>
            <h4>About</h4>
            <ul>
              <li><Link to="/edu-gov/about">About this portal</Link></li>
              <li><Link to="/edu-gov/about">Accessibility</Link></li>
              <li><Link to="/edu-gov/about">Contact</Link></li>
              <li><Link to="/edu-gov/about">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Northbrook State. All rights reserved.
        </div>
      </footer>

      <SiteSwitcher activeId="edu-gov" />
    </>
  );
}
