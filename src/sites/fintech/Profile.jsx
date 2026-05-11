import { useState, useId, useRef, useEffect } from 'react';
import { useStore, actions } from './store.jsx';

export default function FintechProfile() {
  const { state, dispatch } = useStore();
  const [savedNotice, setSavedNotice] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const noticeRef = useRef(null);

  // Move focus to the saved notice for AT users when it appears
  useEffect(() => {
    if (savedNotice && noticeRef.current) {
      noticeRef.current.focus();
    }
  }, [savedNotice]);

  const onSaveProfile = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    dispatch(actions.updateProfile({
      firstName: fd.get('firstName'),
      lastName: fd.get('lastName'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      address: {
        line1: fd.get('line1'),
        line2: fd.get('line2'),
        city: fd.get('city'),
        state: fd.get('state'),
        zip: fd.get('zip'),
      },
    }));
    setSavedNotice('Your profile has been updated.');
  };

  const onSaveNotifications = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    dispatch(actions.updateNotifications({
      largeTransactions: fd.get('largeTransactions') === 'on',
      cardSwipe: fd.get('cardSwipe') === 'on',
      productNews: fd.get('productNews') === 'on',
      monthlyStatements: fd.get('monthlyStatements') === 'on',
    }));
    setSavedNotice('Notification preferences saved.');
  };

  const handleReset = () => {
    dispatch(actions.resetDemo());
    setConfirmReset(false);
    setSavedNotice('Demo data has been reset to defaults.');
  };

  const u = state.user;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Profile &amp; settings</h1>
          <p className="subtitle">Manage your personal info and how DQBC reaches you.</p>
        </div>
      </div>

      {savedNotice && (
        <div
          ref={noticeRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="card"
          style={{ marginBottom: 24, borderLeft: '4px solid var(--success)' }}
        >
          <strong style={{ color: 'var(--success)' }}>Saved.</strong> {savedNotice}
        </div>
      )}

      {/* Personal info */}
      <section aria-labelledby="info-heading" className="card" style={{ marginBottom: 24 }}>
        <h2 id="info-heading" style={{ margin: '0 0 16px' }}>Personal info</h2>
        <form onSubmit={onSaveProfile}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field name="firstName" label="First name" defaultValue={u.firstName} required autoComplete="given-name" />
            <Field name="lastName"  label="Last name"  defaultValue={u.lastName}  required autoComplete="family-name" />
            <Field name="email"     label="Email"      defaultValue={u.email}     required autoComplete="email"      type="email" />
            <Field name="phone"     label="Phone"      defaultValue={u.phone}     autoComplete="tel"                 type="tel" />
          </div>

          <h3 style={{ fontSize: 14, marginTop: 16, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Mailing address
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0 }}>
            <Field name="line1" label="Street address" defaultValue={u.address.line1} autoComplete="address-line1" />
            <Field name="line2" label="Apt, suite, etc. (optional)" defaultValue={u.address.line2} autoComplete="address-line2" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
            <Field name="city"  label="City"       defaultValue={u.address.city}  autoComplete="address-level2" />
            <Field name="state" label="State"      defaultValue={u.address.state} autoComplete="address-level1" />
            <Field name="zip"   label="ZIP"        defaultValue={u.address.zip}   autoComplete="postal-code" />
          </div>

          <button type="submit" className="btn btn-primary mt-16">Save changes</button>
        </form>
      </section>

      {/* Notifications */}
      <section aria-labelledby="notif-heading" className="card" style={{ marginBottom: 24 }}>
        <h2 id="notif-heading" style={{ margin: '0 0 16px' }}>Notifications</h2>
        <form onSubmit={onSaveNotifications}>
          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend className="muted" style={{ fontSize: 14, marginBottom: 12 }}>
              Email me about:
            </legend>
            <NotifCheckbox name="largeTransactions" defaultChecked={u.notifications.largeTransactions} label="Large transactions" hint="Anything over $500" />
            <NotifCheckbox name="cardSwipe"          defaultChecked={u.notifications.cardSwipe}          label="Every card swipe" />
            <NotifCheckbox name="monthlyStatements"  defaultChecked={u.notifications.monthlyStatements}  label="When monthly statements are ready" />
            <NotifCheckbox name="productNews"        defaultChecked={u.notifications.productNews}        label="Product news and tips" hint="No more than one per week" />
          </fieldset>
          <button type="submit" className="btn btn-primary mt-16">Save preferences</button>
        </form>
      </section>

      {/* Reset demo */}
      <section aria-labelledby="reset-heading" className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
        <h2 id="reset-heading" style={{ margin: '0 0 8px' }}>Reset demo data</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Restore the seed accounts, transactions, payees, cards, and statements.
          Your sign-in stays. Useful before a customer demo.
        </p>
        {!confirmReset ? (
          <button type="button" className="btn btn-outline" onClick={() => setConfirmReset(true)}>
            Reset demo data
          </button>
        ) : (
          <div role="alertdialog" aria-labelledby="reset-confirm" className="card" style={{ marginTop: 12, background: 'var(--bg-soft)' }}>
            <p id="reset-confirm" style={{ margin: '0 0 12px' }}>
              Reset all demo data to seed values?
            </p>
            <div className="flex gap-8">
              <button type="button" className="btn btn-danger" onClick={handleReset}>Yes, reset</button>
              <button type="button" className="btn btn-outline" onClick={() => setConfirmReset(false)}>Cancel</button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function Field({ name, label, defaultValue, required, autoComplete, type = 'text' }) {
  const id = useId();
  return (
    <div className="form-row">
      <label htmlFor={id} className={required ? 'required-mark' : undefined}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        autoComplete={autoComplete}
      />
    </div>
  );
}

function NotifCheckbox({ name, defaultChecked, label, hint }) {
  const id = useId();
  const hintId = useId();
  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontWeight: 500, cursor: 'pointer' }}>
        <input id={id} name={name} type="checkbox" defaultChecked={defaultChecked} aria-describedby={hint ? hintId : undefined} />
        <span>
          {label}
          {hint && <span id={hintId} className="muted" style={{ display: 'block', fontSize: 12, fontWeight: 400 }}>{hint}</span>}
        </span>
      </label>
    </div>
  );
}
