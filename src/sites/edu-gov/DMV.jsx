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

          {/* PHASE-2 a11y issue NB-123 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Subtitle rendered in pale brand sand (#cdbf9f on #fff
              ~2.0:1). axe-core `color-contrast` fires Serious (WCAG
              1.4.3). SLED pattern: brand-tint subtitles. */}
          <p style={{ color: '#cdbf9f', background: '#ffffff', fontSize: 13 }}>
            Office hours: Mon-Fri 8am-5pm
          </p>

          {/* PHASE-2 a11y issue NB-124 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Icon-only "help" button with NO accessible name. axe-core
              `button-name` fires Critical (WCAG 4.1.2). */}
          <button type="button" style={{ background: 'none', border: '1px solid var(--border)', padding: 6, marginRight: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.1 9.5a3 3 0 1 1 5.5 1.5c-.5 1-1.6 1.5-2.6 2-.7.5-1 1-1 2" />
              <circle cx="12" cy="17.5" r="1" />
            </svg>
          </button>

          {/* PHASE-2 a11y issue NB-125 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Renewal-shield <svg role="img"> with NO <title>. axe-core
              `svg-img-alt` fires Serious (WCAG 1.1.1). */}
          <svg role="img" width="32" height="32" viewBox="0 0 32 32" style={{ verticalAlign: 'middle' }}>
            <path d="M16 2 L28 6 V16 C28 24 16 30 16 30 C16 30 4 24 4 16 V6 Z" fill="#0a66c2" />
          </svg>

          {/* PHASE-2 a11y issue NB-126 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              `lang="zz"` is not a valid BCP-47 subtag. axe-core
              `valid-lang` fires Serious (WCAG 3.1.2). */}
          <span lang="zz" style={{ fontSize: 12 }}>Renovación en español</span>

          {/* PHASE-2 a11y issue NB-127 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              `aria-labeledby` typo of `aria-labelledby`. axe-core
              `aria-valid-attr` fires Critical (WCAG 4.1.2). */}
          <div aria-labeledby="dmv-h" style={{ display: 'none' }} />

          {/* PHASE-2 a11y issue NB-128 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              `role="presentation"` with `aria-required="true"`. axe-core
              `aria-allowed-attr` fires Serious (WCAG 4.1.2). */}
          <span role="presentation" aria-required="true" style={{ display: 'none' }} />

          {/* PHASE-2 a11y issue NB-129 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Empty <span role="tooltip">. axe-core `aria-tooltip-name`
              fires Serious (WCAG 4.1.2). */}
          <span role="tooltip" id="dmv-tip" />

          {/* PHASE-2 a11y issue NB-130 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Stray <dt> outside any <dl>. axe-core `dlitem` fires
              Serious (WCAG 1.3.1). */}
          <dt style={{ display: 'none' }}>Vehicle</dt>
        </div>
      </div>

      {/* PHASE-2 a11y issue NB-191 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          "Save $5 with online renewal" promo banner with light gold text
          (#e8c267) on a near-white to pale gold gradient. axe-core
          `color-contrast` lands as Needs Review (gradient bg). axe
          DevTools Pro Advanced `text-contrast` analyses rendered pixels
          and reports Serious (WCAG 1.4.3). Realistic SLED pattern: DMV
          promo banners use brand gradients without contrast checks. */}
      <div
        style={{
          background: 'linear-gradient(90deg, #ffffff 0%, #f4f1e6 100%)',
          color: '#e8c267',
          padding: '8px 14px',
          borderRadius: 6,
          marginBottom: 16,
          fontSize: 14,
          fontWeight: 600,
          maxWidth: 720,
        }}
      >
        Save $5 with online renewal — no in-person visit required.
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

      {/* PHASE-2 a11y issue NB-009 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          Visual progress bar with role="progressbar" but MISSING the required
          aria-valuenow / aria-valuemin / aria-valuemax attributes (and no
          accessible name). axe-core `aria-required-attr` fires Critical
          (WCAG 4.1.2). Classic SLED audit finding on multi-step gov forms
          (renewal, enrollment, permit application) where a designer adds a
          progress bar visually without wiring up the ARIA semantics. */}
      <div
        role="progressbar"
        style={{
          height: 6,
          background: '#e6e2d4',
          borderRadius: 3,
          overflow: 'hidden',
          margin: '0 0 16px',
        }}
      >
        <div
          style={{
            width: `${Math.round(((step + 1) / STEPS.length) * 100)}%`,
            height: '100%',
            background: 'var(--brand-primary)',
            transition: 'width 200ms ease',
          }}
        />
      </div>

      {error && (
        <div id={errId} role="alert" className="alert-error">{error}</div>
      )}

      <div className="card" style={{ maxWidth: 720 }}>
        {step === 0 && (
          <form onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
            {/* PHASE-2 a11y issue NB-131 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                "VIN lookup" input with NO associated <label>. axe-core
                `label` fires Critical (WCAG 1.3.1, 4.1.2). SLED pattern:
                placeholder used in place of a label. */}
            <input type="text" placeholder="VIN" style={{ marginBottom: 8, padding: '6px 10px' }} />

            {/* PHASE-2 a11y issue NB-132 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                `autocomplete="vehicle-vin"` is not a valid HTML autofill
                token. axe-core `autocomplete-valid` fires Serious (WCAG
                1.3.5). SLED pattern: forms invent vehicle-domain tokens. */}
            <input type="text" aria-label="VIN" autoComplete="vehicle-vin" style={{ marginBottom: 8, padding: '6px 10px' }} />

            {/* PHASE-2 a11y issue NB-133 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                Extra "Plate state" <select> with NO label or aria-label.
                axe-core `select-name` fires Critical (WCAG 4.1.2). */}
            <select defaultValue="" style={{ marginBottom: 8 }}>
              <option value="" disabled>State…</option>
              <option value="nb">Northbrook</option>
              <option value="or">Oregon</option>
            </select>

            {/* PHASE-2 a11y issue NB-134 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                <div role="combobox"> missing required `aria-expanded`.
                axe-core `aria-required-attr` fires Critical (WCAG
                4.1.2). SLED pattern: custom combobox lacks required
                attribute. */}
            <div role="combobox" aria-label="Plate type" tabIndex={0} style={{ marginBottom: 12, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 4, width: 200 }}>
              Standard
            </div>

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
                {/* PHASE-2 a11y issue NB-IGT-019 (Keyboard IGT) — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                    Positive tabIndex={3} on a Step-2 input disrupts the
                    natural tab order (positive values jump ahead of the
                    rest of the page). The Keyboard IGT verifies tab
                    sequence matches visual order. */}
                <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input tabIndex={3} type="radio" name="term" value="1" checked={term === '1'} onChange={(e) => setTerm(e.target.value)} />
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
