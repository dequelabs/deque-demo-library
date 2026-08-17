import { useState } from 'react';
import { useStore } from './store.jsx';

/**
 * Pulsegrid Alerts page — filter + acknowledge alerts.
 * Intentional axe issues:
 *   PG-030 select-name           — status filter <select> has no accessible name
 *   PG-031 aria-required-children — role="listbox" contains plain divs
 *   PG-032 color-contrast        — severity legend text on gray
 *   PG-IGT-011 (Forms)           — grouping of radio-like severity chips lacks fieldset/legend
 */
export default function Alerts() {
  const { state, dispatch } = useStore();
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = state.alerts.filter((a) =>
    (severityFilter === 'all' || a.severity === severityFilter) &&
    (statusFilter === 'all' || (statusFilter === 'open' ? !a.ack : a.ack))
  );

  return (
    <>
      <div className="pg-page-title">
        <h1>Alerts</h1>
        <span style={{ fontSize: 13, color: 'var(--pg-text-muted)' }}>
          {filtered.length} of {state.alerts.length} shown
        </span>
      </div>

      <div className="pg-widget">
        {/* PG-IGT-011: severity chips act as a radio group but no <fieldset><legend> */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Severity:
          </span>
          {['all', 'critical', 'warning', 'info'].map((sev) => (
            <button
              key={sev}
              type="button"
              className="pg-btn pg-btn--ghost"
              style={{
                fontSize: 12, padding: '4px 12px',
                border: `1px solid ${severityFilter === sev ? 'var(--pg-violet)' : 'var(--pg-border)'}`,
              }}
              onClick={() => setSeverityFilter(sev)}
            >
              {sev}
            </button>
          ))}

          <span style={{ marginLeft: 16, fontSize: 12, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Status:
          </span>
          {/* PG-030: <select> without <label> or aria-label */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ background: 'var(--pg-bg-elev)', border: '1px solid var(--pg-border)', color: 'var(--pg-text)', padding: '6px 12px', borderRadius: 6, fontSize: 13 }}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="ack">Acknowledged</option>
          </select>
        </div>

        {/* PG-032: legend text uses low-contrast gray on gray */}
        <div style={{ fontSize: 11, color: '#4a4a5c', marginBottom: 12 }}>
          Alerts are grouped by monitor. Click "Acknowledge" to silence for 24h. Reference: SEV-1 / SEV-2 / SEV-3.
        </div>

        {/* PG-031: role="listbox" but children are divs, not role="option" */}
        <div role="listbox" style={{ border: '1px solid var(--pg-border)', borderRadius: 6 }}>
          {filtered.length === 0 && (
            <div style={{ padding: 16, textAlign: 'center', color: 'var(--pg-text-muted)' }}>
              No alerts match the current filter.
            </div>
          )}
          {filtered.map((a) => (
            <div
              key={a.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '20px 1fr 120px 100px',
                gap: 12,
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: '1px solid var(--pg-border)',
              }}
            >
              <span className={`pg-alert-sev pg-alert-sev--${a.severity}`} aria-label={`${a.severity} severity`} />
              <div>
                <div style={{ color: 'var(--pg-text)', fontSize: 13 }}>{a.title}</div>
                <div style={{ color: 'var(--pg-text-muted)', fontSize: 11 }}>
                  {a.source} · {a.triggered}
                </div>
              </div>
              <span className={`pg-status pg-status--${a.severity === 'critical' ? 'critical' : a.severity === 'warning' ? 'degraded' : 'healthy'}`}>
                {a.severity}
              </span>
              {a.ack ? (
                <span style={{ fontSize: 12, color: 'var(--pg-text-muted)' }}>Acked ✓</span>
              ) : (
                <button
                  type="button"
                  className="pg-btn pg-btn--outline"
                  style={{ padding: '4px 10px', fontSize: 12 }}
                  onClick={() => dispatch({ type: 'ackAlert', payload: a.id })}
                >
                  Acknowledge
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
