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
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0 20px', fontSize: 13 }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                <input type="checkbox" name="remember" /> Remember this device
              </label>
              <Link to="/edu-gov">Forgot password?</Link>
            </div>

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
          </p>
        </div>
      </section>
    </div>
  );
}
