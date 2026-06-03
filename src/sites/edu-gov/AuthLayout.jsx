import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import SiteSwitcher from '../../components/SiteSwitcher.jsx';
import { useAuth } from './auth.jsx';

const NAV_ITEMS = [
  { to: '/edu-gov/account',         label: 'Dashboard',      icon: 'home' },
  { to: '/edu-gov/schools',         label: 'My family',      icon: 'family' },
  { to: '/edu-gov/university',      label: 'University',     icon: 'school' },
  { to: '/edu-gov/services',        label: 'State services', icon: 'services' },
  { to: '/edu-gov/city',            label: 'City services',  icon: 'city' },
  { to: '/edu-gov/account#profile', label: 'Profile',        icon: 'user' },
];

function NavIcon({ name }) {
  const props = {
    width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  switch (name) {
    case 'home':     return <svg {...props}><path d="M3 12l9-9 9 9" /><path d="M5 10v10h14V10" /></svg>;
    case 'family':   return <svg {...props}><circle cx="9" cy="8" r="3" /><circle cx="17" cy="10" r="2" /><path d="M3 21a6 6 0 0 1 12 0" /><path d="M14 21a4 4 0 0 1 7 0" /></svg>;
    case 'school':   return <svg {...props}><path d="M12 3l10 6-10 6L2 9l10-6z" /><path d="M6 11v6c3 2 9 2 12 0v-6" /></svg>;
    case 'services': return <svg {...props}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 14h8" /></svg>;
    case 'city':     return <svg {...props}><path d="M3 21h18" /><path d="M5 21V8l7-5 7 5v13" /><path d="M10 21v-6h4v6" /></svg>;
    case 'user':     return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
    case 'doc':      return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>;
    default:         return null;
  }
}

/**
 * Authed layout used by all post-login NBC pages.
 * Persistent sidebar nav + top bar with profile menu.
 */
export default function AuthLayout() {
  const { citizen, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        menuBtnRef.current && !menuBtnRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const handleSignOut = () => {
    setMenuOpen(false);
    logout();
    navigate('/edu-gov');
  };

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <div className="auth-shell">
        <aside className="auth-sidebar" aria-label="Account navigation">
          <Link to="/edu-gov" className="auth-brand" aria-label="Northbrook Connect home">
            <span className="nbc-mark" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 20l5-9 4 6 3-4 6 7z" />
                <path d="M3 20h18" />
              </svg>
            </span>
            Northbrook Connect
          </Link>

          <nav aria-label="Account sections">
            <ul className="auth-nav-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/edu-gov/account'}
                    className={({ isActive }) =>
                      'auth-nav-link' + (isActive ? ' is-active' : '')
                    }
                  >
                    <NavIcon name={item.icon} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="auth-sidebar-foot">
            <Link to="/edu-gov" className="auth-nav-link">
              <NavIcon name="doc" /> Help &amp; FAQs
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="auth-nav-link"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="auth-main">
          <header className="auth-topbar" role="banner">
            <div />

            <div className="auth-topbar-right">
              <div className="profile-menu-wrap">
                <button
                  ref={menuBtnRef}
                  type="button"
                  className="profile-menu-btn"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <span className="profile-avatar" aria-hidden="true">
                    {citizen.firstName.charAt(0)}{citizen.lastName.charAt(0)}
                  </span>
                  <span className="profile-name">{citizen.firstName} {citizen.lastName}</span>
                </button>

                {menuOpen && (
                  <div ref={menuRef} role="menu" className="profile-menu">
                    <Link to="/edu-gov/account" role="menuitem" onClick={() => setMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/edu-gov/account#profile" role="menuitem" onClick={() => setMenuOpen(false)}>
                      Profile &amp; settings
                    </Link>
                    <button type="button" role="menuitem" onClick={handleSignOut}>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main id="main-content" className="auth-content">
            <Outlet />
          </main>
        </div>
      </div>

      <SiteSwitcher activeId="edu-gov" />
    </>
  );
}
