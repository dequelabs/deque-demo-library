import { useState } from 'react';
import { useStore } from './store.jsx';

/**
 * Pulsegrid Services (APM) — sortable list of services with a slide-in detail panel.
 *
 * Intentional axe issues:
 *   PG-035 button-name       — reset-filter icon button lacks a label
 *   PG-036 scope-attr-valid  — table uses scope="col-header" (invalid value)
 *   PG-037 duplicate-id      — two elements share id="svc-detail-title" when panel is open
 *   PG-IGT-012 (Reading Order) — the detail panel is CSS-positioned above the list but comes
 *                                after the list in DOM order, so screen reader / tab order
 *                                sees list first then detail.
 */
export default function Services() {
  const { state } = useStore();
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = state.services.filter((s) =>
    !q || s.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <div className="pg-page-title">
        <h1>Services</h1>
        <span style={{ fontSize: 13, color: 'var(--pg-text-muted)' }}>
          {filtered.length} services
        </span>
      </div>

      <div className="pg-widget">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <label htmlFor="svc-search" className="sr-only">Search services</label>
          <input
            id="svc-search"
            className="pg-search-input"
            placeholder="Filter services..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ flex: 1, paddingLeft: 12 }}
          />
          {q && (
            /* PG-035: icon button without accessible name */
            <button
              type="button"
              className="pg-icon-btn"
              onClick={() => setQ('')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* PG-IGT-012: Detail panel appears above the list visually (flex-direction: column-reverse
            OR CSS positioning), but is placed after the list in DOM. */}
        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 16 }}>
          <table className="pg-services-table">
            <thead>
              <tr>
                {/* PG-036: invalid scope value */}
                <th scope="col-header">Service</th>
                <th scope="col">Env</th>
                <th scope="col">Requests</th>
                <th scope="col">Errors</th>
                <th scope="col">p95 (ms)</th>
                <th scope="col">Apdex</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} onClick={() => setSelected(s)} style={{ cursor: 'pointer' }}>
                  <td>{s.name}</td>
                  <td>{s.env}</td>
                  <td>{s.requests}</td>
                  <td>{s.errors}</td>
                  <td>{s.p95}</td>
                  <td>{s.apdex}</td>
                  <td><span className={`pg-status pg-status--${s.status}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          {selected && (
            <div style={{ border: '1px solid var(--pg-border)', borderRadius: 6, padding: 16, background: 'var(--pg-bg-elev)' }}>
              {/* PG-037: duplicate id — this same id appears on the main page title in some layouts */}
              <div id="svc-detail-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 style={{ fontSize: 18 }}>{selected.name}</h2>
                <button
                  type="button"
                  className="pg-btn pg-btn--ghost"
                  onClick={() => setSelected(null)}
                  style={{ fontSize: 12 }}
                >
                  Close
                </button>
              </div>
              <div id="svc-detail-title" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                <Kpi label="Requests" value={selected.requests} />
                <Kpi label="Errors" value={selected.errors} />
                <Kpi label="p95" value={`${selected.p95} ms`} />
                <Kpi label="Apdex" value={selected.apdex} />
              </div>
              <p style={{ marginTop: 12, fontSize: 13 }}>
                Traces, deploy history, and error breakdown would be shown here in a production Pulsegrid workspace.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Kpi({ label, value }) {
  return (
    <div style={{ padding: 12, background: 'var(--pg-bg-panel)', border: '1px solid var(--pg-border)', borderRadius: 4 }}>
      <div style={{ fontSize: 11, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--pg-text)' }}>{value}</div>
    </div>
  );
}
