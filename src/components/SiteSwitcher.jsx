import { Link } from 'react-router-dom';
import { SECTORS } from '../data/sectors.js';

/**
 * Slim footer-resident sector switcher (banner-height).
 * Lets the demoer hop between sectors without backing out to the landing page.
 */
export default function SiteSwitcher({ activeId }) {
  return (
    <nav className="site-switcher" aria-label="Demo library">
      <div className="switcher-inner">
        <Link to="/" className="switcher-home">
          <span className="switcher-mark" aria-hidden="true">⌬</span>
          Deque Demo Library
        </Link>
        <div className="switcher-list">
          {SECTORS.map((s) => (
            <Link
              key={s.id}
              to={s.path}
              className={'switcher-link' + (s.id === activeId ? ' is-active' : '')}
              aria-current={s.id === activeId ? 'page' : undefined}
            >
              {s.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
