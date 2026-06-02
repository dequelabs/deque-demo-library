import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from './store.jsx';
import { useAuth } from './auth.jsx';
import { fmtMoney, fmtSignedMoney, fmtDateShort } from './format.js';

const FILTERS = [
  { id: 'all',          label: 'All' },
  { id: 'deposits',     label: 'Deposits' },
  { id: 'withdrawals',  label: 'Withdrawals' },
  { id: 'transfers',    label: 'Transfers' },
];

export default function FintechDashboard() {
  const { state } = useStore();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  const totalBalance = useMemo(
    () => state.accounts.reduce((sum, a) => sum + a.balance, 0),
    [state.accounts]
  );

  const filteredTx = useMemo(() => {
    const all = [...state.transactions].sort((a, b) =>
      a.dateISO < b.dateISO ? 1 : a.dateISO > b.dateISO ? -1 : 0
    );
    if (filter === 'all')         return all;
    if (filter === 'deposits')    return all.filter((t) => t.amount > 0 && t.category !== 'Transfer');
    if (filter === 'withdrawals') return all.filter((t) => t.amount < 0 && t.category !== 'Transfer');
    if (filter === 'transfers')   return all.filter((t) => t.category === 'Transfer');
    return all;
  }, [state.transactions, filter]);

  const recentTx = filteredTx.slice(0, 8);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Good {greetingPart()}, {user.firstName}</h1>
          {/* PHASE-2 a11y issue MT-002 — see ACCESSIBILITY_ISSUES.md
              Inline color #8a92a3 measures ~3.1:1 on white — passes AA Large but
              fails AA Normal (4.5:1), tripping axe-core `color-contrast`
              (Serious, WCAG 1.4.3). The .subtitle class default is the
              accessible --text-secondary token. */}
          <p className="subtitle" style={{ color: '#8a92a3' }}>Last sign-in: today, 9:42 AM · Chicago, IL</p>
        </div>
        <div className="page-actions">
          <Link className="btn btn-primary" to="/fintech/transfer">Transfer</Link>
          <Link className="btn btn-outline" to="/fintech/deposit">Deposit a check</Link>
        </div>
      </div>

      <section aria-labelledby="balance-heading">
        <h2 id="balance-heading" className="sr-only" style={srOnly}>Total balance</h2>
        <div className="balance-banner">
          <div className="label">Total balance across accounts</div>
          <div className="total">{fmtMoney(totalBalance)}</div>
          <div className="delta">
            + {fmtMoney(312.06)} this month
            {' '}
            {/* PHASE-2 a11y issue MT-032 — see ACCESSIBILITY_ISSUES.md
                A French financial phrase ("Coup d'œil") wrapped in a
                <span lang="frx"> — "frx" is not a valid BCP 47 primary
                language subtag. axe-core `valid-lang` fires Serious
                (WCAG 3.1.2) because lang values must conform to BCP 47. */}
            <span lang="frx" className="muted">· Coup d&apos;œil</span>
          </div>
        </div>
      </section>

      {/* PHASE-2 a11y issue MT-031 — see ACCESSIBILITY_ISSUES.md
          A <ul> wrapper hosting <li role="treeitem"> children. role=treeitem
          requires an ancestor with role="tree" or role="group" — there is
          none here (<ul> has implicit role="list"). axe-core
          `aria-required-parent` fires Critical (WCAG 1.3.1). */}
      <section aria-labelledby="recent-highlights-heading" style={{ marginTop: 24 }}>
        <h2 id="recent-highlights-heading" style={{ fontSize: 16, color: 'var(--brand-deep)', margin: '0 0 8px' }}>
          Recent activity highlights
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li role="treeitem" style={{ padding: '4px 0' }}>Direct deposit posted Friday</li>
          <li role="treeitem" style={{ padding: '4px 0' }}>Smart Savings interest credited</li>
          <li role="treeitem" style={{ padding: '4px 0' }}>Card ending ··4417 used in Chicago, IL</li>
        </ul>
      </section>

      {/* PHASE-2 a11y issue MT-033 — see ACCESSIBILITY_ISSUES.md
          <div role="button"> with aria-required="true". aria-required is
          not allowed on role=button (it's only valid on form-control
          roles like textbox, combobox, listbox, radiogroup…). axe-core
          `aria-allowed-attr` fires Critical (WCAG 4.1.2). */}
      <div
        role="button"
        tabIndex={0}
        aria-required="true"
        style={{ display: 'inline-block', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6, marginTop: 12, cursor: 'pointer' }}
      >
        Acknowledge new statements
      </div>

      {/* PHASE-2 a11y issue MT-034 — see ACCESSIBILITY_ISSUES.md
          "Account at a glance" — a <dl> whose direct children are plain
          <div>s (no <dt>/<dd> pairs inside). axe-core `definition-list`
          fires Serious (WCAG 1.3.1): a <dl> may only directly contain
          <dt>, <dd>, <script>, <template>, or <div> wrappers that hold
          dt/dd pairs. */}
      <section aria-labelledby="glance-heading" style={{ marginTop: 24 }}>
        <h2 id="glance-heading" style={{ fontSize: 16, color: 'var(--brand-deep)', margin: '0 0 8px' }}>
          Account at a glance
        </h2>
        <dl style={{ margin: 0 }}>
          <div>Routing number: 071000013</div>
          <div>Primary checking: ··4417</div>
          <div>Statement cycle: 1st of the month</div>
        </dl>
      </section>

      {/* PHASE-2 a11y issue MT-035 — see ACCESSIBILITY_ISSUES.md
          "Spending snapshot" text styled as a heading (24 px, bold, top
          margin, dark navy) but rendered as a <div>. Different position
          from MT-011 (Home). axe DevTools Pro Advanced `heading-markup`
          runs a CV/AI pass on the screenshot, detects the visual
          heading pattern, and reports Serious (WCAG 1.3.1) in the
          Automatic Issues (advanced) bucket. AI-credit-using rule. */}
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--brand-deep)',
          margin: '28px 0 8px',
        }}
      >
        Spending snapshot
      </div>

      {/* PHASE-2 a11y issue MT-036 — see ACCESSIBILITY_ISSUES.md
          Pivoted from `empty-table-header` (which is Best-Practice tagged
          and doesn't fire on default WCAG-only toggles) to `td-headers-attr`
          (Moderate, WCAG 1.3.1). Each <td> in the trend column declares
          `headers="trend-col"` but the corresponding <th> has id="trend-column"
          — the headers reference doesn't resolve. axe-core fires. */}
      <section aria-labelledby="top-cats-heading" style={{ marginTop: 8 }}>
        <h3 id="top-cats-heading" style={{ fontSize: 14, color: 'var(--brand-deep)', margin: '0 0 8px' }}>
          Top categories this month
        </h3>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col" id="cat-col">Category</th>
              <th scope="col" id="amt-col" style={{ textAlign: 'right' }}>Amount</th>
              <th scope="col" id="trend-column">Trend</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td headers="cat-col">Groceries</td>
              <td headers="amt-col" style={{ textAlign: 'right' }}>{fmtMoney(412.18)}</td>
              <td headers="trend-col">up</td>
            </tr>
            <tr>
              <td headers="cat-col">Dining</td>
              <td headers="amt-col" style={{ textAlign: 'right' }}>{fmtMoney(284.06)}</td>
              <td headers="trend-col">down</td>
            </tr>
            <tr>
              <td headers="cat-col">Transit</td>
              <td headers="amt-col" style={{ textAlign: 'right' }}>{fmtMoney(96.40)}</td>
              <td headers="trend-col">flat</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section aria-labelledby="accounts-heading">
        <h2 id="accounts-heading" style={{ fontSize: 18, color: 'var(--brand-deep)', margin: '8px 0 12px' }}>
          Your accounts
        </h2>
        <div className="account-grid">
          {state.accounts.map((a) => (
            <article key={a.id} className="account-card">
              <span className="label">{a.name} ··{a.last4}</span>
              <span className="balance">{fmtMoney(a.balance)}</span>
              {a.apy > 0 && <span className="muted" style={{ fontSize: 13 }}>{a.apy}% APY</span>}
              <Link to={`/fintech/transfer?from=${a.id}`}>View activity</Link>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="recent-heading">
        <div className="card-head">
          <h2 id="recent-heading">Recent transactions</h2>
          <Link to="/fintech/statements">See all</Link>
        </div>

        <div className="filter-bar" role="group" aria-label="Filter transactions">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className="filter-chip"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {recentTx.length === 0 ? (
          <div className="empty-state card">No transactions match this filter.</div>
        ) : (
          <table className="data-table">
            <caption style={srOnly}>Recent transactions</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Account</th>
                <th scope="col">Merchant</th>
                <th scope="col">Category</th>
                <th scope="col" style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map((tx) => {
                const acct = state.accounts.find((a) => a.id === tx.accountId);
                return (
                  <tr key={tx.id}>
                    <td>
                      <time dateTime={tx.dateISO}>{fmtDateShort(tx.dateISO)}</time>
                    </td>
                    <td>{acct ? acct.name : '—'}</td>
                    <td>{tx.merchant}</td>
                    <td>{tx.category}</td>
                    <td style={{ textAlign: 'right' }} className={tx.amount < 0 ? 'amount-neg' : 'amount-pos'}>
                      {fmtSignedMoney(tx.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section aria-labelledby="spending-heading" style={{ marginTop: 32 }}>
        <h2 id="spending-heading" style={{ fontSize: 18, color: 'var(--brand-deep)', margin: '0 0 12px' }}>
          Spending this month
        </h2>
        <div className="card">
          <SpendingBreakdown transactions={state.transactions} />
        </div>
      </section>
    </>
  );
}

function greetingPart() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

const srOnly = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
};

function SpendingBreakdown({ transactions }) {
  const data = useMemo(() => {
    const out = {};
    transactions
      .filter((t) => t.amount < 0 && t.category !== 'Transfer')
      .forEach((t) => {
        out[t.category] = (out[t.category] || 0) + Math.abs(t.amount);
      });
    return Object.entries(out)
      .map(([cat, amt]) => ({ cat, amt }))
      .sort((a, b) => b.amt - a.amt);
  }, [transactions]);

  const total = data.reduce((s, d) => s + d.amt, 0);
  const colors = ['#1a73e8', '#1a7a4d', '#b07b00', '#b3261e', '#6b7280'];

  if (total === 0) {
    return <p className="muted">No spending this period.</p>;
  }

  return (
    <>
      <div
        role="img"
        aria-label={`Spending by category. Total ${fmtMoney(total)}. ${data.map((d) => `${d.cat}: ${fmtMoney(d.amt)}`).join(', ')}.`}
        style={{ display: 'flex', height: 14, borderRadius: 7, overflow: 'hidden' }}
      >
        {data.map((d, i) => (
          <div
            key={d.cat}
            style={{ width: `${(d.amt / total) * 100}%`, background: colors[i % colors.length] }}
          />
        ))}
      </div>
      <ul style={{ display: 'flex', gap: 24, marginTop: 14, padding: 0, listStyle: 'none', flexWrap: 'wrap', fontSize: 13 }}>
        {data.map((d, i) => (
          <li key={d.cat} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span
              aria-hidden="true"
              style={{ display: 'inline-block', width: 10, height: 10, background: colors[i % colors.length], borderRadius: 2 }}
            />
            <span>{d.cat}</span>
            <span className="muted">· {fmtMoney(d.amt)}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
