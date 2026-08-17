import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth.jsx';

/**
 * Pulsegrid Login — mock auth. Any credentials will sign you in.
 *
 * Intentional axe/IGT issues (see PULSEGRID_ACCESSIBILITY_ISSUES.md):
 *   PG-011 label                  — password field has only a placeholder, no <label>
 *   PG-012 autocomplete-valid     — bad autocomplete="user-email"
 *   PG-013 aria-valid-attr-value  — invalid aria-invalid="please-check" value
 *   PG-014 form-field-multiple-labels — the email input is targeted by two labels
 *   PG-020 aria-hidden-focus      — focusable "Show password" toggle inside aria-hidden
 *   PG-IGT-004 (Forms)            — required indicated with "*" only, no instructions
 */
export default function Login() {
  const nav = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('dq@deque.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function onSubmit(e) {
    e.preventDefault();
    if (!email.includes('@') || password.length < 4) {
      setError('Please enter a valid email and password.');
      return;
    }
    setError('');
    signIn();
    nav('/saas/dashboard');
  }

  return (
    <div className="pg-login">
      <div className="pg-login-card">
        <h1>Welcome back</h1>
        <p className="sub">Log in to your Pulsegrid workspace.</p>

        <form className="pg-login-form" onSubmit={onSubmit} noValidate>
          {/* PG-014: two <label> elements point at #email */}
          <label htmlFor="email">Work email <span aria-hidden="true" style={{ color: 'var(--pg-red)' }}>*</span></label>
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // PG-012: invalid autocomplete token
            autoComplete="user-email"
            // PG-013: invalid aria-invalid value
            aria-invalid="please-check"
          />

          {/* PG-011: no <label> — only placeholder */}
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password *"
            autoComplete="current-password"
          />

          {/* PG-020: focusable toggle wrapped in aria-hidden container */}
          <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{ background: 'transparent', border: 'none', color: 'var(--pg-text-secondary)', cursor: 'pointer', fontSize: 12 }}
            >
              {showPassword ? 'Hide' : 'Show'} password
            </button>
          </div>

          {error && (
            <div role="alert" style={{ color: 'var(--pg-red)', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button type="submit" className="pg-btn pg-btn--primary" style={{ width: '100%' }}>
            Log in
          </button>

          <div className="pg-login-links">
            <a href="#forgot" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            <a href="#sso" onClick={(e) => e.preventDefault()}>Use SSO</a>
          </div>
        </form>

        <div className="pg-login-divider">or continue with</div>

        <div className="pg-login-sso">
          <button type="button" className="pg-btn pg-btn--outline">Google</button>
          <button type="button" className="pg-btn pg-btn--outline">GitHub</button>
          <button type="button" className="pg-btn pg-btn--outline">SAML</button>
        </div>

        <p style={{ fontSize: 12, textAlign: 'center', marginTop: 20, color: 'var(--pg-text-muted)' }}>
          Demo credentials: any email + password ≥ 4 characters.
        </p>
      </div>
    </div>
  );
}
