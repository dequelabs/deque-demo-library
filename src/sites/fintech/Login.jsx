import { useState, useId, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth.jsx';

/**
 * DQBC online-banking sign-in.
 * Mock auth: any non-empty email and password ≥ 4 chars succeeds.
 * Clean accessible baseline.
 */
export default function FintechLogin() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const errId = useId();
  const helpId = useId();

  const [tab, setTab] = useState('personal');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const errRef = useRef(null);

  // If already signed in, bounce to dashboard.
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/fintech/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Focus the inline error when it appears.
  useEffect(() => {
    if (error && errRef.current) {
      errRef.current.focus();
    }
  }, [error]);

  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = fd.get('email');
    const password = fd.get('password');
    if (!email || !password || String(password).length < 4) {
      setError('Please enter your username and a password of at least 4 characters.');
      return;
    }
    setError('');
    login();
    const dest = location.state?.from || '/fintech/dashboard';
    navigate(dest, { replace: true });
  };

  return (
    <div className="fintech-login-shell">
      <aside className="fintech-login-side">
        <h1>Welcome back to your money.</h1>
        <p>
          Sign in to manage checking, savings, investments, lending, and bill pay
          — all in one place. Your security is our priority.
        </p>
        {/* PHASE-2 a11y issue MT-041 — see ACCESSIBILITY_ISSUES.md
            Low-contrast sub-text (#7a92b8) on the dark-blue brand-deep
            gradient. axe-core color-contrast goes Needs Review (gradient
            bg), Pro Advanced `text-contrast` analyses the rendered pixels
            and reports Serious (WCAG 1.4.3). */}
        <p style={{ color: '#7a92b8', fontSize: 13, marginTop: 4 }}>
          Member FDIC · Equal Housing Lender · Routing #071000013
        </p>
        {/* PHASE-2 a11y issue MT-042 — see ACCESSIBILITY_ISSUES.md
            Inline letter-spacing + word-spacing + line-height set as fixed
            values that override user stylesheets. axe-core
            `avoid-inline-spacing` fires Serious (WCAG 1.4.12 Reflow). */}
        <p style={{ letterSpacing: '0.5px', wordSpacing: '0.5px', lineHeight: '1.2', marginTop: 12 }}>
          A century of trust meets a decade of mobile-first banking.
        </p>
        <ul>
          <li>Biometric and FIDO2 sign-in supported</li>
          <li>Real-time fraud alerts on every transaction</li>
          <li>$0 liability for unauthorized purchases</li>
        </ul>
        {/* PHASE-2 a11y issue MT-040 — see ACCESSIBILITY_ISSUES.md
            Stray <dt> outside any <dl>. axe-core `dlitem` fires Serious
            (WCAG 1.3.1). HTML spec requires <dt>/<dd> to appear only as
            children of <dl>. */}
        <dt style={{ marginTop: 16, fontWeight: 600, fontSize: 13 }}>Customer since 1923</dt>
      </aside>

      <section className="fintech-login-main">
        <div className="fintech-login-card">
          <h2 style={{ margin: '0 0 6px', color: 'var(--brand-deep)' }}>Sign in</h2>
          {/* PHASE-2 a11y issue MT-037 — see ACCESSIBILITY_ISSUES.md
              <input type="button"> with NO value, NO aria-label, NO title.
              axe-core `input-button-name` fires Critical (WCAG 4.1.2):
              "Input buttons must have a discernible text". */}
          <input
            type="button"
            style={{ float: 'right', marginTop: -28, width: 28, height: 24, border: '1px solid var(--border)', borderRadius: 4, background: '#fff', cursor: 'pointer' }}
            onClick={(e) => e.preventDefault()}
          />
          <p className="muted" style={{ margin: 0 }}>Use your online banking credentials.</p>

          <div role="tablist" aria-label="Account type" className="fintech-tabs">
            {['personal', 'business', 'wealth'].map((id) => (
              <button
                key={id}
                role="tab"
                type="button"
                id={`tab-${id}`}
                aria-selected={tab === id}
                aria-controls={`panel-${id}`}
                tabIndex={tab === id ? 0 : -1}
                className="fintech-tab"
                onClick={() => setTab(id)}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>

          <form
            id={`panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            onSubmit={onSubmit}
            noValidate
          >
            {error && (
              <div
                ref={errRef}
                id={errId}
                role="alert"
                tabIndex={-1}
                className="alert-error"
              >
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="form-row">
              <label htmlFor="login-email">Username or email</label>
              <input
                id="login-email"
                name="email"
                type="text"
                autoComplete="username"
                aria-describedby={error ? errId : undefined}
                required
              />
            </div>

            <div className="form-row">
              {/* PHASE-2 a11y issue MT-004 — see ACCESSIBILITY_ISSUES.md
                  Was: <label htmlFor="login-password">Password</label>
                  Replaced with a styled <span> that LOOKS like a label but is
                  NOT programmatically associated. No aria-label, no placeholder,
                  no title — the input has no accessible name. axe-core fires
                  `label` (Critical, WCAG 3.3.2 / 4.1.2). */}
              <span className="faux-label" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</span>
              <div className="password-row">
                <input
                  id="login-password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-describedby={error ? errId : undefined}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                  aria-pressed={showPwd}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
                {/* PHASE-2 a11y issue MT-039 — see ACCESSIBILITY_ISSUES.md
                    <span role="tooltip"> with NO text content and NO
                    aria-label. axe-core `aria-tooltip-name` fires
                    Serious (WCAG 4.1.2). */}
                <span role="tooltip"></span>
              </div>
              {/* PHASE-2 a11y issue MT-038 — see ACCESSIBILITY_ISSUES.md
                  <div role="progressbar"> for "Password strength" with
                  aria-valuenow/min/max set, but NO accessible name (no
                  aria-label / aria-labelledby / title). axe-core
                  `aria-progressbar-name` fires Critical (WCAG 1.1.1). */}
              <div
                role="progressbar"
                aria-valuenow={40}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ height: 4, background: '#e3e8ef', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}
              >
                <div style={{ width: '40%', height: '100%', background: 'var(--warning)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, margin: '8px 0 24px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                <input type="checkbox" name="remember" />
                Remember this device
              </label>
              <Link to="/fintech/forgot">Forgot username or password?</Link>
            </div>

            <p id={helpId} className="mfa-hint">
              We may send a one-time code to your phone for additional security.
            </p>

            {/* PHASE-2 a11y issue MT-008 — see ACCESSIBILITY_ISSUES.md
                Visible label says "Sign in" but aria-label overrides it with
                "Submit credentials". The accessible name no longer contains
                the visible text, so voice users saying "click Sign in" can't
                target this button. axe-core `label-content-name-mismatch`
                fires (Serious, WCAG 2.5.3 A — "Label in Name"). */}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              aria-label="Submit credentials"
            >
              Sign in
            </button>

            <p style={{ textAlign: 'center', marginTop: 14, fontSize: 13 }}>
              <Link to="/fintech/help">Use biometrics or security key instead</Link>
            </p>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
            By signing in you agree to our{' '}
            <Link to="/fintech/legal#terms">Terms</Link> and{' '}
            <Link to="/fintech/legal#privacy">Privacy Notice</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
