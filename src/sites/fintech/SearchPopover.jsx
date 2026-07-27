import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Accessible site-search popover.
 *
 * Pattern: WAI-ARIA combobox with a popup listbox.
 *  - The wrapping <div> is role="dialog" + aria-modal="true" so screen readers
 *    treat the panel as a focused modal context.
 *  - The text input is role="combobox", aria-expanded, aria-controls,
 *    aria-activedescendant — the active descendant pattern (not focus moves)
 *    so the user keeps typing while arrowing through results.
 *  - Results are role="listbox" / role="option".
 *  - A polite live region announces result counts.
 *
 * Behaviour:
 *  - Escape or outside-click closes and returns focus to the opener.
 *  - Arrow Up/Down moves the active option, wrapping at the ends.
 *  - Enter navigates to the active option's path (or first match if none active).
 *  - Empty query shows a Popular section.
 */

// Static catalogue of searchable destinations. Keywords broaden the match
// beyond just the label (e.g. typing "atm" surfaces "Find a branch").
const CATALOG = [
  // Personal banking
  { group: 'Personal',    label: 'Checking accounts',     path: '/fintech/checking',     keywords: 'everyday debit free atm' },
  { group: 'Personal',    label: 'Savings accounts',      path: '/fintech/savings',      keywords: 'apy interest high yield smart' },
  { group: 'Personal',    label: 'Credit cards',          path: '/fintech/credit-cards', keywords: 'visa rewards cashback travel apr' },
  { group: 'Personal',    label: 'Mortgages & home loans',path: '/fintech/mortgages',    keywords: 'home loan refinance heloc rate' },

  // Online-banking pages (work whether signed in or not — protected route
  // will bounce to /login if you aren't authed)
  { group: 'My accounts', label: 'Sign in',               path: '/fintech/login',        keywords: 'log in account portal' },
  { group: 'My accounts', label: 'Dashboard / overview',  path: '/fintech/dashboard',    keywords: 'balance summary' },
  { group: 'My accounts', label: 'Transfer money',        path: '/fintech/transfer',     keywords: 'send move accounts wire ach' },
  { group: 'My accounts', label: 'Pay bills',             path: '/fintech/bills',        keywords: 'payee schedule payment bill pay' },
  { group: 'My accounts', label: 'Mobile check deposit',  path: '/fintech/deposit',      keywords: 'remote deposit camera capture' },
  { group: 'My accounts', label: 'Statements & tax docs', path: '/fintech/statements',   keywords: '1099 tax pdf monthly download' },
  { group: 'My accounts', label: 'Cards',                 path: '/fintech/cards',        keywords: 'lock unlock limit spending debit credit' },
  { group: 'My accounts', label: 'Profile & settings',    path: '/fintech/profile',     keywords: 'address phone notifications preferences' },

  // Other lines of business
  { group: 'Business',    label: 'Business banking',      path: '/fintech/business',     keywords: 'commercial small business treasury lending' },
  { group: 'Wealth',      label: 'Wealth management',     path: '/fintech/wealth',       keywords: 'investing brokerage advisor portfolio retirement' },

  // Help & company
  { group: 'Help',        label: 'Help center',           path: '/fintech/help',         keywords: 'support contact faq question' },
  { group: 'Help',        label: 'Find a branch or ATM',  path: '/fintech/help#branches',keywords: 'location atm branch near zip directions' },
  { group: 'Help',        label: 'Forgot your password',  path: '/fintech/forgot',       keywords: 'reset password recover username locked' },
  { group: 'Company',     label: 'About DQBC',            path: '/fintech/about',        keywords: 'company leadership values history' },
  { group: 'Company',     label: 'Legal & disclosures',   path: '/fintech/legal',        keywords: 'terms privacy disclosures' },
  { group: 'Company',     label: 'Accessibility',         path: '/fintech/legal#accessibility', keywords: 'accessibility wcag a11y disability' },
];

// Items shown when the query is empty — a curated "Popular" set.
const POPULAR_PATHS = [
  '/fintech/login',
  '/fintech/transfer',
  '/fintech/bills',
  '/fintech/help',
  '/fintech/checking',
  '/fintech/credit-cards',
];

function filterCatalog(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return CATALOG
      .filter((it) => POPULAR_PATHS.includes(it.path))
      .map((it) => ({ ...it, group: 'Popular' }));
  }
  return CATALOG.filter((it) => {
    const hay = (it.label + ' ' + it.keywords + ' ' + it.path).toLowerCase();
    return hay.includes(q);
  });
}

export default function SearchPopover({ open, onClose, returnFocusRef }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const listboxId = useId();
  const headingId = useId();
  const statusId = useId();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => filterCatalog(query), [query]);

  // Reset state every time the popover opens, and focus the input.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
    // Defer focus until after the panel paints
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  // Outside-click + Escape handling.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (!panelRef.current) return;
      if (panelRef.current.contains(e.target)) return;
      // Clicks on the opener button are handled by its onClick toggle, so
      // ignore those to prevent immediate re-open.
      if (returnFocusRef?.current && returnFocusRef.current.contains(e.target)) return;
      onClose();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      // Focus trap — Tab from the last focusable inside the panel wraps to
      // the first; Shift+Tab from the first wraps to the last. Without this
      // the Keyboard IGT tabs out of the popover into the (visually hidden)
      // underlying page and appears "stuck" — focus is somewhere invisible
      // and the popover is still on top.
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll(
        'input, button, [href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, returnFocusRef]);

  // Return focus to the opener when closing.
  const wasOpen = useRef(open);
  useEffect(() => {
    if (wasOpen.current && !open && returnFocusRef?.current) {
      returnFocusRef.current.focus();
    }
    wasOpen.current = open;
  }, [open, returnFocusRef]);

  // Reset active index if the result set shrinks.
  useEffect(() => {
    if (activeIndex >= results.length) setActiveIndex(results.length ? 0 : -1);
  }, [results, activeIndex]);

  if (!open) return null;

  const go = (item) => {
    if (!item) return;
    onClose();
    // Trailing fragment (#branches, #accessibility) needs to scroll on arrival;
    // the destination pages handle this on mount via the URL hash.
    navigate(item.path);
  };

  const onInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!results.length) return;
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!results.length) return;
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Home') {
      if (results.length) { e.preventDefault(); setActiveIndex(0); }
    } else if (e.key === 'End') {
      if (results.length) { e.preventDefault(); setActiveIndex(results.length - 1); }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[activeIndex] ?? results[0]);
    }
  };

  // Group results for display while keeping a single flat index for keyboarding.
  const grouped = results.reduce((acc, item, idx) => {
    const last = acc[acc.length - 1];
    if (!last || last.group !== item.group) {
      acc.push({ group: item.group, items: [{ ...item, _idx: idx }] });
    } else {
      last.items.push({ ...item, _idx: idx });
    }
    return acc;
  }, []);

  const optionId = (i) => `${listboxId}-opt-${i}`;
  const activeId = activeIndex >= 0 && activeIndex < results.length ? optionId(activeIndex) : undefined;

  return (
    <>
      {/* Backdrop — purely decorative, so aria-hidden. Click handled by outside listener. */}
      <div className="search-backdrop" aria-hidden="true" />

      <div
        ref={panelRef}
        className="search-popover"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <h2 id={headingId} className="search-popover-title">Search DQBC</h2>

        <div className="search-popover-inputwrap">
          <svg
            className="search-popover-icon"
            width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-5-5" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="search-popover-input"
            placeholder="Try 'transfer', 'rates', 'ATM'…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
            onKeyDown={onInputKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-describedby={statusId}
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="button"
            className="search-popover-close"
            onClick={onClose}
            aria-label="Close search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <p id={statusId} className="search-popover-status" aria-live="polite">
          {query.trim()
            ? `${results.length} result${results.length === 1 ? '' : 's'} for "${query.trim()}"`
            : 'Popular destinations'}
        </p>

        {results.length === 0 ? (
          <div className="search-popover-empty">
            <p>No matches for <strong>"{query}"</strong>.</p>
            <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>
              Try a different keyword, or visit the{' '}
              <a
                href="#/fintech/help"
                onClick={(e) => { e.preventDefault(); go({ path: '/fintech/help' }); }}
              >
                Help center
              </a>.
            </p>
          </div>
        ) : (
          <ul
            id={listboxId}
            role="listbox"
            aria-labelledby={headingId}
            className="search-popover-list"
          >
            {grouped.map((g) => (
              <li key={g.group} role="presentation" className="search-popover-group">
                <div className="search-popover-grouplabel" aria-hidden="true">{g.group}</div>
                <ul role="presentation" className="search-popover-sublist">
                  {g.items.map((item) => {
                    const isActive = item._idx === activeIndex;
                    return (
                      <li
                        key={item.path}
                        id={optionId(item._idx)}
                        role="option"
                        aria-selected={isActive}
                        className={'search-popover-option' + (isActive ? ' is-active' : '')}
                        onMouseEnter={() => setActiveIndex(item._idx)}
                        onMouseDown={(e) => {
                          // Use mousedown so the click fires before the input loses focus.
                          e.preventDefault();
                          go(item);
                        }}
                      >
                        <span className="search-popover-optionlabel">{item.label}</span>
                        <span className="search-popover-optionpath">{item.path}</span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}

        <div className="search-popover-hints">
          <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Open</span>
          <span><kbd>Esc</kbd> Close</span>
        </div>
      </div>
    </>
  );
}
