import { useState, useRef, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, actions } from './store.jsx';

/**
 * 3-step online enrollment flow.
 * Step 1: Child info (name, DOB, grade)
 * Step 2: School selection
 * Step 3: Review & submit
 * On submit: dispatch ENROLL_CHILD, redirect to /edu-gov/schools with a
 * confirmation banner.
 *
 * Focus is moved to the step heading whenever the step changes so screen-reader
 * users hear the new context immediately.
 */
const STEPS = ['Child info', 'School', 'Review'];

export default function Enroll() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const errId = useId();

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  // NB-IGT-015: confirmation dialog open state (see comment near step 3).
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    grade: 'K',
    schoolId: state.schools[0]?.id || '',
  });

  useEffect(() => {
    if (headingRef.current) headingRef.current.focus();
  }, [step]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validateStep = () => {
    if (step === 0) {
      if (!form.firstName.trim()) return 'Please enter a first name.';
      if (!form.dob) return 'Please enter the date of birth.';
      if (!form.grade) return 'Please select a grade.';
    }
    if (step === 1) {
      if (!form.schoolId) return 'Please select a school.';
    }
    return '';
  };

  const next = (e) => {
    e?.preventDefault();
    const msg = validateStep();
    if (msg) { setError(msg); return; }
    setError('');
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = (e) => {
    e.preventDefault();
    dispatch(
      actions.enrollChild(
        form.firstName.trim(),
        form.lastName.trim(),
        form.dob,
        form.grade,
        form.schoolId
      )
    );
    navigate('/edu-gov/schools', { state: { justEnrolled: true } });
  };

  const school = state.schools.find((s) => s.id === form.schoolId);

  return (
    <>
      <div className="page-head">
        <div>
          <h1 ref={headingRef} tabIndex={-1}>
            Online enrollment — Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </h1>
          <p className="subtitle">Add a child to your Northbrook Connect account.</p>
          {/* PHASE-2 a11y issue NB-060 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Decorative-but-meaningful district crest <svg role="img"> with
              NO <title>/aria-label. axe-core `svg-img-alt` fires Serious
              (WCAG 1.1.1). SLED pattern: agencies inline crests in step
              headers without naming them. */}
          <svg role="img" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6z" />
          </svg>
          {/* PHASE-2 a11y issue NB-061 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Step progress <div role="progressbar"> with NO aria-label /
              aria-labelledby. axe-core `aria-progressbar-name` fires
              Critical (WCAG 1.1.1). SLED pattern: form wizards show a
              progress bar above the steps but only name the steps list. */}
          <div role="progressbar" aria-valuenow={(step + 1) * 33} aria-valuemin={0} aria-valuemax={100} style={{ height: 4, background: '#e5e7eb', maxWidth: 280, marginTop: 6 }}>
            <div style={{ width: `${(step + 1) * 33}%`, height: '100%', background: '#0a66c2' }} />
          </div>
          {/* PHASE-2 a11y issue NB-062 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Helper text uses #bababa on white (~2.4:1). axe-core
              `color-contrast` fires Serious (WCAG 1.4.3). SLED pattern:
              "estimated time" microcopy under a heading gets a light
              grey treatment that fails AA. */}
          <p style={{ color: '#bababa', background: '#ffffff', fontSize: 12 }}>About 5 minutes to complete.</p>
          {/* PHASE-2 a11y issue NB-063 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              `lang="enus"` is not a valid BCP-47 tag (should be "en-US").
              axe-core `valid-lang` fires Serious (WCAG 3.1.2). SLED
              pattern: editors omit the hyphen in regional language tags. */}
          <span lang="enus" style={{ fontSize: 12 }}>(English)</span>
          {/* PHASE-2 a11y issue NB-064 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Stray <dt> outside any <dl>. axe-core `dlitem` fires
              Serious (WCAG 1.3.1). SLED pattern: orphan markup left from
              a "definitions" component conversion. */}
          <dt style={{ display: 'none' }}>Estimated time</dt>
          {/* PHASE-2 a11y issue NB-065 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Focusable <button> wrapped inside <span aria-hidden="true">,
              creating a focusable but AT-hidden control. axe-core
              `aria-hidden-focus` fires Serious (WCAG 4.1.2). SLED
              pattern: presentational wrappers retro-fitted with
              aria-hidden to "tidy up" the AT view. */}
          <span aria-hidden="true">
            <button type="button" style={{ background: 'none', border: '1px solid var(--border)', padding: '2px 6px', fontSize: 12 }}>Help</button>
          </span>
        </div>
      </div>

      <ol className="steps" aria-label="Enrollment progress">
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
        <div id={errId} role="alert" className="alert-error">
          {error}
        </div>
      )}

      <div className="card" style={{ maxWidth: 640 }}>
        {step === 0 && (
          <form onSubmit={next} noValidate>
            <div className="form-row">
              <label htmlFor="enr-first">Child's first name</label>
              <input
                id="enr-first"
                type="text"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                autoComplete="given-name"
                required
              />
              {/* PHASE-2 a11y issue NB-IGT-008 (Forms IGT) — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                  Inline error message rendered visually next to the
                  child's first-name field, but the input has NO
                  aria-describedby pointing at this message. The Forms
                  IGT verifies that visible field-level errors are
                  programmatically associated with their input. */}
              <p style={{ color: 'var(--danger)', fontSize: 13, margin: '4px 0 0' }}>
                First name is required.
              </p>
            </div>
            {/* PHASE-2 a11y issue NB-066 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                "Middle name" field uses a styled <span> instead of a real
                <label>. axe-core `label` fires Critical (WCAG 3.3.2).
                SLED pattern: public-records request form fields commonly
                ship with a <span> label after a redesign. */}
            <div className="form-row">
              <span style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Middle name (optional)</span>
              <input type="text" name="middleName" autoComplete="additional-name" />
            </div>
            {/* PHASE-2 a11y issue NB-067 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                Age field uses `autoComplete="age"` — not a valid WHATWG
                token. axe-core `autocomplete-valid` fires Serious (WCAG
                1.3.5). SLED pattern: devs invent semantic autocomplete
                strings ("age", "fullname") instead of WHATWG values. */}
            <div className="form-row">
              <label htmlFor="enr-age">Child's age</label>
              <input id="enr-age" type="number" autoComplete="age" />
            </div>
            {/* PHASE-2 a11y issue NB-068 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                Extra "Preferred language" <select> has NO label or
                aria-label. axe-core `select-name` fires Critical (WCAG
                4.1.2). SLED pattern: optional fields tacked on by a
                stakeholder mid-cycle and missing labels. */}
            <div className="form-row">
              <select defaultValue="">
                <option value="" disabled>Preferred language…</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
            {/* PHASE-2 a11y issue NB-069 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                Custom <div role="combobox"> missing required
                `aria-expanded`. axe-core `aria-required-attr` fires
                Critical (WCAG 4.1.2). SLED pattern: hand-rolled
                school-search combobox without proper ARIA states. */}
            <div role="combobox" aria-controls="prior-school-list" tabIndex={0} style={{ padding: 6, border: '1px solid var(--border)', borderRadius: 4, marginBottom: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
              Prior school…
            </div>
            {/* PHASE-2 a11y issue NB-070 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                `aria-labeledby` (one L) typo on the field group note.
                axe-core `aria-valid-attr` fires Critical (WCAG 4.1.2).
                SLED pattern: pasted aria attributes with sneaky typos. */}
            <p id="enr-note" aria-labeledby="enr-note" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              We use this only for class placement.
            </p>
            {/* PHASE-2 a11y issue NB-071 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                role="presentation" combined with `aria-required="true"`,
                an attribute disallowed by that role. axe-core
                `aria-allowed-attr` fires Critical (WCAG 4.1.2). SLED
                pattern: devs sprinkle ARIA states onto wrappers without
                checking role compatibility. */}
            <div role="presentation" aria-required="true" style={{ padding: 6, border: '1px dashed var(--border)', marginBottom: 12 }}>
              Required documentation will be uploaded later.
            </div>
            {/* PHASE-2 a11y issue NB-072 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                Icon-only "info" button has NO accessible name. axe-core
                `button-name` fires Critical (WCAG 4.1.2). SLED pattern:
                form rows pair icon buttons with tooltips but neither
                the button nor the tooltip carries a name. */}
            <button type="button" style={{ background: 'none', border: 'none', padding: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v0M12 12v4" />
              </svg>
            </button>

            <div className="form-row">
              <label htmlFor="enr-last">Child's last name (optional)</label>
              <input
                id="enr-last"
                type="text"
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                autoComplete="family-name"
                placeholder="Defaults to your family name"
              />
            </div>
            <div className="form-row">
              <label htmlFor="enr-dob">Date of birth</label>
              <input
                id="enr-dob"
                type="date"
                value={form.dob}
                onChange={(e) => update('dob', e.target.value)}
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="enr-grade">Enrolling grade</label>
              <select
                id="enr-grade"
                value={form.grade}
                onChange={(e) => update('grade', e.target.value)}
                required
              >
                {['K','1','2','3','4','5','6','7','8','9','10','11','12'].map((g) => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary">Continue</button>
            </div>
          </form>
        )}

        {step === 1 && (
          <form onSubmit={next} noValidate>
            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend style={{ fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
                Choose a school
              </legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {state.schools.map((s) => (
                  <label key={s.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 12, border: '1px solid var(--border)', borderRadius: 10, background: '#fff', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="schoolId"
                      value={s.id}
                      checked={form.schoolId === s.id}
                      onChange={(e) => update('schoolId', e.target.value)}
                      style={{ marginTop: 4 }}
                    />
                    <span>
                      <strong style={{ color: 'var(--brand-deep)' }}>{s.name}</strong>
                      <br />
                      <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                        Grades {s.grades} · {s.address}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <button type="button" className="btn btn-outline" onClick={back}>Back</button>
              <button type="submit" className="btn btn-primary">Continue</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={submit} noValidate>
            <h2 style={{ margin: '0 0 12px', fontSize: 18, color: 'var(--brand-deep)' }}>
              Review &amp; submit
            </h2>

            {/* PHASE-2 a11y issue NB-IGT-015 (Modals IGT) — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                "Are you sure?" confirmation dialog opened from review
                step. The Cancel button closes the dialog but does NOT
                return focus to the opener button (the trigger). The
                Modals IGT walks SEs through verifying focus
                restoration when a dialog closes. */}
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setConfirmOpen(true)}
              style={{ marginBottom: 12 }}
            >
              Verify details
            </button>
            {confirmOpen && (
              <div
                role="dialog"
                aria-labelledby="enr-confirm-h"
                style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 12, marginBottom: 12, background: '#fff' }}
              >
                <h3 id="enr-confirm-h" style={{ margin: '0 0 6px' }}>Are you sure?</h3>
                <p style={{ margin: '0 0 8px', fontSize: 13 }}>
                  Once you submit, the district will contact you within two business days.
                </p>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </button>
              </div>
            )}
            <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '6px 16px', margin: 0, fontSize: 14 }}>
              <dt style={{ color: 'var(--text-muted)' }}>Child</dt>
              <dd style={{ margin: 0 }}>{form.firstName} {form.lastName}</dd>
              <dt style={{ color: 'var(--text-muted)' }}>Date of birth</dt>
              <dd style={{ margin: 0 }}>{form.dob}</dd>
              <dt style={{ color: 'var(--text-muted)' }}>Grade</dt>
              <dd style={{ margin: 0 }}>{form.grade}</dd>
              <dt style={{ color: 'var(--text-muted)' }}>School</dt>
              <dd style={{ margin: 0 }}>{school?.name}</dd>
            </dl>
            <p className="form-help" style={{ marginTop: 16 }}>
              By submitting, you confirm the information above is accurate.
              The district will email you within two business days.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <button type="button" className="btn btn-outline" onClick={back}>Back</button>
              <button type="submit" className="btn btn-primary">Submit enrollment</button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
