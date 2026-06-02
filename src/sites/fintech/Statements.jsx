import { useMemo, useState, useId } from 'react';
import { useStore } from './store.jsx';
import { fmtDateFull } from './format.js';

export default function FintechStatements() {
  const { state } = useStore();
  const [accountId, setAccountId] = useState('all');
  const [year, setYear] = useState('all');
  const acctSelectId = useId();
  const yearSelectId = useId();

  const years = useMemo(() => {
    const set = new Set(state.statements.map((s) => s.startISO.slice(0, 4)));
    return ['all', ...Array.from(set).sort().reverse()];
  }, [state.statements]);

  const filtered = useMemo(() => {
    return state.statements.filter((s) => {
      if (accountId !== 'all' && s.accountId !== accountId) return false;
      if (year !== 'all' && !s.startISO.startsWith(year)) return false;
      return true;
    });
  }, [state.statements, accountId, year]);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Statements &amp; tax</h1>
          <p className="subtitle">Download monthly statements and end-of-year tax documents.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-row" style={{ marginBottom: 0, minWidth: 220 }}>
            <label htmlFor={acctSelectId}>Account</label>
            <select
              id={acctSelectId}
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            >
              <option value="all">All accounts</option>
              {state.accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name} ··{a.last4}</option>
              ))}
            </select>
          </div>
          <div className="form-row" style={{ marginBottom: 0, minWidth: 160 }}>
            <label htmlFor={yearSelectId}>Year</label>
            <select
              id={yearSelectId}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y === 'all' ? 'All years' : y}</option>
              ))}
            </select>
          </div>
          <div role="status" aria-live="polite" className="muted" style={{ paddingBottom: 11 }}>
            {filtered.length} {filtered.length === 1 ? 'statement' : 'statements'}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state card">No statements match these filters.</div>
      ) : (
        <table className="data-table">
          <caption style={{ position: 'absolute', left: -9999 }}>
            Available statements
          </caption>
          <thead>
            {/* PHASE-2 a11y issue MT-016 — see ACCESSIBILITY_ISSUES.md
                Was: each <th> had a valid scope="col".
                Now: each <th> has scope="column" — an INVALID value (the valid tokens
                are "col" / "row" / "colgroup" / "rowgroup"). Triggers axe-core
                `scope-attr-valid` (Serious, WCAG 1.3.1) reliably; merely dropping
                the scope attribute didn't fire a rule on its own. */}
            <tr>
              <th scope="column">Period</th>
              <th scope="column">Account</th>
              <th scope="column">Statement date</th>
              <th scope="column">Size</th>
              <th scope="column" style={{ textAlign: 'right' }}>
                <span style={{ position: 'absolute', left: -9999 }}>Download</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const acct = state.accounts.find((a) => a.id === s.accountId);
              return (
                <tr key={s.id}>
                  <td>{s.period}</td>
                  <td>{acct ? `${acct.name} ··${acct.last4}` : '—'}</td>
                  <td><time dateTime={s.endISO}>{fmtDateFull(s.endISO)}</time></td>
                  <td>{s.sizeKB} KB</td>
                  <td style={{ textAlign: 'right' }}>
                    {/* PHASE-2 a11y issue MT-017 — see ACCESSIBILITY_ISSUES.md
                        Was: <a href="…"> Download <span sr-only>{period} ... statement (PDF, … KB)</span></a>
                        Now: icon-only <a> with an inline SVG (aria-hidden) and NO
                        accessible name. Triggers axe-core `link-name` (Critical, WCAG 2.4.4). */}
                    <a
                      href={`#statement-${s.id}`}
                      onClick={(e) => { e.preventDefault(); alert(`Download stub: ${s.period} statement (${acct ? acct.name : ''})`); }}
                    >
                      <svg
                        aria-hidden="true"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <section aria-labelledby="tax-heading" style={{ marginTop: 32 }}>
        <h2 id="tax-heading" style={{ fontSize: 18, color: 'var(--brand-deep)' }}>Tax documents</h2>
        <p className="muted">1099-INT and 1099-DIV become available by January 31 each year.</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li className="payee-row" style={{ marginBottom: 12 }}>
            <div className="payee-meta">
              <span className="name">1099-INT (Smart Savings)</span>
              <span className="acct">Tax year {new Date().getFullYear() - 1}</span>
            </div>
            <a
              href="#tax-1099int"
              onClick={(e) => { e.preventDefault(); alert('Download stub: 1099-INT (Smart Savings)'); }}
            >Download (PDF)</a>
          </li>
          <li className="payee-row">
            <div className="payee-meta">
              <span className="name">1099-DIV (Brokerage)</span>
              <span className="acct">Tax year {new Date().getFullYear() - 1}</span>
            </div>
            <a
              href="#tax-1099div"
              onClick={(e) => { e.preventDefault(); alert('Download stub: 1099-DIV (Brokerage)'); }}
            >Download (PDF)</a>
          </li>
        </ul>
      </section>
    </>
  );
}
