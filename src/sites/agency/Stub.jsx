import { Link } from 'react-router-dom';
import '../_stub.css';

export default function AgencyStub() {
  return (
    <main
      className="stub-shell"
      style={{ '--stub-accent': '#ec4899', '--stub-deep': '#0a0a0a', '--stub-bg': '#fff0f6' }}
    >
      <span className="stub-tag">Creative Agency</span>
      <h1>Foundry &amp; Ash</h1>
      <p>
        This sector is stubbed pending approval of the FinTech template.
        Planned: image-heavy hero with auto-play media, case-study grid,
        team page, and contact form — typical agency marketing patterns
        with their typical accessibility gaps.
      </p>
      <ul className="stub-list">
        <li>Hero video that autoplays with no pause/mute control</li>
        <li>Decorative parallax that ignores prefers-reduced-motion</li>
        <li>Portfolio thumbnails with empty / decorative-only alt text</li>
        <li>Team headshots without names linked programmatically</li>
        <li>Contact form with fancy floating labels but no real labels</li>
      </ul>
      <Link className="stub-cta" to="/fintech">See the FinTech template →</Link>
    </main>
  );
}
