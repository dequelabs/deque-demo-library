import { useState, useId, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore, actions } from './store.jsx';
import { fmtMoney, todayISO } from './format.js';

export default function FintechTransfer() {
  const { state, dispatch } = useStore();
  const [searchParams] = useSearchParams();

  const initialFrom = searchParams.get('from') || state.accounts[0]?.id;
  const initialTo = state.accounts.find((a) => a.id !== initialFrom)?.id;

  const [step, setStep] = useState(1); // 1 = enter, 2 = review, 3 = success
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [when, setWhen] = useState('now');
  const [errors, setErrors] = useState({});
  const successHeadingRef = useRef(null);

  const fromAcc = state.accounts.find((a) => a.id === from);
  const toAcc   = state.accounts.find((a) => a.id === to);

  // After a successful transfer, focus the success heading for AT users.
  useEffect(() => {
    if (step === 3 && successHeadingRef.current) {
      successHeadingRef.current.focus();
    }
  }, [step]);

  const validate = () => {
    const e = {};
    const num = Number(amount);
    if (!amount || isNaN(num) || num <= 0) {
      e.amount = 'Enter a valid amount greater than $0.';
    } else if (num > fromAcc.balance) {
      e.amount = `That's more than the available balance (${fmtMoney(fromAcc.balance)}).`;
    } else if (num > 25000) {
      e.amount = 'Exceeds the $25,000 daily transfer limit.';
    }
    if (from === to) {
      e.to = 'Source and destination must be different accounts.';
    }
    return e;
  };

  const onContinue = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStep(2);
    }
  };

  const onConfirm = () => {
    dispatch(actions.transfer(from, to, Number(amount), memo));
    setStep(3);
  };

  const onAnother = () => {
    setStep(1);
    setAmount('');
    setMemo('');
    setErrors({});
    setWhen('now');
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Transfer money</h1>
          <p className="subtitle">
            <Link to="/fintech/dashboard">← Back to accounts</Link>
          </p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        {step === 1 && (
          <Step1
            state={state}
            from={from} setFrom={setFrom}
            to={to} setTo={setTo}
            amount={amount} setAmount={setAmount}
            memo={memo} setMemo={setMemo}
            when={when} setWhen={setWhen}
            errors={errors}
            onContinue={onContinue}
          />
        )}
        {step === 2 && (
          <Step2
            fromAcc={fromAcc} toAcc={toAcc} amount={amount} memo={memo} when={when}
            onConfirm={onConfirm} onEdit={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step3
            ref={successHeadingRef}
            fromAcc={state.accounts.find((a) => a.id === from)}
            toAcc={state.accounts.find((a) => a.id === to)}
            amount={amount}
            when={when}
            onAnother={onAnother}
          />
        )}
      </div>
    </>
  );
}

/* ---------- Step 1 ---------- */
function Step1({ state, from, setFrom, to, setTo, amount, setAmount, memo, setMemo, when, setWhen, errors, onContinue }) {
  const fromId = useId();
  const toId = useId();
  const amountId = useId();
  const whenId = useId();
  const memoId = useId();
  const amountErrId = useId();
  const toErrId = useId();
  const helpId = useId();

  return (
    <>
      <h2 style={{ margin: '0 0 8px' }}>Enter transfer details</h2>
      <p className="muted" style={{ margin: '0 0 24px' }}>
        Move funds between your DQBC accounts.
      </p>

      <form onSubmit={onContinue} noValidate>
        <div className="form-row">
          <label htmlFor={fromId} className="required-mark">From account</label>
          <select id={fromId} value={from} onChange={(e) => setFrom(e.target.value)} required>
            {state.accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ··{a.last4} — {fmtMoney(a.balance)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor={toId} className="required-mark">To account</label>
          <select
            id={toId}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-invalid={!!errors.to}
            aria-describedby={errors.to ? toErrId : undefined}
            required
          >
            {state.accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ··{a.last4} — {fmtMoney(a.balance)}
              </option>
            ))}
          </select>
          {errors.to && <p id={toErrId} className="form-error" role="alert"><strong>Error:</strong> {errors.to}</p>}
        </div>

        <div className="form-row">
          <label htmlFor={amountId} className="required-mark">Amount</label>
          <input
            id={amountId}
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            aria-invalid={!!errors.amount}
            aria-describedby={`${helpId}${errors.amount ? ' ' + amountErrId : ''}`}
            required
          />
          <p id={helpId} className="form-help">Daily transfer limit: $25,000.</p>
          {errors.amount && <p id={amountErrId} className="form-error" role="alert"><strong>Error:</strong> {errors.amount}</p>}
        </div>

        <div className="form-row">
          <label htmlFor={whenId}>When</label>
          <select id={whenId} value={when} onChange={(e) => setWhen(e.target.value)}>
            <option value="now">Now (instant)</option>
            <option value="tomorrow">Next business day</option>
            <option value="recurring">Set up recurring</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor={memoId}>Memo (optional)</label>
          <textarea
            id={memoId}
            rows={3}
            placeholder="e.g. Boost emergency fund"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>

        <div className="flex gap-8 mt-24">
          <button type="submit" className="btn btn-primary">Continue</button>
          <Link className="btn btn-outline" to="/fintech/dashboard">Cancel</Link>
        </div>
      </form>
    </>
  );
}

/* ---------- Step 2 ---------- */
function Step2({ fromAcc, toAcc, amount, memo, when, onConfirm, onEdit }) {
  return (
    <>
      <h2 style={{ margin: '0 0 8px' }}>Review &amp; confirm</h2>
      <p className="muted" style={{ margin: '0 0 24px' }}>Please confirm the details below.</p>

      <dl style={{ margin: 0 }}>
        <Review label="From">{fromAcc.name} ··{fromAcc.last4}</Review>
        <Review label="To">{toAcc.name} ··{toAcc.last4}</Review>
        <Review label="Amount">{fmtMoney(Number(amount))}</Review>
        <Review label="When">
          {when === 'now' ? 'Now (instant)' :
           when === 'tomorrow' ? 'Next business day' : 'Recurring'}
        </Review>
        {memo && <Review label="Memo">{memo}</Review>}
      </dl>

      <div className="flex gap-8 mt-24">
        <button className="btn btn-primary" onClick={onConfirm}>Confirm transfer</button>
        <button className="btn btn-outline" onClick={onEdit}>Edit details</button>
      </div>
    </>
  );
}

function Review({ label, children }) {
  return (
    <div className="review-row">
      <dt className="muted">{label}</dt>
      <dd style={{ margin: 0, fontWeight: 600 }}>{children}</dd>
    </div>
  );
}

/* ---------- Step 3 ---------- */
import { forwardRef } from 'react';
const Step3 = forwardRef(function Step3({ fromAcc, toAcc, amount, when, onAnother }, ref) {
  return (
    <div role="status" aria-live="polite">
      <h2 ref={ref} tabIndex={-1} style={{ margin: '0 0 8px', color: 'var(--success)' }}>
        Transfer {when === 'now' ? 'completed' : 'scheduled'}
      </h2>
      <p className="muted" style={{ margin: '0 0 24px' }}>
        {when === 'now'
          ? `${fmtMoney(Number(amount))} has been moved from ${fromAcc.name} to ${toAcc.name}.`
          : 'Your transfer is queued and will be sent on the next business day.'}
      </p>

      <div className="card" style={{ marginBottom: 24, background: 'var(--bg-soft)' }}>
        <Review label={`${fromAcc.name} new balance`}>{fmtMoney(fromAcc.balance)}</Review>
        <Review label={`${toAcc.name} new balance`}>{fmtMoney(toAcc.balance)}</Review>
        <Review label="Reference">TRF-{Date.now().toString(36).toUpperCase()}</Review>
        <Review label="Date"><time dateTime={todayISO()}>{todayISO()}</time></Review>
      </div>

      <div className="flex gap-8">
        <Link className="btn btn-primary" to="/fintech/dashboard">Back to dashboard</Link>
        <button className="btn btn-outline" onClick={onAnother}>Make another transfer</button>
      </div>
    </div>
  );
});
