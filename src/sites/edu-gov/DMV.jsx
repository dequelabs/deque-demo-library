import { useState, useRef, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, actions } from './store.jsx';

/**
 * DMV vehicle renewal — 3-step authed flow.
 * Step 1: Select vehicle (radio list, expired badge for past expiry).
 * Step 2: Renewal term + optional add-ons; cost calculation.
 * Step 3: Confirm & pay (mock) — dispatch RENEW_VEHICLE with new expiry,
 *         redirect to /account with justRenewed.
 */
const STEPS = ['Select vehicle', 'Renewal details', 'Confirm & pay'];

function addYearsISO(isoBase, years) {
  const d = new Date(isoBase);
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
}

export default function DMV() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const errId = useId();

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [vehicleId, setVehicleId] = useState(state.vehicles[0]?.id || '');
  const [term, setTerm] = useState('1');
  const [emissions, setEmissions] = useState(false);
  const [eTitle, setETitle] = useState(false);

  useEffect(() => {
    if (headingRef.current) headingRef.current.focus();
  }, [step]);

  const vehicle = state.vehicles.find((v) => v.id === vehicleId);
  const termYears = parseInt(term, 10);
  const cost = 75 * termYears + (termYears === 2 ? 15 : 0);

  const todayISO = new Date().toISOString().slice(0, 10);
  const isExpired = (v) => v.registrationExpiresISO < todayISO;

  const next = () => {
    if (step === 0 && !vehicleId) {
      setError('Please select a vehicle to renew.');
      return;
    }
    setError('');
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = () => {
    // New expiry = today + termYears (per spec)
    const newExpiry = addYearsISO(todayISO, termYears);
    dispatch(actions.renewVehicle(vehicleId, newExpiry));
    navigate('/edu-gov/account', { state: { justRenewed: true } });
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 ref={headingRef} tabIndex={-1}>
            Vehicle renewal — Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </h1>
          <p className="subtitle">Renew your Northbrook State vehicle registration.</p>
        </div>
      </div>

      <ol className="steps" aria-label="Renewal progress">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={i === step ? 'is-active' : i < step ? 'is-done' : ''}
            aria-current={i === step ? 'step' : undefined}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {error && (
        <div id={errId} role="alert" className="alert-error">{error}</div>
      )}

      <div className="card" style={{ maxWidth: 720 }}>
        {step === 0 && (
          <form onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend style={{ fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
                Choose a vehicle to renew
              </legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {state.vehicles.map((v) => {
                  const expired = isExpired(v);
                  return (
                    <label
                      key={v.id}
                      style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 12, border: '1px solid var(--border)', borderRadius: 10, background: '#fff', cursor: 'pointer' }}
                    >
                      <input
                        type="radio"
                        name="vehicleId"
                        value={v.id}
                        checked={vehicleId === v.id}
                        onChange={(e) => setVehicleId(e.target.value)}
                        style={{ marginTop: 4 }}
                      />
                      <span style={{ flex: 1 }}>
                        <strong style={{ color: 'var(--brand-deep)' }}>
                          {v.plate}
                        </strong>
                        {expired && (
                          <span style={{ marginLeft: 8, padding: '2px 8px', background: '#fbe9e7', color: 'var(--danger)', fontSize: 12, fontWeight: 700, borderRadius: 999 }}>
                            Expired
                          </span>
                        )}
                        <br />
                        <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                          {v.year} {v.make} {v.model} · Expires {v.registrationExpiresISO}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="submit" className="btn btn-primary">Continue</button>
            </div>
          </form>
        )}

        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
            <fieldset style={{ border: 0, padding: 0, margin: 0, marginBottom: 18 }}>
              <legend style={{ fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
                Renewal term
              </legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input type="radio" name="term" value="1" checked={term === '1'} onChange={(e) => setTerm(e.target.value)} />
                  <span>1 year — $75</span>
                </label>
                <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input type="radio" name="term" value="2" checked={term === '2'} onChange={(e) => setTerm(e.target.value)} />
                  <span>2 years — $165 (1 year + $90)</span>
                </label>
              </div>
            </fieldset>

            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend style={{ fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
                Optional add-ons
              </legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input type="checkbox" checked={emissions} onChange={(e) => setEmissions(e.target.checked)} />
                  <span>Add emissions test reminder (free)</span>
                </label>
                <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input type="checkbox" checked={eTitle} onChange={(e) => setETitle(e.target.checked)} />
                  <span>Opt into electronic title (saves $5 paper fee)</span>
                </label>
              </div>
            </fieldset>

            <div style={{ marginTop: 18, padding: 12, background: 'var(--bg-soft)', borderRadius: 8, fontWeight: 600 }}>
              Total: ${cost.toFixed(2)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <button type="button" className="btn btn-outline" onClick={back}>Back</button>
              <button type="submit" className="btn btn-primary">Continue</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
            <h2 style={{ margin: '0 0 12px', fontSize: 18, color: 'var(--brand-deep)' }}>
              Review &amp; pay
            </h2>
            <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '6px 16px', margin: 0, fontSize: 14 }}>
              <dt style={{ color: 'var(--text-muted)' }}>Vehicle</dt>
              <dd style={{ margin: 0 }}>{vehicle?.year} {vehicle?.make} {vehicle?.model} ({vehicle?.plate})</dd>
              <dt style={{ color: 'var(--text-muted)' }}>Renewal term</dt>
              <dd style={{ margin: 0 }}>{termYears} year{termYears === 1 ? '' : 's'}</dd>
              <dt style={{ color: 'var(--text-muted)' }}>New expiry</dt>
              <dd style={{ margin: 0 }}>{addYearsISO(todayISO, termYears)}</dd>
              <dt style={{ color: 'var(--text-muted)' }}>Add-ons</dt>
              <dd style={{ margin: 0 }}>
                {[emissions && 'Emissions reminder', eTitle && 'Electronic title'].filter(Boolean).join(', ') || 'None'}
              </dd>
              <dt style={{ color: 'var(--text-muted)' }}>Total</dt>
              <dd style={{ margin: 0, fontWeight: 700 }}>${cost.toFixed(2)}</dd>
            </dl>
            <p className="form-help" style={{ marginTop: 16 }}>
              Payment is mocked for this demo. No card will be charged.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <button type="button" className="btn btn-outline" onClick={back}>Back</button>
              <button type="submit" className="btn btn-primary">Confirm renewal</button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
