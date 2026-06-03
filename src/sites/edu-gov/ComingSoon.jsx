import { Link } from 'react-router-dom';

/**
 * Temporary placeholder for Northbrook Connect sub-sections that are
 * being scaffolded in a later stage (University, State services, City
 * services). Renders inside PublicLayout so it inherits the public chrome.
 */
export default function ComingSoon() {
  return (
    <section className="nbc-section" aria-labelledby="cs-h">
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <span className="nbc-pill">Coming soon</span>
        <h1 id="cs-h" style={{ marginTop: 12, color: 'var(--brand-deep)' }}>
          This sub-section is being scaffolded
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: '12px 0 24px' }}>
          See <Link to="/edu-gov">the Northbrook Connect home</Link> for
          available services. New service areas roll out continuously.
        </p>
        <Link className="btn btn-primary" to="/edu-gov">Back to home</Link>
      </div>
    </section>
  );
}
