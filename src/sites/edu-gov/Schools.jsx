import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import { useStore } from './store.jsx';

/**
 * Northbrook Public Schools district home.
 * Public (no login required to view). Shows the four-school directory
 * and an upcoming-events strip. A "sign in to enroll" CTA is shown to
 * unauthenticated visitors; the same area shows a "success" banner after
 * the enrollment flow redirects here with state.justEnrolled.
 */
export default function Schools() {
  const { isAuthenticated } = useAuth();
  const { state } = useStore();
  const location = useLocation();
  const justEnrolled = location.state?.justEnrolled;

  return (
    <>
      <section className="nbc-hero" aria-labelledby="schools-h">
        <div>
          <span className="nbc-pill">Northbrook State School District</span>
          <h1 id="schools-h">Northbrook Public Schools</h1>
          <p className="sub">
            Four public schools serving every grade from kindergarten through
            twelfth grade, plus a fully accredited online academy.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link className="btn btn-primary" to="/edu-gov/schools/enroll">
                Enroll a child
              </Link>
            ) : (
              <Link className="btn btn-primary" to="/edu-gov/login">
                Sign in to enroll
              </Link>
            )}
            <Link className="btn btn-outline" to="/edu-gov/schools/grades">
              Grade portal
            </Link>
          </div>
        </div>
        <div className="nbc-hero-visual" aria-hidden="true">
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 100 L80 30 L140 100 Z" fill="rgba(255,255,255,0.16)" />
            <rect x="70" y="60" width="20" height="40" fill="rgba(255,255,255,0.22)" />
            <path d="M10 100 H150" />
          </svg>
        </div>
      </section>

      <section className="nbc-section" aria-labelledby="dir-h">
        {justEnrolled && (
          <div className="alert-success" role="status" style={{ maxWidth: 760, margin: '0 auto 24px' }}>
            <strong>Enrollment received.</strong> We will email you within two
            business days. You can track status from your dashboard.
          </div>
        )}

        <h2 id="dir-h" className="section-title">School directory</h2>
        <p className="section-sub">
          Click any school for principal, address, and contact info.
        </p>

        <div className="school-grid">
          {state.schools.map((s) => (
            <article key={s.id} className="school-card" aria-labelledby={`s-${s.id}`}>
              <h3 id={`s-${s.id}`}>{s.name}</h3>
              <div className="meta">Grades {s.grades} · {s.students} students</div>
              <dl>
                <dt>Principal</dt><dd>{s.principal}</dd>
                <dt>Address</dt><dd>{s.address}</dd>
                <dt>Phone</dt><dd>{s.phone}</dd>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="nbc-section alt" aria-labelledby="events-h">
        <h2 id="events-h" className="section-title">Upcoming district events</h2>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <ul className="activity-strip">
            <li><span>Back-to-school night at Cedarbrook Elementary</span><span className="when">Aug 28</span></li>
            <li><span>Birchwood Middle School open house</span><span className="when">Sep 6</span></li>
            <li><span>Northbrook High fall sports kickoff</span><span className="when">Sep 12</span></li>
            <li><span>Westwood Online Academy info session (virtual)</span><span className="when">Sep 15</span></li>
          </ul>
        </div>
      </section>

      {!isAuthenticated && (
        <section className="nbc-section" aria-labelledby="cta-h">
          <h2 id="cta-h" className="section-title">Ready to enroll?</h2>
          <p className="section-sub">
            Sign in with your Northbrook Connect account to start a new
            enrollment in about five minutes.
          </p>
          <div style={{ textAlign: 'center' }}>
            <Link className="btn btn-primary" to="/edu-gov/login">
              Sign in to begin
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
