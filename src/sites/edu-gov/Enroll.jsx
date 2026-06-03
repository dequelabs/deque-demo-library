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
            </div>
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
