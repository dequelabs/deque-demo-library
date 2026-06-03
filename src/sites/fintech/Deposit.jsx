import { useState, useId, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore, actions } from './store.jsx';
import { fmtMoney, todayISO } from './format.js';

export default function FintechDeposit() {
  const { state, dispatch } = useStore();

  const [step, setStep] = useState(1);
  const [accountId, setAccountId] = useState(state.accounts[0]?.id);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [errors, setErrors] = useState({});
  const successRef = useRef(null);

  useEffect(() => {
    if (step === 3 && successRef.current) successRef.current.focus();
  }, [step]);

  const validate = () => {
    const e = {};
    const num = Number(amount);
    if (!amount || isNaN(num) || num <= 0) {
      e.amount = 'Enter a valid deposit amount.';
    } else if (num > 5000) {
      e.amount = 'Mobile deposits over $5,000 must be made at a branch.';
    }
    if (!frontFile) e.front = 'Upload a photo of the check front.';
    if (!backFile)  e.back  = 'Upload a photo of the check back.';
    return e;
  };

  const onContinue = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep(2);
  };

  const onConfirm = () => {
    dispatch(actions.depositCheck(accountId, Number(amount), memo));
    setStep(3);
  };

  const onAnother = () => {
    setStep(1);
    setAmount('');
    setMemo('');
    setFrontFile(null);
    setBackFile(null);
    setErrors({});
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Mobile deposit</h1>
          <p className="subtitle">Snap a photo of the front and back of your check.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        {step === 1 && (
          <DepositStep1
            state={state}
            accountId={accountId} setAccountId={setAccountId}
            amount={amount} setAmount={setAmount}
            memo={memo} setMemo={setMemo}
            frontFile={frontFile} setFrontFile={setFrontFile}
            backFile={backFile}  setBackFile={setBackFile}
            errors={errors}
            onContinue={onContinue}
          />
        )}
        {step === 2 && (
          <DepositStep2
            account={state.accounts.find((a) => a.id === accountId)}
            amount={amount}
            memo={memo}
            frontFile={frontFile}
            backFile={backFile}
            onEdit={() => setStep(1)}
            onConfirm={onConfirm}
          />
        )}
        {step === 3 && (
          <DepositStep3
            ref={successRef}
            account={state.accounts.find((a) => a.id === accountId)}
            amount={amount}
            onAnother={onAnother}
          />
        )}
      </div>
    </>
  );
}

function DepositStep1({ state, accountId, setAccountId, amount, setAmount, memo, setMemo, frontFile, setFrontFile, backFile, setBackFile, errors, onContinue }) {
  const acctId = useId();
  const amtId = useId();
  const memoId = useId();
  const frontId = useId();
  const backId = useId();
  const amtErrId = useId();
  const frontErrId = useId();
  const backErrId = useId();

  return (
    <>
      <h2 style={{ margin: '0 0 8px' }}>Deposit details</h2>
      <p className="muted" style={{ margin: '0 0 24px' }}>
        Funds are typically available the next business day.{' '}
        {/* PHASE-2 a11y issue MT-077 — see ACCESSIBILITY_ISSUES.md
            <span lang="frzz"> wraps a banking term with an invalid
            BCP 47 language tag. axe-core `valid-lang` fires Serious
            (WCAG 3.1.2). */}
        <span lang="frzz">Reçu</span>: review carefully.
      </p>

      {/* PHASE-2 a11y issue MT-078 — see ACCESSIBILITY_ISSUES.md
          Hint banner with light text on a near-white gold gradient.
          axe-core color-contrast goes Needs Review (gradient bg); Pro
          Advanced `text-contrast` analyses the rendered pixels and
          reports Serious (WCAG 1.4.3). */}
      <div
        style={{
          background: 'linear-gradient(90deg, #fff 0%, #f5e9c4 100%)',
          color: '#e8c267',
          padding: '8px 14px',
          borderRadius: 6,
          marginBottom: 16,
          fontSize: 14,
        }}
      >
        Capture both sides of the check in good lighting for fastest review.
      </div>

      {/* PHASE-2 a11y issue MT-076 — see ACCESSIBILITY_ISSUES.md
          <div role="meter"> for "Daily deposit limit" with valuenow/
          min/max but no accessible name. axe-core `aria-meter-name`
          fires Critical (WCAG 1.1.1). */}
      <div
        role="meter"
        aria-valuenow={1200}
        aria-valuemin={0}
        aria-valuemax={5000}
        style={{ padding: 12, background: 'var(--bg-soft)', borderRadius: 6, marginBottom: 16 }}
      >
        <div style={{ fontSize: 13, marginBottom: 6 }}>Daily deposit limit used: $1,200 / $5,000</div>
        <div style={{ height: 6, background: '#e3e8ef', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '24%', height: '100%', background: 'var(--brand-primary)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        {/* PHASE-2 a11y issue MT-073 — see ACCESSIBILITY_ISSUES.md
            <input type="image"> with no alt attribute. axe-core
            `input-image-alt` fires Critical (WCAG 1.1.1) — image
            inputs are buttons and need accessible names. */}
        <input
          type="image"
          src="/check-success.svg"
          style={{ width: 64, height: 64, cursor: 'pointer' }}
          onClick={(e) => e.preventDefault()}
        />

        {/* PHASE-2 a11y issue MT-075 — see ACCESSIBILITY_ISSUES.md
            <button role="switch"> with aria-checked but NO accessible
            name. axe-core `aria-toggle-field-name` fires Serious
            (WCAG 4.1.2). */}
        <button
          role="switch"
          aria-checked="false"
          style={{ width: 44, height: 24, border: '1px solid var(--border)', borderRadius: 12, background: '#fff', cursor: 'pointer' }}
          onClick={(e) => e.preventDefault()}
        />

        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Auto-deposit recurring checks</span>
      </div>

      {/* PHASE-2 a11y issue MT-074 — see ACCESSIBILITY_ISSUES.md
          <div role="radiogroup"> with <div> children (no role="radio").
          axe-core `aria-required-children` fires Critical (WCAG 1.3.1). */}
      <div role="radiogroup" aria-label="Deposit type" style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 13 }}>Personal check</div>
        <div style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 13 }}>Cashier's check</div>
        <div style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 13 }}>Money order</div>
      </div>

      <form onSubmit={onContinue} noValidate>
        <div className="form-row">
          <label htmlFor={acctId} className="required-mark">Deposit to</label>
          <select id={acctId} value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
            {state.accounts.filter((a) => a.type !== 'brokerage').map((a) => (
              <option key={a.id} value={a.id}>{a.name} ··{a.last4}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor={amtId} className="required-mark">Amount</label>
          <input
            id={amtId}
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? amtErrId : undefined}
            required
          />
          {errors.amount && <p id={amtErrId} className="form-error" role="alert"><strong>Error:</strong> {errors.amount}</p>}
        </div>

        <div className="form-row">
          <label htmlFor={memoId}>Memo (optional)</label>
          <input id={memoId} type="text" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="e.g. Birthday check" />
        </div>

        <fieldset style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginTop: 8 }}>
          <legend style={{ fontSize: 13, fontWeight: 600, padding: '0 8px' }}>Check images</legend>

          <div className="form-row">
            <label htmlFor={frontId} className="required-mark">Front of check</label>
            <input
              id={frontId}
              type="file"
              accept="image/*"
              onChange={(e) => setFrontFile(e.target.files[0] || null)}
              aria-invalid={!!errors.front}
              aria-describedby={errors.front ? frontErrId : undefined}
            />
            {frontFile && <p className="form-help">Selected: {frontFile.name}</p>}
            {errors.front && <p id={frontErrId} className="form-error" role="alert"><strong>Error:</strong> {errors.front}</p>}
          </div>

          <div className="form-row" style={{ marginBottom: 0 }}>
            <label htmlFor={backId} className="required-mark">Back of check</label>
            <input
              id={backId}
              type="file"
              accept="image/*"
              onChange={(e) => setBackFile(e.target.files[0] || null)}
              aria-invalid={!!errors.back}
              aria-describedby={errors.back ? backErrId : undefined}
            />
            {backFile && <p className="form-help">Selected: {backFile.name}</p>}
            {errors.back && <p id={backErrId} className="form-error" role="alert"><strong>Error:</strong> {errors.back}</p>}
          </div>
        </fieldset>

        {/* PHASE-2 a11y issue MT-018 — see ACCESSIBILITY_ISSUES.md
            Pivoted from `nested-interactive` (which axe-core 4.10 does NOT fire on
            a <button> inside an <a href>; the browser's accessibility tree
            collapses it) to `aria-hidden-focus` (Serious, WCAG 4.1.2). A wrapper
            <span aria-hidden="true"> contains a focusable <button>, hiding it
            from AT while it remains in the keyboard tab order — a classic
            "developer hid this with aria-hidden to suppress an announcement"
            pattern. Reliably fires on first page load. */}
        <div className="flex gap-8 mt-24">
          <button type="submit" className="btn btn-primary">Review</button>
          <Link className="btn btn-outline" to="/fintech/dashboard">Cancel</Link>
          <span aria-hidden="true">
            <button
              type="button"
              className="btn-link"
              onClick={(e) => { e.preventDefault(); }}
            >
              Clear form
            </button>
          </span>
        </div>
      </form>
    </>
  );
}

function DepositStep2({ account, amount, memo, frontFile, backFile, onEdit, onConfirm }) {
  return (
    <>
      <h2 style={{ margin: '0 0 8px' }}>Confirm deposit</h2>
      <p className="muted" style={{ margin: '0 0 24px' }}>Please review before submitting.</p>

      <dl style={{ margin: 0 }}>
        <Row label="Deposit to">{account.name} ··{account.last4}</Row>
        <Row label="Amount">{fmtMoney(Number(amount))}</Row>
        {memo && <Row label="Memo">{memo}</Row>}
        <Row label="Front image">{frontFile?.name}</Row>
        <Row label="Back image">{backFile?.name}</Row>
      </dl>

      <div className="flex gap-8 mt-24">
        <button className="btn btn-primary" onClick={onConfirm}>Submit deposit</button>
        <button className="btn btn-outline" onClick={onEdit}>Edit details</button>
      </div>
    </>
  );
}

import { forwardRef } from 'react';
const DepositStep3 = forwardRef(function DepositStep3({ account, amount, onAnother }, ref) {
  return (
    <div role="status" aria-live="polite">
      <h2 ref={ref} tabIndex={-1} style={{ margin: '0 0 8px', color: 'var(--success)' }}>
        Deposit submitted
      </h2>
      <p className="muted" style={{ margin: '0 0 24px' }}>
        {fmtMoney(Number(amount))} will post to {account.name} on the next business day.
      </p>

      <div className="card" style={{ marginBottom: 24, background: 'var(--bg-soft)' }}>
        <Row label={`${account.name} new pending balance`}>{fmtMoney(account.balance)}</Row>
        <Row label="Reference">DEP-{Date.now().toString(36).toUpperCase()}</Row>
        <Row label="Date"><time dateTime={todayISO()}>{todayISO()}</time></Row>
      </div>

      <div className="flex gap-8">
        {/* MT-018 was previously demonstrated here (nested <button> inside the
            "Back to dashboard" <Link>), but Step 3 isn't reachable on a fresh
            axe scan. The nested-interactive pair has been moved to the Step 1
            "Cancel" Link so it fires on first page load. */}
        <Link className="btn btn-primary" to="/fintech/dashboard">
          Back to dashboard
        </Link>
        <button
          type="button"
          className="btn btn-outline"
          onClick={onAnother}
        >
          Make another deposit
        </button>
      </div>
    </div>
  );
});

function Row({ label, children }) {
  return (
    <div className="review-row">
      <dt className="muted">{label}</dt>
      <dd style={{ margin: 0, fontWeight: 600 }}>{children}</dd>
    </div>
  );
}
