import { useState, useRef, useEffect, useId, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, actions } from './store.jsx';

/**
 * NSU course registration — 3-step authed flow.
 * Step 1: Browse + filter courses, add to cart.
 * Step 2: Review cart, remove items, see naive day/time conflict warnings.
 * Step 3: Confirm — dispatch REGISTER_COURSE per cart item, redirect to /account.
 */
const STEPS = ['Browse courses', 'Review cart', 'Confirm'];

// Naive conflict check: same days share at least one letter token AND
// time ranges overlap.
function parseTime(t) {
  // "9:00–9:50 AM" → minutes since midnight start, end
  const m = t.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return null;
  const [, h1, mn1, h2, mn2, ampm] = m;
  let start = parseInt(h1, 10) * 60 + parseInt(mn1, 10);
  let end   = parseInt(h2, 10) * 60 + parseInt(mn2, 10);
  if (ampm.toUpperCase() === 'PM') {
    if (parseInt(h1, 10) !== 12) start += 12 * 60;
    if (parseInt(h2, 10) !== 12) end   += 12 * 60;
  }
  return [start, end];
}
function daysOverlap(a, b) {
  // 'MWF', 'TTh', 'MW' — Th = 'h' to disambiguate
  const norm = (s) => s.replace(/Th/g, 'h');
  const aSet = new Set(norm(a));
  for (const ch of norm(b)) if (aSet.has(ch)) return true;
  return false;
}
function conflicts(a, b) {
  if (!daysOverlap(a.days, b.days)) return false;
  const at = parseTime(a.time), bt = parseTime(b.time);
  if (!at || !bt) return false;
  return at[0] < bt[1] && bt[0] < at[1];
}

export default function Register() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const errId = useId();

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]); // array of course ids
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('all');

  useEffect(() => {
    if (headingRef.current) headingRef.current.focus();
  }, [step]);

  // Derive departments from course codes (the prefix before the space).
  const depts = useMemo(() => {
    const set = new Set(state.courses.map((c) => c.code.split(' ')[0]));
    return ['all', ...Array.from(set).sort()];
  }, [state.courses]);

  const visibleCourses = state.courses.filter((c) => {
    if (dept !== 'all' && !c.code.startsWith(dept + ' ')) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q)
    );
  });

  const cartCourses = cart
    .map((id) => state.courses.find((c) => c.id === id))
    .filter(Boolean);
  const totalCredits = cartCourses.reduce((sum, c) => sum + c.credits, 0);

  const conflictPairs = [];
  for (let i = 0; i < cartCourses.length; i++) {
    for (let j = i + 1; j < cartCourses.length; j++) {
      if (conflicts(cartCourses[i], cartCourses[j])) {
        conflictPairs.push([cartCourses[i], cartCourses[j]]);
      }
    }
  }

  const isFull = (c) => c.enrolled >= c.capacity;
  const inCart = (c) => cart.includes(c.id);
  const alreadyEnrolled = (c) => state.enrollments.some((e) => e.courseId === c.id);

  const addToCart = (id) => setCart((c) => (c.includes(id) ? c : [...c, id]));
  const removeFromCart = (id) => setCart((c) => c.filter((x) => x !== id));

  const next = () => {
    if (step === 0 && cart.length === 0) {
      setError('Add at least one course to your cart to continue.');
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
    for (const id of cart) {
      dispatch(actions.registerCourse(id));
    }
    navigate('/edu-gov/account', { state: { justRegistered: true } });
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 ref={headingRef} tabIndex={-1}>
            Course registration — Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </h1>
          <p className="subtitle">Northbrook State University · Fall semester registration.</p>
          {/* PHASE-2 a11y issue NB-098 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Subtitle rendered in low-contrast brand sand (#cdbf9f on
              #fff ~2.0:1). axe-core `color-contrast` fires Serious
              (WCAG 1.4.3). SLED pattern: brand-tint subtitles. */}
          <p style={{ color: '#cdbf9f', background: '#ffffff', fontSize: 13 }}>
            Registration closes Friday at 5pm.
          </p>

          {/* PHASE-2 a11y issue NB-099 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Icon-only "help" button with NO accessible name. axe-core
              `button-name` fires Critical (WCAG 4.1.2). SLED pattern:
              help affordances become icon-only on redesign. */}
          <button type="button" style={{ background: 'none', border: '1px solid var(--border)', padding: 6, marginRight: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.1 9.5a3 3 0 1 1 5.5 1.5c-.5 1-1.6 1.5-2.6 2-.7.5-1 1-1 2" />
              <circle cx="12" cy="17.5" r="1" />
            </svg>
          </button>

          {/* PHASE-2 a11y issue NB-100 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              "Registration progress" <svg role="img"> with NO <title>.
              axe-core `svg-img-alt` fires Serious (WCAG 1.1.1). SLED
              pattern: progress icons treated as decoration. */}
          <svg role="img" width="32" height="32" viewBox="0 0 32 32" style={{ verticalAlign: 'middle' }}>
            <circle cx="16" cy="16" r="14" fill="none" stroke="#0a66c2" strokeWidth="3" strokeDasharray="60 88" />
          </svg>

          {/* PHASE-2 a11y issue NB-101 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              `lang="zz"` is not a valid BCP-47 subtag. axe-core
              `valid-lang` fires Serious (WCAG 3.1.2). SLED pattern:
              translation hint with bogus lang code. */}
          <span lang="zz" style={{ fontSize: 12 }}>Registro en español</span>

          {/* PHASE-2 a11y issue NB-102 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Cart <div role="progressbar"> with NO accessible name.
              axe-core `aria-progressbar-name` fires Serious (WCAG
              1.1.1). SLED pattern: dual progress bars on multi-step
              flows ship without names. */}
          <div role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{ height: 6, background: '#e5e7eb', maxWidth: 240 }}>
            <div style={{ width: '50%', height: '100%', background: '#0a66c2' }} />
          </div>

          {/* PHASE-2 a11y issue NB-103 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              `aria-labeledby` typo of `aria-labelledby`. axe-core
              `aria-valid-attr` fires Critical (WCAG 4.1.2). */}
          <div aria-labeledby="reg-h" style={{ display: 'none' }} />

          {/* PHASE-2 a11y issue NB-104 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              `role="presentation"` with `aria-required="true"`. axe-core
              `aria-allowed-attr` fires Serious (WCAG 4.1.2). SLED
              pattern: wrappers get role=presentation but keep required
              attribute from an earlier form widget. */}
          <span role="presentation" aria-required="true" style={{ display: 'none' }} />

          {/* PHASE-2 a11y issue NB-105 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              <h2> with `aria-rowindex` (only valid on row/cell roles).
              axe-core `aria-prohibited-attr` fires Serious (WCAG 4.1.2). */}
          <h2 aria-rowindex={1} style={{ display: 'none' }}>hidden heading</h2>
        </div>
      </div>

      <ol className="steps" aria-label="Registration progress">
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

      <div
        className="card"
        style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}
        aria-live="polite"
      >
        <div>
          <strong>Cart:</strong> {cart.length} course{cart.length === 1 ? '' : 's'} · {totalCredits} credit{totalCredits === 1 ? '' : 's'}
        </div>
        {conflictPairs.length > 0 && (
          <div style={{ color: 'var(--danger)', fontSize: 13 }}>
            Schedule conflict detected — review in step 2.
          </div>
        )}
      </div>

      {error && (
        <div id={errId} role="alert" className="alert-error">{error}</div>
      )}

      {step === 0 && (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 16 }}>
              <div className="form-row" style={{ margin: 0 }}>
                <label htmlFor="reg-search">Search courses</label>
                <input
                  id="reg-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Code, title, or instructor"
                />
              </div>
              <div className="form-row" style={{ margin: 0 }}>
                <label htmlFor="reg-dept">Department</label>
                <select id="reg-dept" value={dept} onChange={(e) => setDept(e.target.value)}>
                  {depts.map((d) => (
                    <option key={d} value={d}>{d === 'all' ? 'All departments' : d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* PHASE-2 a11y issue NB-106 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                "Intended major" input with NO associated <label>. axe-core
                `label` fires Critical (WCAG 1.3.1, 4.1.2). SLED pattern:
                redesigned form rows drop the visible label in favor of a
                placeholder. */}
            <input type="text" placeholder="Intended major" style={{ marginTop: 12, padding: '6px 10px' }} />

            {/* PHASE-2 a11y issue NB-107 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                `autocomplete="major"` is not a valid HTML autofill token.
                axe-core `autocomplete-valid` fires Serious (WCAG 1.3.5).
                SLED pattern: forms invent custom autocomplete tokens. */}
            <input type="text" aria-label="Major" autoComplete="major" style={{ marginTop: 8, padding: '6px 10px' }} />

            {/* PHASE-2 a11y issue NB-108 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                Extra "Term" <select> with NO label or aria-label.
                axe-core `select-name` fires Critical (WCAG 4.1.2). */}
            <select defaultValue="" style={{ marginTop: 8 }}>
              <option value="" disabled>Term…</option>
              <option value="fa">Fall</option>
              <option value="sp">Spring</option>
            </select>

            {/* PHASE-2 a11y issue NB-109 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                <div role="combobox"> missing required `aria-expanded`.
                axe-core `aria-required-attr` fires Critical (WCAG
                4.1.2). SLED pattern: custom combobox widgets ship
                without the required attribute set. */}
            <div role="combobox" aria-label="Course level" tabIndex={0} style={{ marginTop: 8, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 4, width: 200 }}>
              Choose level
            </div>
            {/* PHASE-2 a11y issue NB-006 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                Custom-widget "Instructor quick filter" rendered as a
                <div role="searchbox" tabIndex={0} contentEditable>. The
                aria-input-field-name rule applies specifically to ARIA
                custom widgets (not native <input>s), so the pattern that
                trips axe-core is a styled <div> with role="searchbox"
                and NO aria-label / aria-labelledby. Fires Moderate
                (WCAG 4.1.2). Realistic SLED pattern: course catalog gets
                a "modern" widget refactor and the accessible name is
                left behind. */}
            <div
              role="searchbox"
              tabIndex={0}
              contentEditable
              suppressContentEditableWarning
              style={{ marginTop: 12, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 999, width: 240, minHeight: 18, fontSize: 14, color: 'var(--text-secondary)' }}
            />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>Quick-filter by instructor name</p>
          </div>

          <table className="data-table">
            <caption>Available courses ({visibleCourses.length})</caption>
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Title</th>
                <th scope="col">Credits</th>
                <th scope="col">Instructor</th>
                <th scope="col">Days</th>
                <th scope="col">Time</th>
                <th scope="col">Seats</th>
                <th scope="col"><span className="visually-hidden">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {visibleCourses.map((c) => {
                const full = isFull(c);
                const already = alreadyEnrolled(c);
                const inC = inCart(c);
                return (
                  <tr key={c.id}>
                    <th scope="row" style={{ fontWeight: 600 }}>{c.code}</th>
                    <td>{c.title}</td>
                    <td>{c.credits}</td>
                    <td>{c.instructor}</td>
                    <td>{c.days}</td>
                    <td>{c.time}</td>
                    <td>{c.enrolled}/{c.capacity}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline"
                        disabled={full || inC || already}
                        onClick={() => addToCart(c.id)}
                      >
                        {already ? 'Enrolled' : inC ? 'In cart' : full ? 'Full' : 'Add'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {visibleCourses.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No matching courses.</td></tr>
              )}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button type="button" className="btn btn-primary" onClick={next}>
              Review cart
            </button>
          </div>
        </>
      )}

      {step === 1 && (
        <div className="card" style={{ maxWidth: 800 }}>
          {cartCourses.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <table className="data-table">
                <caption>Cart — {cartCourses.length} course{cartCourses.length === 1 ? '' : 's'}, {totalCredits} credits</caption>
                <thead>
                  <tr>
                    <th scope="col">Code</th>
                    <th scope="col">Title</th>
                    <th scope="col">Credits</th>
                    <th scope="col">Days</th>
                    <th scope="col">Time</th>
                    <th scope="col"><span className="visually-hidden">Action</span></th>
                  </tr>
                </thead>
                <tbody>
                  {cartCourses.map((c) => (
                    <tr key={c.id}>
                      <th scope="row" style={{ fontWeight: 600 }}>{c.code}</th>
                      <td>{c.title}</td>
                      <td>{c.credits}</td>
                      <td>{c.days}</td>
                      <td>{c.time}</td>
                      <td>
                        <button type="button" className="btn-link" onClick={() => removeFromCart(c.id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {conflictPairs.length > 0 && (
                <div className="alert-error" role="alert" style={{ marginTop: 16 }}>
                  <strong>Schedule conflicts:</strong>
                  <ul style={{ margin: '6px 0 0 18px' }}>
                    {conflictPairs.map(([a, b], i) => (
                      <li key={i}>{a.code} and {b.code} overlap ({a.days} {a.time} / {b.days} {b.time}).</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <button type="button" className="btn btn-outline" onClick={back}>Back</button>
            <button type="button" className="btn btn-primary" onClick={next} disabled={cartCourses.length === 0}>
              Continue to confirm
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card" style={{ maxWidth: 800 }}>
          <h2 style={{ margin: '0 0 12px', fontSize: 18, color: 'var(--brand-deep)' }}>
            Confirm registration
          </h2>
          <p className="form-help" style={{ marginTop: 0 }}>
            You are about to register for {cartCourses.length} course
            {cartCourses.length === 1 ? '' : 's'} ({totalCredits} credits).
          </p>
          <ul style={{ margin: '12px 0 0 18px' }}>
            {cartCourses.map((c) => (
              <li key={c.id}>
                <strong>{c.code}</strong> — {c.title} ({c.credits} cr · {c.days} {c.time})
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <button type="button" className="btn btn-outline" onClick={back}>Back</button>
            <button type="button" className="btn btn-primary" onClick={submit}>
              Confirm registration
            </button>
          </div>
        </div>
      )}
    </>
  );
}
