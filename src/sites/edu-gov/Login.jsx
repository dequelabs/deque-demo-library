import { useState, useId, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth.jsx';

/**
 * Northbrook Connect citizen sign-in.
 * Mock auth: any non-empty username + a password of at least 4 characters
 * is accepted. Clean accessible baseline.
 */
export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const errId = useId();
  const helpId = useId();

  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const errRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/edu-gov/account', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error && errRef.current) errRef.current.focus();
  }, [error]);

  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const username = fd.get('username');
    const password = fd.get('password');
    if (!username || !password || String(password).length < 4) {
      setError('Please enter your username and a password of at least 4 characters.');
      return;
    }
    setError('');
    login();
    const dest = location.state?.from || '/edu-gov/account';
    navigate(dest, { replace: true });
  };

  return (
    <div className="auth-shell-public">
      <aside className="auth-shell-side">
        {/* PHASE-2 a11y issue NB-023 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Inline brand logo <svg role="img"> with NO <title> / aria-label.
            axe-core `svg-img-alt` fires Serious (WCAG 1.1.1). SLED pattern:
            agencies inline-paste an exported brand SVG and trust the
            surrounding heading to convey identity. */}
        <svg role="img" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21h18M5 21V8l7-5 7 5v13" />
        </svg>
        {/* PHASE-2 a11y issue NB-024 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Decorative <div role="img"> seal has NO accessible name.
            axe-core `role-img-alt` fires Serious (WCAG 1.1.1). SLED
            pattern: CSS-image-only seals appear identical to sighted users
            but expose role="img" without a name to assistive tech. */}
        <div role="img" style={{ width: 32, height: 32, background: '#0a66c2', borderRadius: '50%', display: 'inline-block', marginBottom: 8 }} />
        <h1>One login for all of Northbrook State.</h1>
        <p>
          Sign in to enroll children in school, register for university courses,
          renew your vehicle, apply for benefits, and request city permits.
        </p>
        <ul>
          <li>Single sign-on across all state agencies</li>
          <li>Secure two-factor sign-in available</li>
          <li>Accessible to assistive technology</li>
        </ul>
        {/* PHASE-2 a11y issue NB-025 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Stray <dt> outside any <dl>. axe-core `dlitem` fires Serious
            (WCAG 1.3.1). SLED pattern: CMS shortcode for "definition term"
            renders without an enclosing <dl> when the editor only inserts
            one half of the pair. */}
        <dt style={{ display: 'none' }}>Account benefit</dt>
        {/* PHASE-2 a11y issue NB-026 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            `lang="frx"` is not a valid BCP-47 subtag. axe-core
            `valid-lang` fires Serious (WCAG 3.1.2). SLED pattern: editors
            mistype French ("fr") as "frx" when localising welcome strings. */}
        <p><span lang="frx">Bienvenue à Northbrook.</span></p>
      </aside>

      <section className="auth-shell-main">
        <div className="auth-shell-card">
          <h2 style={{ margin: '0 0 6px', color: 'var(--brand-deep)' }}>Sign in</h2>
          <p className="muted" style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Use your Northbrook Connect credentials.
          </p>

          <form onSubmit={onSubmit} noValidate style={{ marginTop: 20 }}>
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
              <label htmlFor="login-username">Username or email</label>
              <input
                id="login-username"
                name="username"
                type="text"
                autoComplete="username"
                aria-describedby={error ? errId : undefined}
                required
              />
            </div>

            {/* PHASE-2 a11y issue NB-027 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                "Recent usernames" custom combobox <div role="combobox"> is
                missing required `aria-expanded`. axe-core
                `aria-required-attr` fires Critical (WCAG 4.1.2). SLED
                pattern: hand-rolled comboboxes ship without the required
                ARIA states because the dev followed only a Bootstrap demo. */}
            <div role="combobox" aria-controls="recent-users-list" tabIndex={0} style={{ padding: 6, border: '1px solid var(--border)', borderRadius: 4, marginBottom: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
              Recent usernames…
            </div>

            {/* PHASE-2 a11y issue NB-028 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                `aria-labeledby` (one L) typo — should be `aria-labelledby`.
                axe-core `aria-valid-attr` fires Critical (WCAG 4.1.2).
                SLED pattern: easy single-letter typo that survives code
                review because the misspelling is plausible English. */}
            <p id="login-disclaimer" aria-labeledby="login-disclaimer" style={{ fontSize: 12, color: '#b5b5b5', background: '#ffffff' }}>
              {/* PHASE-2 a11y issue NB-029 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                  Disclaimer text uses a near-grey on white (~2.4:1).
                  axe-core `color-contrast` fires Serious (WCAG 1.4.3).
                  SLED pattern: "fine print" disclaimers intentionally
                  toned-down for visual hierarchy but failing AA. */}
              Sign-in attempts are logged. Do not share your password.
            </p>

            <div className="form-row">
              <label htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-describedby={(error ? errId + ' ' : '') + helpId}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                  aria-pressed={showPwd}
                  style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-secondary)', padding: 6,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
              <p id={helpId} className="form-help">
                Use at least 4 characters. (Demo: any non-empty value works.)
              </p>
              {/* PHASE-2 a11y issue NB-030 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                  Password-strength <div role="progressbar"> with NO
                  aria-label / aria-labelledby. axe-core
                  `aria-progressbar-name` fires Critical (WCAG 1.1.1).
                  SLED pattern: indicator implemented as a colour bar with
                  the textual "Strong/Weak" label tucked beside it but
                  never linked to the progressbar role. */}
              <div role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} style={{ height: 6, background: '#e5e7eb', marginTop: 6 }}>
                <div style={{ width: '40%', height: '100%', background: '#f59e0b' }} />
              </div>
              {/* PHASE-2 a11y issue NB-031 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                  Empty <span role="tooltip"> placeholder. axe-core
                  `aria-tooltip-name` fires Serious (WCAG 4.1.2). SLED
                  pattern: tooltips pre-mounted for animation but never
                  populated with content. */}
              <span role="tooltip" id="pwd-tip" />
            </div>

            {/* PHASE-2 a11y issue NB-032 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                Extra "Security question" <input> uses a styled <span>
                instead of a real <label>. axe-core `label` fires Critical
                (WCAG 3.3.2). SLED pattern: visual-redesign moves the
                field label into a span for typography control and loses
                the programmatic association. */}
            <div className="form-row">
              <span style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Security question</span>
              <input type="text" name="securityAnswer" />
            </div>

            {/* PHASE-2 a11y issue NB-IGT-007 (Forms IGT) — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                "Mother's maiden name" input marked HTML `required` but
                with NO visible required marker (no asterisk, no "required"
                text), NO `aria-required`. The Forms IGT verifies that
                required fields are programmatically AND visually
                indicated. */}
            <div className="form-row">
              <label htmlFor="login-maiden">Mother's maiden name</label>
              <input id="login-maiden" type="text" name="motherMaiden" required />
            </div>

            {/* PHASE-2 a11y issue NB-033 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                role="button" combined with `aria-required="true"`, an
                attribute not allowed on that role. axe-core
                `aria-allowed-attr` fires Critical (WCAG 4.1.2). SLED
                pattern: devs sprinkle aria-required onto anything that
                "must be filled in" without checking role compatibility. */}
            <div role="button" tabIndex={0} aria-required="true" style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 4, display: 'inline-block', marginBottom: 12 }}>
              I agree to the terms
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0 20px', fontSize: 13 }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                <input type="checkbox" name="remember" /> Remember this device
              </label>
              <Link to="/edu-gov">Forgot password?</Link>
            </div>

            {/* PHASE-2 a11y issue NB-034 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                `<input type="button">` with NO `value` attribute has no
                accessible name. axe-core `input-button-name` fires
                Critical (WCAG 4.1.2). SLED pattern: secondary "Help"
                buttons styled via CSS background images lose their text. */}
            <input type="button" style={{ background: 'none', border: '1px solid var(--border)', padding: '4px 10px', marginBottom: 8 }} />

            <button type="submit" className="btn btn-primary btn-block">
              Sign in
            </button>

            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
              New to Northbrook Connect?{' '}
              <Link to="/edu-gov">Create an account</Link>
            </p>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
            By signing in you agree to the{' '}
            <Link to="/edu-gov">Terms of Use</Link> and{' '}
            <Link to="/edu-gov">Privacy Notice</Link>.
            {/* PHASE-2 a11y issue NB-035 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                Empty supplemental terms <a> (icon-only PDF link stripped).
                axe-core `link-name` fires Critical (WCAG 2.4.4). SLED
                pattern: "Read the full statute" links shipped as
                icon-only buttons with the aria-label dropped. */}
            {' '}<a href="/terms-full.pdf" onClick={(e) => e.preventDefault()} style={{ display: 'inline-block', width: 14, height: 14, border: '1px solid var(--border)' }}></a>
          </p>
        </div>
      </section>
    </div>
  );
}
