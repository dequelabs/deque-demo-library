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

      {/* PHASE-2 a11y issue MT-060 — see ACCESSIBILITY_ISSUES.md
          Pivoted from advanced/css-focus-visible (already covered globally
          on .icon-btn by MT-010) to Pro Advanced `text-contrast`. Light
          gold text on a near-white gradient — axe-core color-contrast
          goes Needs Review (gradient bg), Pro fires Serious (WCAG 1.4.3). */}
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
        Save $25 when you set up 3+ recurring bill payments this month.
      </div>

      {/* PHASE-2 a11y issue MT-056 — see ACCESSIBILITY_ISSUES.md
          <div role="tablist"> whose children are plain <div>s (no
          role="tab"). axe-core `aria-required-children` fires Critical
          (WCAG 1.3.1): tablist must own at least one role="tab". */}
      <div role="tablist" aria-label="Bill category" style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <div style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 14 }}>All</div>
        <div style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 14 }}>Utilities</div>
        <div style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 14 }}>Telecom</div>
        <div style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 14 }}>Insurance</div>
      </div>

      {/* PHASE-2 a11y issue MT-057 — see ACCESSIBILITY_ISSUES.md
          Stray <dd> outside any <dl>. axe-core `dlitem` fires Serious
          (WCAG 1.3.1). */}
      <dd style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 16px' }}>
        Most recent payment: ComEd — $98.00 — yesterday
      </dd>

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
          /* PHASE-2 a11y issue MT-013 — see ACCESSIBILITY_ISSUES.md
              Was: <ul className="payee-list"> ... <li className="payee-row"> ... </li> </ul>
              Now: keep the <ul> wrapper, but each row is a <div> instead of an <li>.
              axe-core's `list` rule fires when a <ul>/<ol> contains non-<li> direct
              children (Serious, WCAG 1.3.1). The `.payee-list` / `.payee-row` styling
              still applies; only the implicit role="listitem" on each row is lost. */
          <ul className="payee-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {state.payees.map((p) => (
              <div key={p.id} className="payee-row">
                <div className="payee-meta">
                  <span className="name">
                    {p.name}{' '}
                    {/* PHASE-2 a11y issue MT-059 — see ACCESSIBILITY_ISSUES.md
                        <span lang="xx-bills"> wraps the payee category with
                        an invalid BCP 47 language tag. axe-core
                        `valid-lang` fires Serious (WCAG 3.1.2). */}
                    <span lang="xx-bills" style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 4 }}>
                      ({p.category})
                    </span>
                  </span>
                  <span className="acct">{p.accountNumber} · {p.category}</span>
                </div>
                {/* PHASE-2 a11y issue MT-055 — see ACCESSIBILITY_ISSUES.md
                    Icon-only "Edit payee" <button> with no text, no
                    aria-label, no title. axe-core `button-name` fires
                    Critical (WCAG 4.1.2). */}
                <button
                  type="button"
                  className="icon-btn pay-now-btn"
                  onClick={(e) => e.preventDefault()}
                  style={{ width: 28, height: 28 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4z" />
                  </svg>
                </button>
                {/* PHASE-2 a11y issue MT-058 — see ACCESSIBILITY_ISSUES.md
                    Empty <span role="tooltip">. axe-core
                    `aria-tooltip-name` fires Serious (WCAG 4.1.2). */}
                <span role="tooltip"></span>
                <button
                  type="button"
                  className="btn-link"
                  style={{ color: 'var(--danger)' }}
                  onClick={() => setRemoveId(p.id)}
                >
                  Remove
                </button>
              </div>
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
