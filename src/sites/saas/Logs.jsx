import { useState, useMemo } from 'react';
import { useStore } from './store.jsx';

/**
 * Pulsegrid Logs Explorer — searchable log stream.
 * Intentional issues:
 *   PG-045 label — search input relies only on placeholder
 *   PG-046 scrollable-region-focusable — log stream <pre> is scrollable, no tabindex
 *   PG-IGT-013 (Headings) — "Live tail" label is styled like a heading but is a <span>
 */
export default function Logs() {
  const { state } = useStore();
  const [q, setQ] = useState('');
  const [severity, setSeverity] = useState('all');

  // Build fake log lines from services + hosts + alerts
  const lines = useMemo(() => {
    const rows = [];
    for (let i = 0; i < 50; i++) {
      const svc = state.services[i % state.services.length];
      const host = state.hosts[i % state.hosts.length];
      const sev = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR'][i % 5];
      const ts = new Date(Date.now() - i * 45000).toISOString().replace('T', ' ').slice(0, 19);
      rows.push({
        ts, sev, svc: svc.name, host: host.id,
        msg: sev === 'ERROR'
          ? `Request failed: upstream ${svc.name} returned 502 after ${100 + (i * 7) % 400}ms`
          : sev === 'WARN'
            ? `Slow query detected on ${svc.name} — ${400 + (i * 3) % 200}ms`
            : `${svc.name} handled request in ${20 + (i * 11) % 80}ms`,
      });
    }
    return rows;
  }, [state.services, state.hosts]);

  const filtered = lines.filter((l) =>
    (severity === 'all' || l.sev === severity.toUpperCase()) &&
    (!q || (l.msg + l.svc + l.host).toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <>
      <div className="pg-page-title">
        <h1>Logs Explorer</h1>
        {/* PG-IGT-013: heading-like styled span */}
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--pg-cyan)' }}>● Live tail</span>
      </div>

      <div className="pg-widget">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
          {/* PG-045: input has no label, only placeholder */}
          <input
            className="pg-search-input"
            style={{ flex: 1, paddingLeft: 12 }}
            placeholder="service:checkout-api status:error"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {['all', 'info', 'warn', 'error'].map((s) => (
            <button
              key={s}
              type="button"
              className="pg-btn pg-btn--ghost"
              style={{
                fontSize: 12, padding: '4px 12px',
                border: `1px solid ${severity === s ? 'var(--pg-violet)' : 'var(--pg-border)'}`,
              }}
              onClick={() => setSeverity(s)}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 12, color: 'var(--pg-text-muted)', marginBottom: 8 }}>
          {filtered.length} of {lines.length} events
        </div>

        {/* PG-046: scrollable, no tabindex="0" on region */}
        <pre style={{ maxHeight: 400, overflowY: 'auto', background: '#08080f', border: '1px solid var(--pg-border)', borderRadius: 6, padding: 12, margin: 0, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, color: 'var(--pg-text-secondary)' }}>
          {filtered.map((l, i) => (
            <div key={i} style={{ padding: '2px 0' }}>
              <span style={{ color: 'var(--pg-text-muted)' }}>{l.ts}</span>{' '}
              <span style={{ color: l.sev === 'ERROR' ? 'var(--pg-red)' : l.sev === 'WARN' ? 'var(--pg-orange)' : 'var(--pg-cyan)', fontWeight: 700 }}>{l.sev.padEnd(5)}</span>{' '}
              <span style={{ color: 'var(--pg-violet)' }}>{l.svc}</span>@{l.host}{'  '}
              {l.msg}
            </div>
          ))}
        </pre>
      </div>
    </>
  );
}
