import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import SiteSwitcher from '../../components/SiteSwitcher.jsx';
import { useAuth } from './auth.jsx';

const NAV_ITEMS = [
  { to: '/fintech/dashboard', label: 'Overview',          icon: 'home' },
  { to: '/fintech/transfer',  label: 'Transfer money',    icon: 'arrows' },
  { to: '/fintech/bills',     label: 'Pay bills',         icon: 'invoice' },
  { to: '/fintech/deposit',   label: 'Mobile deposit',    icon: 'check' },
  { to: '/fintech/statements',label: 'Statements & tax',  icon: 'doc' },
  { to: '/fintech/cards',     label: 'Cards',             icon: 'card' },
  { to: '/fintech/profile',   label: 'Profile',           icon: 'user' },
];

function NavIcon({ name }) {
  const props = {
    width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  switch (name) {
    case 'home':    return <svg {...props}><path d="M3 12l9-9 9 9" /><path d="M5 10v10h14V10" /></svg>;
    case 'arrows':  return <svg {...props}><path d="M7 17l-4-4 4-4" /><path d="M3 13h18" /><path d="M17 7l4 4-4 4" /></svg>;
    case 'invoice': return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/></svg>;
    case 'check':   return <svg {...props}><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h6"/></svg>;
    case 'doc':     return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>;
    case 'card':    return <svg {...props}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>;
    case 'user':    return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    default:        return null;
  }
}

/**
 * Authed layout used by all post-login pages.
 * Includes a persistent sidebar nav and a top bar with profile menu.
 */
export default function AuthLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const menuRef = useRef(null);

  // Close profile menu on outside click + Escape
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
    navigate('/fintech');
  };

  return (
    <>
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <div className="auth-shell">
        {/* Sidebar */}
        <aside className="auth-sidebar" aria-label="Account navigation">
          <Link to="/fintech" className="auth-brand" aria-label="DQBC home">
            <span className="fintech-mark" aria-hidden="true" />
            DQBC
          </Link>

          <nav aria-label="Account sections">
            <ul className="auth-nav-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/fintech/dashboard'}
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
            <Link to="/fintech/help" className="auth-nav-link">
              <NavIcon name="doc" /> Help center
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="auth-nav-link auth-nav-link--button"
            >
              Sign out
            </button>
          </div>
        </aside>

        {/* Main column */}
        <div className="auth-main">
          <header className="auth-topbar" role="banner">
            <div>
              {/* Page title slot — pages set this via the <PageTitle> helper */}
            </div>

            <div className="auth-topbar-right">
              {/* PHASE-2 a11y issue MT-007 — see ACCESSIBILITY_ISSUES.md
                  Two icon-btns at 20×20 inside a tight wrapper (gap: 2). Each is
                  under the WCAG 2.5.8 24×24 touch-target minimum AND their
                  centers are ~22 px apart — below the 24 px spacing-exception
                  threshold. axe-core `target-size` fires (Serious, WCAG 2.5.8 AA,
                  new in 2.2). Classic dense-topbar mistake. */}
              {/* Icons here are INFORMATIVE — the bell and envelope each
                  carry meaning independent of the surrounding text. Automated
                  Images IGT was previously flagging them as decorative
                  because the SVGs had aria-hidden="true" while the button
                  carried aria-label. Moved the accessible name onto the SVG
                  (role="img" + aria-label) so the IGT correctly categorises
                  each icon as informative. */}
              <div style={{ display: 'inline-flex', gap: 2 }}>
                <button
                  type="button"
                  className="icon-btn"
                  style={{ width: 20, height: 20 }}
                >
                  <svg
                    role="img"
                    aria-label="Messages"
                    focusable="false"
                    width="12" height="12" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  style={{ width: 20, height: 20 }}
                >
                  <svg
                    role="img"
                    aria-label="Notifications"
                    focusable="false"
                    width="12" height="12" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </button>
              </div>

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
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                  <span className="profile-name">{user.firstName} {user.lastName}</span>
                </button>

                {menuOpen && (
                  <div ref={menuRef} role="menu" className="profile-menu">
                    <Link to="/fintech/profile" role="menuitem" onClick={() => setMenuOpen(false)}>
                      Profile &amp; settings
                    </Link>
                    <Link to="/fintech/statements" role="menuitem" onClick={() => setMenuOpen(false)}>
                      Statements &amp; tax
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                    >
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

      <SiteSwitcher activeId="fintech" />
    </>
  );
}
