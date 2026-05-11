import { Link } from 'react-router-dom';
import '../_stub.css';

export default function HospitalityStub() {
  return (
    <main
      className="stub-shell"
      style={{ '--stub-accent': '#d97757', '--stub-deep': '#3a1d12', '--stub-bg': '#fbf1e6' }}
    >
      <span className="stub-tag">Hospitality</span>
      <h1>Cala Verde Resort</h1>
      <p>
        This sector is stubbed pending approval of the FinTech template.
        Planned: resort homepage, room booking with date picker, room cards,
        amenities, checkout / confirmation — booking-flow patterns with their
        well-known accessibility pitfalls.
      </p>
      <ul className="stub-list">
        <li>Custom date picker with no keyboard support or AT announcements</li>
        <li>Calendar availability indicated by color only</li>
        <li>Room "card" links built from divs with onClick</li>
        <li>Image carousel with no controls and auto-rotation</li>
        <li>Multi-step booking with no progress / step indicator for AT</li>
      </ul>
      <Link className="stub-cta" to="/fintech">See the FinTech template →</Link>
    </main>
  );
}
