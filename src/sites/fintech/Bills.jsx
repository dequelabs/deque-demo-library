import { useState, useId, useRef, useEffect } from 'react';
import { useStore, actions } from './store.jsx';
import { fmtMoney, fmtDateFull, todayISO } from './format.js';

export default function FintechBills() {
  const { state, dispatch } = useStore();
  const [confirmation, setConfirmation] = useState(null);
  const [showAddPayee, setShowAddPayee] = useState(false);
  const [removeId, setRemoveId] = useState(null);

  const payBillForm = useRef(null);

  const onPay = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payeeId = fd.get('payee');
    const fromAccountId = fd.get('account');
    const amount = Number(fd.get('amount'));
    const scheduleISO = fd.get('schedule');
    const memo = fd.get('memo');
    if (!payeeId || !fromAccountId || !amount || amount <= 0) return;
    dispatch(actions.payBill(payeeId, fromAccountId, amount, scheduleISO, memo));
    const payee = state.payees.find((p) => p.id === payeeId);
    setConfirmation({
      payeeName: payee ? payee.name : 'Payee',
      amount,
      scheduleISO,
      immediate: !scheduleISO || scheduleISO <= todayISO(),
    });
    e.target.reset();
  };

  const onAddPayee = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = String(fd.get('name') || '').trim();
    const accountNumber = String(fd.get('accountNumber') || '').trim();
    const category = String(fd.get('category') || '').trim();
    if (!name || !accountNumber) return;
    dispatch(actions.addPayee(name, accountNumber, category));
    setShowAddPayee(false);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Pay bills</h1>
          <p className="subtitle">Schedule one-time or recurring payments to your saved payees.</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn-outline" onClick={() => setShowAddPayee(true)}>
            Add payee
          </button>
        </div>
      </div>

      {confirmation && (
        <div role="status" aria-live="polite" className="card" style={{ marginBottom: 24, borderLeft: '4px solid var(--success)' }}>
          <strong style={{ color: 'var(--success)' }}>
            {confirmation.immediate ? 'Payment sent' : 'Payment scheduled'}
          </strong>
          <p style={{ margin: '4px 0 0' }}>
            {fmtMoney(confirmation.amount)} to {confirmation.payeeName}
            {confirmation.immediate ? '.' : ` on ${fmtDateFull(confirmation.scheduleISO)}.`}
          </p>
        </div>
      )}

      {/* Pay a bill */}
      <section aria-labelledby="paybill-heading" className="card" style={{ marginBottom: 24 }}>
        <h2 id="paybill-heading" style={{ margin: '0 0 16px' }}>Make a payment</h2>
        <form onSubmit={onPay} ref={payBillForm}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <PayeeField payees={state.payees} />
            <AccountField accounts={state.accounts} />
            <AmountField />
            <ScheduleField />
          </div>
          <MemoField />
          <button type="submit" className="btn btn-primary mt-16">Pay bill</button>
        </form>
      </section>

      {/* Saved payees */}
      <section aria-labelledby="payees-heading">
        <div className="card-head">
          <h2 id="payees-heading">Saved payees</h2>
          <span className="muted">{state.payees.length} {state.payees.length === 1 ? 'payee' : 'payees'}</span>
        </div>
        {state.payees.length === 0 ? (
          <div className="empty-state card">
            No payees yet. <button className="btn-link" onClick={() => setShowAddPayee(true)}>Add your first payee</button>.
          </div>
        ) : (
          <ul className="payee-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {state.payees.map((p) => (
              <li key={p.id} className="payee-row">
                <div className="payee-meta">
                  <span className="name">{p.name}</span>
                  <span className="acct">{p.accountNumber} · {p.category}</span>
                </div>
                <button
                  type="button"
                  className="btn-link"
                  style={{ color: 'var(--danger)' }}
                  onClick={() => setRemoveId(p.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Scheduled */}
      {state.scheduledPayments.length > 0 && (
        <section aria-labelledby="scheduled-heading" style={{ marginTop: 32 }}>
          <h2 id="scheduled-heading" style={{ fontSize: 18, color: 'var(--brand-deep)', margin: '0 0 12px' }}>
            Scheduled payments
          </h2>
          <table className="data-table">
            <caption style={{ position: 'absolute', left: -9999 }}>Upcoming scheduled payments</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Payee</th>
                <th scope="col">From</th>
                <th scope="col" style={{ textAlign: 'right' }}>Amount</th>
                <th scope="col"><span style={{ position: 'absolute', left: -9999 }}>Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {state.scheduledPayments.map((sp) => {
                const payee = state.payees.find((p) => p.id === sp.payeeId);
                const acct = state.accounts.find((a) => a.id === sp.fromAccountId);
                return (
                  <tr key={sp.id}>
                    <td><time dateTime={sp.scheduleISO}>{fmtDateFull(sp.scheduleISO)}</time></td>
                    <td>{payee ? payee.name : '—'}</td>
                    <td>{acct ? acct.name : '—'}</td>
                    <td style={{ textAlign: 'right' }}>{fmtMoney(sp.amount)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => dispatch(actions.cancelScheduled(sp.id))}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {showAddPayee && (
        <Dialog title="Add a payee" onClose={() => setShowAddPayee(false)}>
          <form onSubmit={onAddPayee}>
            <div className="form-row">
              <label htmlFor="np-name" className="required-mark">Payee name</label>
              <input id="np-name" name="name" type="text" required />
            </div>
            <div className="form-row">
              <label htmlFor="np-acct" className="required-mark">Account number</label>
              <input id="np-acct" name="accountNumber" type="text" required />
            </div>
            <div className="form-row">
              <label htmlFor="np-cat">Category</label>
              <select id="np-cat" name="category" defaultValue="Other">
                <option>Utilities</option>
                <option>Telecom</option>
                <option>Insurance</option>
                <option>Mortgage</option>
                <option>Credit card</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex gap-8 mt-16">
              <button type="submit" className="btn btn-primary">Save payee</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowAddPayee(false)}>Cancel</button>
            </div>
          </form>
        </Dialog>
      )}

      {removeId && (
        <Dialog title="Remove payee?" onClose={() => setRemoveId(null)}>
          <p>This will remove the payee from your saved list. Scheduled payments to them will not be cancelled automatically.</p>
          <div className="flex gap-8 mt-16">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => { dispatch(actions.removePayee(removeId)); setRemoveId(null); }}
            >
              Remove payee
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setRemoveId(null)}>Cancel</button>
          </div>
        </Dialog>
      )}
    </>
  );
}

/* ---------- Field helpers ---------- */
function PayeeField({ payees }) {
  const id = useId();
  return (
    <div className="form-row">
      <label htmlFor={id} className="required-mark">Payee</label>
      <select id={id} name="payee" required defaultValue="">
        <option value="" disabled>Select a payee…</option>
        {payees.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
}
function AccountField({ accounts }) {
  const id = useId();
  return (
    <div className="form-row">
      <label htmlFor={id} className="required-mark">From account</label>
      <select id={id} name="account" required defaultValue={accounts[0]?.id}>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>{a.name} ··{a.last4}</option>
        ))}
      </select>
    </div>
  );
}
function AmountField() {
  const id = useId();
  return (
    <div className="form-row">
      <label htmlFor={id} className="required-mark">Amount</label>
      <input id={id} name="amount" type="number" min="0.01" step="0.01" required />
    </div>
  );
}
function ScheduleField() {
  const id = useId();
  return (
    <div className="form-row">
      <label htmlFor={id}>Send on</label>
      <input id={id} name="schedule" type="date" defaultValue={todayISO()} min={todayISO()} />
    </div>
  );
}
function MemoField() {
  const id = useId();
  return (
    <div className="form-row">
      <label htmlFor={id}>Memo (optional)</label>
      <input id={id} name="memo" type="text" placeholder="e.g. Account 9012, May" />
    </div>
  );
}

/* ---------- Accessible dialog ---------- */
function Dialog({ title, onClose, children }) {
  const titleId = useId();
  const ref = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    if (ref.current) {
      const focusable = ref.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusable || ref.current).focus();
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') trapFocus(e, ref.current);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (previouslyFocused.current && previouslyFocused.current.focus) {
        previouslyFocused.current.focus();
      }
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop is-open"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="modal"
      >
        <div className="card-head">
          <h2 id={titleId} style={{ fontSize: 20 }}>{title}</h2>
          <button type="button" className="icon-btn" aria-label="Close dialog" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function trapFocus(e, root) {
  if (!root) return;
  const focusable = Array.from(
    root.querySelectorAll('button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])')
  ).filter((el) => !el.disabled && el.offsetParent !== null);
  if (focusable.length === 0) {
    e.preventDefault();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
