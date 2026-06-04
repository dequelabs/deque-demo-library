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
          {/* PHASE-2 a11y issue NB-176 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Icon-only "Look up registration" button with NO accessible
              name. axe-core `button-name` fires Critical (WCAG 4.1.2).
              SLED pattern: voter-portal toolbar collapses lookups to
              icon-only controls. */}
          <button type="button" style={{ background: 'none', border: '1px solid var(--border)', padding: 6, marginTop: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* PHASE-2 a11y issue NB-177 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              "I voted" badge <svg role="img"> with NO <title>. axe-core
              `svg-img-alt` fires Serious (WCAG 1.1.1). SLED pattern:
              voter-portal badges ship as inline SVG without text. */}
          <svg role="img" width="32" height="32" viewBox="0 0 32 32" style={{ verticalAlign: 'middle', marginLeft: 8 }}>
            <circle cx="16" cy="16" r="14" fill="#0a66c2" />
            <path d="M10 16l4 4 8-8" stroke="#fff" strokeWidth="2" fill="none" />
          </svg>

          {/* PHASE-2 a11y issue NB-178 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Pale-taupe disclaimer (#cdbf9f on #fff ~2.0:1). axe-core
              `color-contrast` fires Serious (WCAG 1.4.3). SLED pattern:
              voter-disclosure subheads use brand-tint text on white. */}
          <p style={{ color: '#cdbf9f', background: '#ffffff', fontSize: 13, margin: '4px 0 0' }}>
            Per state election code §29.07
          </p>

          {/* PHASE-2 a11y issue NB-179 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              `lang="zz"` is not a valid BCP-47 primary subtag. axe-core
              `valid-lang` fires Serious (WCAG 3.1.2). SLED pattern:
              translated voter labels tagged with placeholder codes. */}
          <span lang="zz" style={{ fontSize: 12, marginLeft: 8 }}>Inscríbase para votar</span>

          {/* PHASE-2 a11y issue NB-180 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Stray <dt> outside any <dl>. axe-core `dlitem` fires
              Serious (WCAG 1.3.1). SLED pattern: leftover definition
              markup from converted card layouts. */}
          <dt style={{ display: 'none' }}>Precinct</dt>

          {/* PHASE-2 a11y issue NB-181 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              <div role="radiogroup"> with NO role="radio" children.
              axe-core `aria-required-children` fires Critical (WCAG
              1.3.1). SLED pattern: empty radiogroup stubs persist after
              dynamic options removed. */}
          <div role="radiogroup" aria-label="Ballot type" style={{ display: 'inline-flex', gap: 4 }}>
            <span>In-person</span>
            <span>Mail</span>
          </div>

          {/* PHASE-2 a11y issue NB-182 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Empty "More info" anchor (no text, no aria-label).
              axe-core `link-name` fires Critical (WCAG 2.4.4). SLED
              pattern: empty placeholder links remain after CMS
              migration. */}
          <a href="/vote/info" onClick={(e) => e.preventDefault()} aria-label="" style={{ marginLeft: 8 }} />

          {/* PHASE-2 a11y issue NB-183 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Turnout <div role="meter"> with NO accessible name.
              axe-core `aria-meter-name` fires Critical (WCAG 1.1.1).
              SLED pattern: voter-portal dashboards show turnout as a
              bar without naming the meter. */}
          <div role="meter" aria-valuenow={64} aria-valuemin={0} aria-valuemax={100} style={{ height: 6, background: '#e5e7eb', maxWidth: 240, margin: '8px 0' }}>
            <div style={{ width: '64%', height: '100%', background: '#0a66c2' }} />
          </div>

          {/* PHASE-2 a11y issue NB-184 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Empty <span role="tooltip"> placeholder. axe-core
              `aria-tooltip-name` fires Serious (WCAG 4.1.2). SLED
              pattern: tooltip mount nodes ship empty. */}
          <span role="tooltip" id="vote-tip" />
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
                {/* PHASE-2 a11y issue NB-172 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                    Was: <label htmlFor="vote-first">First name</label>.
                    Replaced with a styled <span> — input has no
                    programmatic name. axe-core `label` fires Critical
                    (WCAG 3.3.2 / 4.1.2). SLED pattern: voter-registration
                    forms drop label tags during refactor. */}
                <div className="form-row">
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>First name</span>
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
              {/* PHASE-2 a11y issue NB-173 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                  `autoComplete="voter"` is not a valid WHATWG token.
                  axe-core `autocomplete-valid` fires Serious (WCAG
                  1.3.5). SLED pattern: voter-registration forms use
                  invented autocomplete tokens. */}
              <div className="form-row">
                <label htmlFor="vote-dob">Date of birth</label>
                <input
                  id="vote-dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  autoComplete="voter"
                  required
                />
              </div>

              {/* PHASE-2 a11y issue NB-174 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                  Extra unlabeled "Party" <select> with no label /
                  aria-label. axe-core `select-name` fires Critical
                  (WCAG 4.1.2). SLED pattern: voter-portal hidden
                  party-affiliation selects ship without an accessible
                  name. */}
              <div className="form-row">
                <select>
                  <option>Select party…</option>
                  <option>Democratic</option>
                  <option>Republican</option>
                  <option>Independent</option>
                </select>
              </div>

              {/* PHASE-2 a11y issue NB-175 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                  <div role="searchbox" contentEditable> with NO
                  accessible name. axe-core `aria-input-field-name`
                  fires Serious (WCAG 4.1.2). SLED pattern: polling
                  lookup widgets implemented as nameless contentEditable
                  divs. */}
              <div role="searchbox" contentEditable suppressContentEditableWarning style={{ border: '1px solid var(--border)', borderRadius: 6, padding: 8, minHeight: 32 }} />
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
