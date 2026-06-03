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

      {/* PHASE-2 a11y issue MT-044 — see ACCESSIBILITY_ISSUES.md
          <div role="meter"> for "Profile completeness" with valuemin/max/now
          set but NO accessible name. axe-core `aria-meter-name` fires
          Critical (WCAG 1.1.1). */}
      <div
        role="meter"
        aria-valuenow={60}
        aria-valuemin={0}
        aria-valuemax={100}
        className="card"
        style={{ marginBottom: 24, padding: 16 }}
      >
        <div style={{ fontSize: 14, marginBottom: 8 }}>Profile completeness: 60%</div>
        <div style={{ height: 6, background: '#e3e8ef', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '60%', height: '100%', background: 'var(--brand-primary)' }} />
        </div>
      </div>

      {/* PHASE-2 a11y issue MT-048 — see ACCESSIBILITY_ISSUES.md
          "Security preferences" reads as a section heading (22 px, bold,
          dark navy, top margin) but is rendered as a <div> not h3. Pro
          Advanced `heading-markup` AI/CV rule fires Serious (WCAG 1.3.1). */}
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--brand-deep)', margin: '8px 0 8px' }}>
        Security preferences
      </div>
      {/* PHASE-2 a11y issue MT-045 — see ACCESSIBILITY_ISSUES.md
          <button role="switch"> with aria-checked but NO accessible name
          (no text content, no aria-label). axe-core
          `aria-toggle-field-name` fires Serious (WCAG 4.1.2). */}
      <button
        role="switch"
        aria-checked="false"
        style={{ width: 44, height: 24, border: '1px solid var(--border)', borderRadius: 12, background: '#fff', marginBottom: 24, cursor: 'pointer' }}
        onClick={(e) => e.preventDefault()}
      />

      {/* PHASE-2 a11y issue MT-046 — see ACCESSIBILITY_ISSUES.md
          <object> with no aria-label and no body fallback text. axe-core
          `object-alt` fires Serious (WCAG 1.1.1). */}
      <object
        data="/branch-photo.svg"
        type="image/svg+xml"
        style={{ display: 'block', width: 120, height: 60, marginBottom: 24 }}
      />

      {/* PHASE-2 a11y issue MT-047 — see ACCESSIBILITY_ISSUES.md
          Pivoted from aria-roledescription (empty-string variant doesn't
          reliably fire — axe-core 4.10 treats empty same as absent).
          Now: aria-orientation="diagonal" on a role="region" element —
          aria-orientation only accepts "horizontal" / "vertical" /
          "undefined". axe-core `aria-valid-attr-value` fires Critical
          (WCAG 4.1.2). */}
      <section
        role="region"
        aria-label="Verified identity"
        aria-orientation="diagonal"
        style={{ marginBottom: 24, padding: 12, background: 'var(--bg-soft)', borderRadius: 6, fontSize: 13 }}
      >
        Identity verified · Last reviewed: today
      </section>

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

          {/* PHASE-2 a11y issue MT-043 — see ACCESSIBILITY_ISSUES.md
              "Display name" input has TWO <label htmlFor="display-name">
              elements pointing at the same input. axe-core
              `form-field-multiple-labels` fires Moderate (WCAG 3.3.2):
              form fields shouldn't have more than one label, since AT
              behaviour with multiple labels is inconsistent. */}
          <div className="form-row" style={{ marginTop: 12 }}>
            <label htmlFor="display-name">Display name</label>
            <label htmlFor="display-name">Preferred name (shown on statements)</label>
            <input
              id="display-name"
              name="displayName"
              type="text"
              defaultValue={u.firstName}
            />
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
            {/* PHASE-2 a11y issue MT-005 — see ACCESSIBILITY_ISSUES.md
                Was: autoComplete="postal-code" (valid HTML autofill token).
                Changed to autoComplete="zip" which is NOT in the WHATWG autofill
                token list, so axe-core `autocomplete-valid` (Serious, WCAG 1.3.5) fires. */}
            <Field name="zip"   label="ZIP"        defaultValue={u.address.zip}   autoComplete="zip" />
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

      {/* Account disclosures */}
      <section aria-labelledby="disclosures-heading" className="card" style={{ marginBottom: 24 }}>
        <h2 id="disclosures-heading" style={{ margin: '0 0 12px' }}>Account disclosures</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 12 }}>
          The agreements below govern your DQBC checking, savings, and brokerage
          accounts. Use the scrollbar to review the full text.
        </p>
        {/* PHASE-2 a11y issue MT-003 — see ACCESSIBILITY_ISSUES.md
            This box has `overflow-y: auto` with content that overflows, NO focusable
            descendants (plain <p> text only) and NO `tabIndex={0}` on the container.
            Keyboard users cannot reach or scroll it. Triggers axe-core
            `scrollable-region-focusable` (Serious, WCAG 2.1.1). The accessible
            fix is `tabIndex={0}` and `role="region"` + an accessible name. */}
        <div
          aria-labelledby="disclosures-heading"
          style={{
            maxHeight: 180,
            overflowY: 'auto',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '12px 16px',
            background: '#fff',
            fontSize: 13,
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}
        >
          <p style={{ marginTop: 0 }}>
            <strong>Deposit Account Agreement.</strong> By maintaining a DQBC
            deposit account, you agree to the terms set forth in the Deposit
            Account Agreement, the Schedule of Fees, and the Funds Availability
            Policy. DQBC reserves the right to amend these terms upon thirty
            (30) days written notice delivered electronically to the address of
            record. Continued use of the account after the effective date of
            any amendment constitutes acceptance of the revised terms.
          </p>
          <p>
            <strong>Electronic Fund Transfer Disclosure.</strong> Federal
            Regulation E governs electronic transfers to and from your account,
            including ACH, debit card, and bill-pay transactions. You have the
            right to receive documentation of every electronic transfer, to
            stop preauthorized payments, and to dispute unauthorized transfers
            within sixty (60) days of the statement on which the transfer
            appears.
          </p>
          <p>
            <strong>Privacy Policy Summary.</strong> DQBC collects, uses, and
            shares your personal financial information as described in our
            Privacy Notice. You may limit certain sharing for marketing
            purposes by contacting our customer service line. We do not sell
            personal information to third parties for monetary consideration.
          </p>
          <p style={{ marginBottom: 0 }}>
            <strong>FDIC Insurance.</strong> Deposits at DQBC are insured by
            the Federal Deposit Insurance Corporation up to the standard
            maximum deposit insurance amount of $250,000 per depositor, per
            insured bank, for each ownership category.
          </p>
        </div>
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
