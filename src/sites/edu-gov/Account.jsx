import { Link } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import { useStore } from './store.jsx';
import { fmtDate } from './format.js';

/**
 * Citizen dashboard (post-login).
 * Greets the signed-in citizen and surfaces live counts for each
 * service area, recent activity, and a profile snippet.
 */
export default function Account() {
  const { citizen } = useAuth();
  const { state } = useStore();

  const cards = [
    {
      to: '/edu-gov/schools',
      title: 'K-12 schools',
      blurb: `${state.children.length} children · ${state.schools.length} schools`,
      cta: 'Manage family',
    },
    {
      to: '/edu-gov/university',
      title: 'State university',
      blurb: `${state.enrollments.length} courses registered · ${state.courses.length} in catalog`,
      cta: 'Browse courses',
    },
    {
      to: '/edu-gov/services',
      title: 'State services',
      blurb: `${state.vehicles.length} vehicles · ${state.benefits.length} benefit applications`,
      cta: 'Open services',
    },
    {
      to: '/edu-gov/city',
      title: 'City services',
      blurb: `${state.permits.length} permits · voter ${state.voterRegistered ? 'registered' : 'not registered'}`,
      cta: 'Open city',
    },
  ];

  const activity = [
    state.enrollments[0] && {
      label: 'Registered for a university course',
      when: fmtDate(state.enrollments[0].registeredISO),
    },
    state.permits[0] && {
      label: `Submitted ${state.permits[0].kind} permit application`,
      when: fmtDate(state.permits[0].submittedISO),
    },
    state.benefits[0] && {
      label: `Submitted ${state.benefits[0].program} application`,
      when: fmtDate(state.benefits[0].submittedISO),
    },
    state.voterRegistered && {
      label: 'Updated voter registration',
      when: 'Recently',
    },
    {
      label: 'Signed in to Northbrook Connect',
      when: 'Today',
    },
  ].filter(Boolean);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Welcome back, {citizen.firstName}.</h1>
          <p className="subtitle">Here is a quick look at your services.</p>
        </div>
        <div>
          <Link className="btn btn-outline" to="/edu-gov">Public site</Link>
        </div>
      </div>

      <section aria-labelledby="services-h" style={{ marginBottom: 32 }}>
        <h2 id="services-h" style={{ margin: '0 0 12px', fontSize: 18, color: 'var(--brand-deep)' }}>
          Your services
        </h2>
        <div className="service-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {cards.map((c) => (
            <Link key={c.to} to={c.to} className="service-card">
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
              <span className="count">{c.cta} &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="activity-h" style={{ marginBottom: 32 }}>
        <h2 id="activity-h" style={{ margin: '0 0 12px', fontSize: 18, color: 'var(--brand-deep)' }}>
          Recent activity
        </h2>
        <ul className="activity-strip">
          {activity.map((a, i) => (
            <li key={i}>
              <span>{a.label}</span>
              <span className="when">{a.when}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="profile" aria-labelledby="profile-h" className="card">
        <div className="card-head">
          <h2 id="profile-h">Profile</h2>
          <Link className="btn-link" to="/edu-gov/account">Edit</Link>
        </div>
        <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '6px 16px', margin: 0, fontSize: 14 }}>
          <dt style={{ color: 'var(--text-muted)' }}>Name</dt>
          <dd style={{ margin: 0 }}>{citizen.firstName} {citizen.lastName}</dd>
          <dt style={{ color: 'var(--text-muted)' }}>Email</dt>
          <dd style={{ margin: 0 }}>{citizen.email}</dd>
          <dt style={{ color: 'var(--text-muted)' }}>Phone</dt>
          <dd style={{ margin: 0 }}>{citizen.phone}</dd>
          <dt style={{ color: 'var(--text-muted)' }}>Address</dt>
          <dd style={{ margin: 0 }}>
            {citizen.address.line1}, {citizen.address.city}, {citizen.address.state} {citizen.address.zip}
          </dd>
        </dl>
      </section>
    </>
  );
}
