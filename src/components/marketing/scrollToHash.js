/**
 * Click handler for in-page anchor links (href="#some-id") inside a HashRouter app.
 *
 * Without this, clicking <a href="#math"> sets location.hash = "#math",
 * which HashRouter interprets as a navigation to a route named "math".
 * That route doesn't exist, so the catch-all <Navigate to="/"/> kicks in
 * and the user is dumped back at the landing page.
 *
 * Instead, we suppress the navigation, find the element by id, scroll it
 * into view (respecting prefers-reduced-motion), and move focus to it for
 * AT users.
 *
 * Usage in any CTA-style component:
 *   <a href={href} onClick={handleHashClick(href)}>label</a>
 */
export function handleHashClick(href) {
  if (!href || !href.startsWith('#') || href === '#') return undefined;
  return (e) => {
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return; // fall through to default browser behaviour
    e.preventDefault();
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    // Make the target focusable if it isn't, so focus follows the scroll.
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus({ preventScroll: true });
  };
}
