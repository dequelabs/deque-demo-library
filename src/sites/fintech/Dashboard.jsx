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
          <p className="subtitle">Last sign-in: today, 9:42 AM · Chicago, IL</p>
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
          <div className="delta">+ {fmtMoney(312.06)} this month</div>
        </div>
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
