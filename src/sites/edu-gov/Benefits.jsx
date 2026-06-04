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
          {/* PHASE-2 a11y issue NB-140 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Icon-only "Print eligibility" button with NO accessible name.
              axe-core `button-name` fires Critical (WCAG 4.1.2). SLED
              pattern: print/save icons in toolbars omit aria-label. */}
          <button type="button" style={{ background: 'none', border: '1px solid var(--border)', padding: 6, marginTop: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 9V2h12v7" /><rect x="4" y="9" width="16" height="8" /><path d="M6 17h12v5H6z" />
            </svg>
          </button>

          {/* PHASE-2 a11y issue NB-141 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              SNAP/Medicaid badge <svg role="img"> with NO <title>.
              axe-core `svg-img-alt` fires Serious (WCAG 1.1.1). SLED
              pattern: program-eligibility badges ship as inline SVG with
              no textual equivalent. */}
          <svg role="img" width="32" height="32" viewBox="0 0 32 32" style={{ verticalAlign: 'middle', marginLeft: 8 }}>
            <circle cx="16" cy="16" r="14" fill="#0a66c2" />
            <path d="M10 16l4 4 8-8" stroke="#fff" strokeWidth="2" fill="none" />
          </svg>

          {/* PHASE-2 a11y issue NB-142 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Pale taupe disclosure subhead (#cdbf9f on #fff ~2.0:1).
              axe-core `color-contrast` fires Serious (WCAG 1.4.3). SLED
              pattern: secondary benefits-section subheads use brand-tint
              text on white. */}
          <p style={{ color: '#cdbf9f', background: '#ffffff', fontSize: 13, margin: '4px 0 0' }}>
            Federally administered programs
          </p>

          {/* PHASE-2 a11y issue NB-143 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              `lang="zz"` is not a valid BCP-47 primary subtag. axe-core
              `valid-lang` fires Serious (WCAG 3.1.2). SLED pattern:
              translated benefit-program names tagged with placeholder
              codes. */}
          <span lang="zz" style={{ fontSize: 12, marginLeft: 8 }}>Programa de asistencia</span>

          {/* PHASE-2 a11y issue NB-144 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Stray <dt> outside any <dl>. axe-core `dlitem` fires Serious
              (WCAG 1.3.1). SLED pattern: leftover definition-list markup
              from converted card layouts. */}
          <dt style={{ display: 'none' }}>Eligibility</dt>

          {/* PHASE-2 a11y issue NB-145 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Eligibility-likelihood <div role="meter"> with NO accessible
              name. axe-core `aria-meter-name` fires Critical (WCAG 1.1.1).
              SLED pattern: benefits portals visualize eligibility
              confidence as bars without naming the meter. */}
          <div role="meter" aria-valuenow={70} aria-valuemin={0} aria-valuemax={100} style={{ height: 6, background: '#e5e7eb', maxWidth: 240, margin: '8px 0' }}>
            <div style={{ width: '70%', height: '100%', background: '#0a66c2' }} />
          </div>

          {/* PHASE-2 a11y issue NB-146 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              <button> with aria-rowindex (only valid on row/cell roles).
              axe-core `aria-prohibited-attr` fires Serious (WCAG 4.1.2).
              SLED pattern: attributes copy-pasted from data-grid cells
              land on unrelated buttons. */}
          <button type="button" aria-rowindex={1} style={{ display: 'none' }}>hidden</button>
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
            {/* PHASE-2 a11y issue NB-135 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                Was: <label htmlFor="ben-household">Household size</label>
                Replaced with a styled <span> — input has no programmatic
                name. axe-core `label` fires Critical (WCAG 3.3.2 / 4.1.2).
                SLED pattern: benefits eligibility quizzes drop label tags
                during a refactor and leave required fields nameless. */}
            <div className="form-row">
              <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Household size</span>
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
            {/* PHASE-2 a11y issue NB-136 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                `autoComplete="benefit"` is not a valid WHATWG token.
                axe-core `autocomplete-valid` fires Serious (WCAG 1.3.5).
                SLED pattern: custom autocomplete tokens slip through on
                state-benefits forms. */}
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
                autoComplete="benefit"
              />
            </div>

            {/* PHASE-2 a11y issue NB-137 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                <select> with no label / aria-label. axe-core `select-name`
                fires Critical (WCAG 4.1.2). SLED pattern: program-type
                filter selects on benefits forms ship without an
                accessible name. */}
            <div className="form-row">
              <select style={{ marginBottom: 12 }}>
                <option>Any program</option>
                <option>SNAP</option>
                <option>Medicaid</option>
                <option>WIC</option>
              </select>
            </div>

            {/* PHASE-2 a11y issue NB-138 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                role="combobox" missing required aria-expanded attribute.
                axe-core `aria-required-attr` fires Critical (WCAG 4.1.2).
                SLED pattern: custom comboboxes on benefits intake forms
                omit required ARIA state. */}
            <div role="combobox" aria-controls="ben-listbox" style={{ display: 'none' }}>
              Filter
            </div>

            {/* PHASE-2 a11y issue NB-139 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                aria-orientation="diagonal" is not a valid token (only
                horizontal/vertical/undefined). axe-core
                `aria-valid-attr-value` fires Critical (WCAG 4.1.2). SLED
                pattern: ARIA copy-pasted from design system with
                fabricated values. */}
            <div role="separator" aria-orientation="diagonal" style={{ display: 'none' }} />

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

          {/* PHASE-2 a11y issue NB-007 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              "Important program notices" disclosure panel with overflow-y:auto
              and 180 px max-height, plain text only (no focusable
              descendants), no tabIndex on the container. Keyboard users
              cannot scroll the panel. axe-core `scrollable-region-focusable`
              fires Serious (WCAG 2.1.1). Realistic SLED finding: benefits
              programs surface mandatory disclosures in scrolling panels
              that often ship without keyboard access. */}
          <div
            aria-labelledby="program-notices-heading"
            style={{
              maxHeight: 180,
              overflowY: 'auto',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 16,
              background: 'var(--bg-soft)',
              fontSize: 13,
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
            }}
          >
            <h3 id="program-notices-heading" style={{ margin: '0 0 8px', fontSize: 14, color: 'var(--brand-deep)' }}>
              Important program notices
            </h3>
            <p style={{ marginTop: 0 }}>
              <strong>Eligibility is preliminary.</strong> The eligibility result
              above is based solely on the information you entered and is not a
              determination of benefits. A caseworker will review your
              application and may request additional documentation including
              proof of income, residency, household composition, and identity.
            </p>
            <p>
              <strong>Reporting requirements.</strong> If approved, you must
              report any change in income, household size, or address within
              ten (10) days. Failure to report changes may result in
              over-payment that you will be required to repay.
            </p>
            <p>
              <strong>Privacy notice.</strong> Information you provide is
              shared with state and federal agencies for the purpose of
              determining eligibility, preventing fraud, and program
              administration. It is not sold or shared for marketing purposes.
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>Right to appeal.</strong> If your application is denied
              or your benefits reduced, you have the right to request a fair
              hearing within ninety (90) days of the decision.
            </p>
          </div>

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
