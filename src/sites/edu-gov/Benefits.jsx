import { useState, useRef, useEffect, useId } from 'react';
import { useStore, actions } from './store.jsx';

/**
 * Benefits eligibility & application — 2-step authed flow.
 * Step 1: Eligibility quiz.
 * Step 2: Apply for any benefits the citizen appears to qualify for.
 *         Dispatches APPLY_BENEFIT per accepted program; applied benefits
 *         appear in state.benefits.
 */
const STEPS = ['Eligibility', 'Apply'];

const PROGRAM_LABEL = {
  snap: 'SNAP (Supplemental Nutrition Assistance Program)',
  medicaid: 'Medicaid health coverage',
};

export default function Benefits() {
  const { state, dispatch } = useStore();
  const headingRef = useRef(null);
  const errId = useId();

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [householdSize, setHouseholdSize] = useState(2);
  const [income, setIncome] = useState('');
  const [hasKids, setHasKids] = useState(false);
  const [vulnerable, setVulnerable] = useState(false);
  const [citizen, setCitizen] = useState('yes');
  const [eligibility, setEligibility] = useState(null);
  const [applied, setApplied] = useState([]); // ['snap', 'medicaid']

  useEffect(() => {
    if (headingRef.current) headingRef.current.focus();
  }, [step]);

  const next = (e) => {
    e?.preventDefault();
    if (!income || isNaN(Number(income))) {
      setError('Please enter monthly income.');
      return;
    }
    if (householdSize < 1 || householdSize > 10) {
      setError('Household size must be between 1 and 10.');
      return;
    }
    setError('');
    const monthly = Number(income);
    const snap = citizen === 'yes' && monthly < 2000 * householdSize;
    const medicaid = monthly < 1500 * householdSize && (hasKids || vulnerable || citizen === 'yes');
    setEligibility({ snap, medicaid });
    setStep(1);
  };

  const back = () => {
    setError('');
    setStep(0);
  };

  const apply = (program) => {
    dispatch(actions.applyBenefit(program, householdSize, ''));
    setApplied((a) => (a.includes(program) ? a : [...a, program]));
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 ref={headingRef} tabIndex={-1}>
            Benefits — Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </h1>
          <p className="subtitle">Check eligibility and apply for state assistance programs.</p>
        </div>
      </div>

      <ol className="steps" aria-label="Benefits progress">
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

      {step === 0 && (
        <div className="card" style={{ maxWidth: 640 }}>
          <form onSubmit={next} noValidate>
            <div className="form-row">
              <label htmlFor="ben-household">Household size</label>
              <input
                id="ben-household"
                type="number"
                min={1}
                max={10}
                value={householdSize}
                onChange={(e) => setHouseholdSize(parseInt(e.target.value, 10) || 1)}
              />
              <p className="form-help">Include yourself and anyone you live with.</p>
            </div>
            <div className="form-row">
              <label htmlFor="ben-income">Monthly household income (USD)</label>
              <input
                id="ben-income"
                type="number"
                min={0}
                step="0.01"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="e.g. 2400"
                inputMode="decimal"
              />
            </div>

            <fieldset style={{ border: 0, padding: 0, margin: '0 0 18px' }}>
              <legend style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                Household details
              </legend>
              <label style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                <input type="checkbox" checked={hasKids} onChange={(e) => setHasKids(e.target.checked)} />
                <span>I have children under 18 in my household</span>
              </label>
              <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input type="checkbox" checked={vulnerable} onChange={(e) => setVulnerable(e.target.checked)} />
                <span>I am pregnant or someone in my household has a disability</span>
              </label>
            </fieldset>

            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                Are you a US citizen or qualified non-citizen?
              </legend>
              <div style={{ display: 'flex', gap: 18 }}>
                <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="radio" name="citizen" value="yes" checked={citizen === 'yes'} onChange={(e) => setCitizen(e.target.value)} />
                  Yes
                </label>
                <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="radio" name="citizen" value="no" checked={citizen === 'no'} onChange={(e) => setCitizen(e.target.value)} />
                  No
                </label>
              </div>
            </fieldset>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="submit" className="btn btn-primary">Check eligibility</button>
            </div>
          </form>
        </div>
      )}

      {step === 1 && eligibility && (
        <div className="card" style={{ maxWidth: 640 }}>
          <h2 style={{ margin: '0 0 12px', fontSize: 18, color: 'var(--brand-deep)' }}>
            Results
          </h2>
          {!eligibility.snap && !eligibility.medicaid ? (
            <p>
              Based on your answers, you do not appear to qualify for SNAP or Medicaid
              at this time. You may still apply by visiting your nearest state office.
            </p>
          ) : (
            <>
              <p>You appear to qualify for the following programs:</p>
              <ul style={{ margin: '12px 0 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {eligibility.snap && (
                  <li style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <span><strong>{PROGRAM_LABEL.snap}</strong></span>
                    {applied.includes('snap') ? (
                      <span className="alert-success" role="status" style={{ margin: 0 }}>
                        Application submitted
                      </span>
                    ) : (
                      <button type="button" className="btn btn-primary" onClick={() => apply('snap')}>
                        Apply for SNAP
                      </button>
                    )}
                  </li>
                )}
                {eligibility.medicaid && (
                  <li style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <span><strong>{PROGRAM_LABEL.medicaid}</strong></span>
                    {applied.includes('medicaid') ? (
                      <span className="alert-success" role="status" style={{ margin: 0 }}>
                        Application submitted
                      </span>
                    ) : (
                      <button type="button" className="btn btn-primary" onClick={() => apply('medicaid')}>
                        Apply for Medicaid
                      </button>
                    )}
                  </li>
                )}
              </ul>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button type="button" className="btn btn-outline" onClick={back}>Back to quiz</button>
          </div>

          {state.benefits.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>
                Your applications
              </h3>
              <ul className="activity-strip">
                {state.benefits.map((b) => (
                  <li key={b.id}>
                    <span>{PROGRAM_LABEL[b.program] || b.program}</span>
                    <span className="when">{b.status} · {b.submittedISO}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}
