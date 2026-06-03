import { Link } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import { useStore } from './store.jsx';

/**
 * Northbrook Connect public homepage.
 * Clean accessible baseline. Phase 2 will surgically introduce documented
 * issues — see ACCESSIBILITY_ISSUES.md (TBD for edu-gov).
 */
export default function Home() {
  const { isAuthenticated, citizen } = useAuth();
  const { state } = useStore();

  const schoolsCount = state.schools.length;
  const childrenCount = state.children.length;
  const vehiclesCount = state.vehicles.length;
  const coursesCount = state.courses.length;

  return (
    <>
      <section className="nbc-hero" aria-labelledby="hero-heading">
        <div>
          <span className="nbc-pill">Northbrook State Portal</span>
          <h1 id="hero-heading">Your state, one login.</h1>
          <p className="sub">
            Manage K-12 enrollment, public university courses, vehicle
            registration, benefits, and city permits — all in one place,
            with one account.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              className="btn btn-primary"
              to={isAuthenticated ? '/edu-gov/account' : '/edu-gov/login'}
            >
              {isAuthenticated ? `Continue as ${citizen.firstName}` : 'Sign in or create account'}
            </Link>
            <Link className="btn btn-outline" to="/edu-gov/schools">
              Browse public schools
            </Link>
          </div>
        </div>

        <div className="nbc-hero-visual" aria-hidden="true">
          <svg width="180" height="140" viewBox="0 0 180 140" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 120 L60 50 L95 90 L120 60 L170 120 Z" fill="rgba(255,255,255,0.16)" />
            <path d="M10 120 L170 120" />
            <circle cx="140" cy="35" r="14" fill="rgba(255,255,255,0.20)" />
          </svg>
        </div>
      </section>

      <section className="nbc-section" aria-labelledby="services-heading">
        <h2 id="services-heading" className="section-title">Find what you need</h2>
        <p className="section-sub">
          Four service areas, one login. Click through to get started.
        </p>

        <div className="service-grid">
          <Link to="/edu-gov/schools" className="service-card">
            <span className="service-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l10 6-10 6L2 9l10-6z" /><path d="M6 11v6c3 2 9 2 12 0v-6" /></svg>
            </span>
            <h3>K-12 schools</h3>
            <p>Online enrollment, grade portal, transcripts, school directory.</p>
            <span className="count">{schoolsCount} schools</span>
          </Link>

          <Link to="/edu-gov/university" className="service-card">
            <span className="service-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7l10 5 10-5-10-5-10 5z" /><path d="M6 10v6c2 2 10 2 12 0v-6" /></svg>
            </span>
            <h3>State university</h3>
            <p>Course catalog, registration, financial aid, transcripts.</p>
            <span className="count">{coursesCount} courses this term</span>
          </Link>

          <Link to="/edu-gov/services" className="service-card">
            <span className="service-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 14h8" /></svg>
            </span>
            <h3>State services</h3>
            <p>DMV, vehicle registration, benefits enrollment, voter records.</p>
            <span className="count">{vehiclesCount} vehicles on file</span>
          </Link>

          <Link to="/edu-gov/city" className="service-card">
            <span className="service-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V8l7-5 7 5v13" /></svg>
            </span>
            <h3>City services</h3>
            <p>Building permits, trash &amp; recycling, parking, parks bookings.</p>
            <span className="count">{childrenCount} household members</span>
          </Link>
        </div>
      </section>

      <section className="nbc-section alt" aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="section-title">Around the state</h2>
        <p className="section-sub">Recent updates from Northbrook agencies.</p>

        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <ul className="activity-strip">
            <li>
              <span>School year 2026–27 enrollment is now open for all four districts.</span>
              <span className="when">2 days ago</span>
            </li>
            <li>
              <span>DMV vehicle renewal is now fully online — no in-person visit required.</span>
              <span className="when">1 week ago</span>
            </li>
            <li>
              <span>Voter registration deadline for the fall primary is September 14.</span>
              <span className="when">2 weeks ago</span>
            </li>
            <li>
              <span>Northbrook State University spring 2027 catalog is now available.</span>
              <span className="when">3 weeks ago</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="nbc-section" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="section-title">Frequently asked</h2>

        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <details className="faq-item">
            <summary>Do I need a separate login for each service?</summary>
            <div className="faq-answer">
              No. Your Northbrook Connect account works across schools, the state
              university, state services, and city services.
            </div>
          </details>
          <details className="faq-item">
            <summary>How do I add a child to my account?</summary>
            <div className="faq-answer">
              Sign in, go to <Link to="/edu-gov/schools/enroll">Online enrollment</Link>,
              and complete the 3-step form. Most enrollments are confirmed within
              two business days.
            </div>
          </details>
          <details className="faq-item">
            <summary>Is this portal accessible?</summary>
            <div className="faq-answer">
              Northbrook Connect is built to meet WCAG 2.2 AA. If you encounter a
              barrier, please use the accessibility contact link in the footer.
            </div>
          </details>
        </div>
      </section>
    </>
  );
}
