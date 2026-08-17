import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import SiteSwitcher from '../../components/SiteSwitcher.jsx';
import { useAuth } from './auth.jsx';
import { useStore } from './store.jsx';

/**
 * Pulsegrid post-login shell — Datadog-style dark app chrome.
 *
 * - Left sidebar: Dashboards / APM / Infrastructure / Logs / Alerts / Security
 * - Topbar: global search combobox (interactive), notifications, user menu
 * - Global keyboard shortcut: "/" focuses search (like Datadog + GitHub)
 *
 * Interactive elements deliberately introduce PG-IGT-* accessibility issues:
 * incorrect ARIA on the combobox, focus not returned when menus close, and
 * one modal (rendered in Dashboard) that traps focus incorrectly.
 */
export default function AuthLayout() {
  const nav = useNavigate();
  const { user, signOut } = useAuth();
  const { state } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const searchRef = useRef(null);
  const userBtnRef = useRef(null);

  // "/" global shortcut to focus the search
  useEffect(() => {
    function onKey(e) {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setUserOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const searchResults = [
    ...state.services.map((s) => ({ kind: 'Service', label: s.name, id: s.id })),
    ...state.alerts.map((a) => ({ kind: 'Alert', label: a.title, id: a.id })),
    ...state.hosts.slice(0, 8).map((h) => ({ kind: 'Host', label: h.id, id: h.id })),
  ].filter((r) => !searchQuery || r.label.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8);

  const links = [
    { section: 'Observability', items: [
      { to: '/saas/dashboard', label: 'Dashboards', icon: '▦' },
      { to: '/saas/services', label: 'Services (APM)', icon: '⟴' },
      { to: '/saas/hosts', label: 'Infrastructure', icon: '☰' },
      { to: '/saas/logs', label: 'Logs', icon: '≣' },
    ]},
    { section: 'Response', items: [
      { to: '/saas/alerts', label: 'Alerts', icon: '⚠' },
      { to: '/saas/incidents', label: 'Incidents', icon: '⛑' },
    ]},
    { section: 'Security', items: [
      { to: '/saas/security', label: 'Threats', icon: '⛨' },
    ]},
  ];

  return (
    <div className="pg-auth-shell">
      <aside className="pg-sidebar" aria-label="Product">
        <Link className="pg-sidebar-brand" to="/saas/dashboard">
          <span className="pg-brand-mark" aria-hidden="true">P</span>
          Pulsegrid
        </Link>

        {links.map((section) => (
          <div key={section.section}>
            <div className="pg-sidebar-section-label">{section.section}</div>
            <ul className="pg-sidebar-nav">
              {section.items.map((it) => (
                <li key={it.to}>
                  <NavLink to={it.to} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                    <span aria-hidden="true">{it.icon}</span>
                    {it.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div style={{ flex: 1 }} />
        <div className="pg-sidebar-section-label">Account</div>
        <ul className="pg-sidebar-nav">
          <li>
            <NavLink to="/saas/settings" className={({ isActive }) => (isActive ? 'is-active' : '')}>
              <span aria-hidden="true">⚙</span> Settings
            </NavLink>
          </li>
        </ul>
      </aside>

      <div>
        <header className="pg-topbar" role="banner">
          {/* PG-IGT-COMBOBOX: this control renders a listbox on typing but
              the ARIA relationships aren't wired up — no aria-controls,
              no aria-activedescendant, no role="combobox". Keyboard IGT
              flags this as an unlabeled/unrelated interactive control. */}
          <div className="pg-search">
            <span className="pg-search-icon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-5-5" />
              </svg>
            </span>
            <input
              ref={searchRef}
              className="pg-search-input"
              type="search"
              placeholder="Search services, alerts, hosts, dashboards… (press / to focus)"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
              aria-label="Global search"
            />
            {searchOpen && searchResults.length > 0 && (
              <div className="pg-search-menu">
                {searchResults.map((r) => (
                  <div key={`${r.kind}-${r.id}`} onMouseDown={() => { setSearchQuery(r.label); setSearchOpen(false); }}>
                    <span style={{ color: '#a3a5bd', marginRight: 8, fontSize: 11, textTransform: 'uppercase' }}>{r.kind}</span>
                    {r.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pg-topbar-actions">
            <NavLink to="/saas/alerts" className="pg-icon-btn" aria-label="Alerts">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10 21a2 2 0 0 0 4 0" />
              </svg>
            </NavLink>

            <button
              ref={userBtnRef}
              type="button"
              className="pg-avatar"
              aria-label={`Account menu for ${user.firstName} ${user.lastName}`}
              aria-haspopup="menu"
              aria-expanded={userOpen}
              onClick={() => setUserOpen((v) => !v)}
            >
              {user.avatarInitials}
            </button>

            {userOpen && (
              <div className="pg-user-menu" role="menu">
                <div style={{ borderBottom: '1px solid var(--pg-border)', pointerEvents: 'none' }}>
                  <div style={{ color: 'var(--pg-text)' }}>{user.firstName} {user.lastName}</div>
                  <div style={{ fontSize: 11, color: 'var(--pg-text-muted)' }}>{user.email}</div>
                </div>
                <Link to="/saas/settings" role="menuitem" onClick={() => setUserOpen(false)}>Settings</Link>
                <Link to="/saas/settings#billing" role="menuitem" onClick={() => setUserOpen(false)}>Billing</Link>
                <Link to="/saas#docs" role="menuitem" onClick={() => setUserOpen(false)}>Docs</Link>
                <button type="button" role="menuitem" onClick={() => { signOut(); setUserOpen(false); nav('/saas'); }}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <main id="main-content" className="pg-main">
          <Outlet />
        </main>
      </div>

      <SiteSwitcher activeId="saas" />
    </div>
  );
}
