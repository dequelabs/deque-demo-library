import { useState } from 'react';
import { useAuth } from './auth.jsx';
import { useStore } from './store.jsx';

/**
 * Pulsegrid Settings — profile + preferences.
 * Intentional issues:
 *   PG-050 autocomplete-valid — Given name uses autocomplete="given"
 *   PG-051 aria-valid-attr-value — role="user-profile" (not a valid ARIA role)
 *   PG-052 color-contrast — "Danger zone" description text
 *   PG-IGT-014 (Forms) — no error summary; individual field errors don't move focus
 */
export default function Settings() {
  const { user, signOut } = useAuth();
  const { state } = useStore();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [pagerdutyAlerts, setPagerdutyAlerts] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <>
      <div className="pg-page-title">
        <h1>Settings</h1>
      </div>

      {/* PG-051: role="user-profile" is not a valid ARIA role */}
      <section className="pg-widget" role="user-profile" aria-labelledby="profile-h">
        <h2 id="profile-h">Profile</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div>
            <label htmlFor="first-name" style={{ fontSize: 12, color: 'var(--pg-text-secondary)' }}>First name</label>
            <input
              id="first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              // PG-050: invalid autocomplete token
              autoComplete="given"
              style={{ width: '100%', padding: 8, marginTop: 4, background: 'var(--pg-bg-elev)', border: '1px solid var(--pg-border)', color: 'var(--pg-text)', borderRadius: 6 }}
            />
          </div>
          <div>
            <label htmlFor="last-name" style={{ fontSize: 12, color: 'var(--pg-text-secondary)' }}>Last name</label>
            <input
              id="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
              style={{ width: '100%', padding: 8, marginTop: 4, background: 'var(--pg-bg-elev)', border: '1px solid var(--pg-border)', color: 'var(--pg-text)', borderRadius: 6 }}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="email-ro" style={{ fontSize: 12, color: 'var(--pg-text-secondary)' }}>Work email</label>
            <input
              id="email-ro"
              value={user.email}
              readOnly
              style={{ width: '100%', padding: 8, marginTop: 4, background: 'var(--pg-bg)', border: '1px solid var(--pg-border)', color: 'var(--pg-text-muted)', borderRadius: 6 }}
            />
          </div>
        </div>
      </section>

      <section className="pg-widget">
        <h2>Notification channels</h2>
        <p style={{ margin: '8px 0 16px' }}>Choose where to receive alert notifications.</p>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 10, borderRadius: 6, background: 'var(--pg-bg-elev)', marginBottom: 6 }}>
          <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
          Email — {user.email}
        </label>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 10, borderRadius: 6, background: 'var(--pg-bg-elev)', marginBottom: 6 }}>
          <input type="checkbox" checked={slackAlerts} onChange={(e) => setSlackAlerts(e.target.checked)} />
          Slack — #platform-alerts
        </label>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 10, borderRadius: 6, background: 'var(--pg-bg-elev)' }}>
          <input type="checkbox" checked={pagerdutyAlerts} onChange={(e) => setPagerdutyAlerts(e.target.checked)} />
          PagerDuty — SEV-1 only
        </label>
      </section>

      <section className="pg-widget">
        <h2>Organization</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 16 }}>
          <div><div style={{ fontSize: 11, color: 'var(--pg-text-muted)' }}>NAME</div><div style={{ color: 'var(--pg-text)' }}>{state.organization.name}</div></div>
          <div><div style={{ fontSize: 11, color: 'var(--pg-text-muted)' }}>PLAN</div><div style={{ color: 'var(--pg-text)' }}>{state.organization.plan}</div></div>
          <div><div style={{ fontSize: 11, color: 'var(--pg-text-muted)' }}>SEATS</div><div style={{ color: 'var(--pg-text)' }}>{state.organization.seats}</div></div>
          <div><div style={{ fontSize: 11, color: 'var(--pg-text-muted)' }}>REGION</div><div style={{ color: 'var(--pg-text)' }}>{state.organization.region}</div></div>
        </div>
      </section>

      <section className="pg-widget" style={{ borderColor: 'var(--pg-red)' }}>
        <h2 style={{ color: 'var(--pg-red)' }}>Danger zone</h2>
        {/* PG-052: low-contrast dim red on dark */}
        <p style={{ color: '#7a3232', fontSize: 12 }}>
          Signing out will end your session. Deleting your workspace is permanent.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="pg-btn pg-btn--outline" onClick={signOut}>Sign out</button>
          <button type="button" className="pg-btn pg-btn--outline" style={{ borderColor: 'var(--pg-red)', color: 'var(--pg-red)' }}>
            Delete workspace…
          </button>
        </div>
      </section>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
        {saved && <span style={{ color: 'var(--pg-green)', fontSize: 13, alignSelf: 'center' }}>Saved ✓</span>}
        <button
          type="button"
          className="pg-btn pg-btn--primary"
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
        >
          Save changes
        </button>
      </div>
    </>
  );
}
