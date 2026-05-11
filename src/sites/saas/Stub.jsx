import { Link } from 'react-router-dom';
import '../_stub.css';

export default function SaasStub() {
  return (
    <main
      className="stub-shell"
      style={{ '--stub-accent': '#6366f1', '--stub-deep': '#1e1b4b', '--stub-bg': '#f3f4ff' }}
    >
      <span className="stub-tag">SaaS</span>
      <h1>Pulsegrid Analytics</h1>
      <p>
        This sector is stubbed pending approval of the FinTech template.
        Planned: marketing page, login, app shell with navigation, dashboard
        with charts and data tables, settings/preferences, team management.
      </p>
      <ul className="stub-list">
        <li>Custom dropdowns and combo boxes lacking ARIA pattern + keyboard</li>
        <li>Charts with color-only legends and no text alternative</li>
        <li>Sortable data tables missing aria-sort</li>
        <li>Settings forms with grouped controls but no fieldset/legend</li>
        <li>Toast notifications that aren't announced to assistive tech</li>
      </ul>
      <Link className="stub-cta" to="/fintech">See the FinTech template →</Link>
    </main>
  );
}
