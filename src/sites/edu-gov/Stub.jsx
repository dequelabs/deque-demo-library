import { Link } from 'react-router-dom';
import '../_stub.css';

export default function EduGovStub() {
  return (
    <main
      className="stub-shell"
      style={{ '--stub-accent': '#1a4731', '--stub-deep': '#0d2818', '--stub-bg': '#f3efe2' }}
    >
      <span className="stub-tag">Education / Government</span>
      <h1>Northbrook Public Schools</h1>
      <p>
        This sector is stubbed pending approval of the FinTech template.
        When built out, it will include district homepage, parent-portal sign-in,
        course catalog, and a public-records request form — with a11y issues
        common to civic and education sites.
      </p>
      <ul className="stub-list">
        <li>PDF document links without descriptive text</li>
        <li>Complex data tables (school report cards) missing scope/headers</li>
        <li>Language selector that doesn't update <code>html lang</code></li>
        <li>Embedded video without captions or transcript</li>
        <li>Form fields without labels (records request)</li>
      </ul>
      <Link className="stub-cta" to="/fintech">See the FinTech template →</Link>
    </main>
  );
}
