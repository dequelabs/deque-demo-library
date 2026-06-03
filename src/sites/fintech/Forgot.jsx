import { useState, useId, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * /fintech/forgot — Reset-password flow.
 * Two states: form → success. Real-feeling but completely client-side.
 */
export default function FintechForgot() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const emailId = useId();
  const errId = useId();
  const errRef = useRef(null);
  const successHeadingRef = useRef(null);

  useEffect(() => {
    if (error && errRef.current) errRef.current.focus();
  }, [error]);
  useEffect(() => {
    if (submitted && successHeadingRef.current) successHeadingRef.current.focus();
  }, [submitted]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Enter the email address associated with your account.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="center-card-shell">
      <div className="center-card">
        {submitted ? (
          <div role="status" aria-live="polite">
            <h1 ref={successHeadingRef} tabIndex={-1} style={{ marginTop: 0, color: 'var(--success)' }}>
              Check your email
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              If we found an account for <strong>{email}</strong>, we sent a link
              you can use to reset your password. The link expires in 30 minutes.
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              Didn't get it? Check your spam folder or{' '}
              <button
                type="button"
                className="btn-link"
                onClick={() => setSubmitted(false)}
              >
                try a different email
              </button>.
            </p>
            <Link className="btn btn-primary btn-block mt-16" to="/fintech/login">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ marginTop: 0 }}>Reset your password</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Enter the email address you used to sign up. We'll send you a
              one-time link to set a new password.
            </p>

            <form onSubmit={onSubmit} noValidate style={{ marginTop: 24 }}>
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
              {/* PHASE-2 a11y issue MT-021 — see ACCESSIBILITY_ISSUES.md
                  Was: autoComplete="email" (a valid WHATWG autofill token).
                  Now: autoComplete="user" (NOT a valid WHATWG token — the spec defines
                  "username", "email", etc., but not bare "user"). Triggers axe-core
                  `autocomplete-valid` (Serious, WCAG 1.3.5). */}
              <div className="form-row">
                <label htmlFor={emailId}>Email address</label>
                <input
                  id={emailId}
                  type="email"
                  autoComplete="user"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby={error ? errId : undefined}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Send reset link
              </button>
              <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
                <Link to="/fintech/login">Remembered it? Sign in</Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
