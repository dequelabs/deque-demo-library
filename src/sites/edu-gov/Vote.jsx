import { useState } from 'react';
import { useStore, actions } from './store.jsx';

/**
 * Voter registration + polling place lookup (authed).
 * Two cards side-by-side. Left: register-to-vote form (or registered panel).
 * Right: polling place lookup with a cosmetic map placeholder.
 */
export default function Vote() {
  const { state, dispatch } = useStore();
  const { citizen, voterRegistered } = state;

  const [firstName, setFirstName] = useState(citizen.firstName);
  const [lastName, setLastName] = useState(citizen.lastName);
  const [dob, setDob] = useState(citizen.dob);
  const [line1, setLine1] = useState(citizen.address.line1);
  const [city, setCity] = useState(citizen.address.city);
  const [zip, setZip] = useState(citizen.address.zip);
  const [party, setParty] = useState('Unaffiliated');

  const [lookupAddress, setLookupAddress] = useState(
    `${citizen.address.line1}, ${citizen.address.city} ${citizen.address.zip}`
  );

  const onRegister = (e) => {
    e.preventDefault();
    dispatch(actions.registerVoter());
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Voting in Cedarbrook</h1>
          <p className="subtitle">Register to vote and find your polling place.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Left card — Voter registration */}
        <section className="card" aria-labelledby="reg-card-h">
          <h2 id="reg-card-h" style={{ margin: '0 0 12px', fontSize: 18, color: 'var(--brand-deep)' }}>
            Voter registration
          </h2>

          {voterRegistered ? (
            <div className="alert-success" role="status" style={{ marginTop: 0 }}>
              <strong>You are registered to vote</strong> in Cedarbrook precinct 7.
              The next election is <strong>Tuesday, November 5</strong>.
            </div>
          ) : (
            <form onSubmit={onRegister} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-row">
                  <label htmlFor="vote-first">First name</label>
                  <input
                    id="vote-first"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="form-row">
                  <label htmlFor="vote-last">Last name</label>
                  <input
                    id="vote-last"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <label htmlFor="vote-dob">Date of birth</label>
                <input
                  id="vote-dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  autoComplete="bday"
                  required
                />
              </div>
              <div className="form-row">
                <label htmlFor="vote-line1">Home address</label>
                <input
                  id="vote-line1"
                  type="text"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  autoComplete="address-line1"
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                <div className="form-row">
                  <label htmlFor="vote-city">City</label>
                  <input
                    id="vote-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    autoComplete="address-level2"
                  />
                </div>
                <div className="form-row">
                  <label htmlFor="vote-zip">ZIP</label>
                  <input
                    id="vote-zip"
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    autoComplete="postal-code"
                  />
                </div>
              </div>
              <div className="form-row">
                <label htmlFor="vote-party">Party preference</label>
                <select id="vote-party" value={party} onChange={(e) => setParty(e.target.value)}>
                  <option>Unaffiliated</option>
                  <option>Democratic</option>
                  <option>Republican</option>
                  <option>Libertarian</option>
                  <option>Green</option>
                  <option>Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary">Register</button>
              </div>
            </form>
          )}
        </section>

        {/* Right card — Polling place lookup */}
        <section className="card" aria-labelledby="poll-card-h">
          <h2 id="poll-card-h" style={{ margin: '0 0 12px', fontSize: 18, color: 'var(--brand-deep)' }}>
            Polling place lookup
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); }} noValidate>
            <div className="form-row">
              <label htmlFor="poll-addr">Home address</label>
              <input
                id="poll-addr"
                type="text"
                value={lookupAddress}
                onChange={(e) => setLookupAddress(e.target.value)}
                autoComplete="street-address"
              />
            </div>
            <button type="submit" className="btn btn-outline">Look up</button>
          </form>

          <div
            role="img"
            aria-label="Map placeholder showing Cedarbrook Community Center"
            style={{
              marginTop: 16,
              height: 140,
              borderRadius: 8,
              background: '#f4f1e6',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-deep)',
              fontWeight: 600,
            }}
          >
            Map placeholder
          </div>

          <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-soft)', borderRadius: 8 }}>
            <strong style={{ color: 'var(--brand-deep)' }}>Cedarbrook Community Center</strong>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
              142 Lake Ave, Cedarbrook, NB 98221
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
              Open 7:00 AM – 8:00 PM on election day. ADA-accessible entrance on Pine St.
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
