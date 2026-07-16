import { useState } from 'react';

/**
 * Pulsegrid Incidents — simple list. Intentional issues:
 *   PG-055 heading-order — h1 → h4 skipping h2, h3
 *   PG-IGT-015 (Structure) — Incidents list rendered as <div>s (not a real list)
 */
const INCIDENTS = [
  { id: 'INC-0421', title: 'media-cdn regional outage', severity: 'SEV-1', status: 'investigating', started: '11m ago', commander: 'Elena Park' },
  { id: 'INC-0420', title: 'search-frontend elevated errors',  severity: 'SEV-2', status: 'mitigating',   started: '2h ago',  commander: 'Marcus Lee' },
  { id: 'INC-0419', title: 'auth-gateway certificate rotation', severity: 'SEV-3', status: 'monitoring',   started: '1d ago',  commander: 'Ana Rios' },
  { id: 'INC-0418', title: 'notifications queue backlog',       severity: 'SEV-3', status: 'resolved',     started: '3d ago',  commander: 'Deke Quinn' },
];

export default function Incidents() {
  const [openId, setOpenId] = useState(null);

  return (
    <>
      <div className="pg-page-title">
        <h1>Incidents</h1>
        <button type="button" className="pg-btn pg-btn--primary">New incident</button>
      </div>

      <div className="pg-widget">
        {/* PG-055: h1 → h4 (skips h2, h3) */}
        <h4 style={{ fontSize: 16, marginBottom: 12 }}>Recent incidents</h4>

        {/* PG-IGT-015: divs used instead of <ul><li> for a list */}
        <div>
          {INCIDENTS.map((i) => (
            <div key={i.id} style={{ borderBottom: '1px solid var(--pg-border)' }}>
              <button
                type="button"
                onClick={() => setOpenId(openId === i.id ? null : i.id)}
                aria-expanded={openId === i.id}
                style={{
                  width: '100%', textAlign: 'left', background: 'transparent',
                  border: 'none', padding: '12px 4px', cursor: 'pointer',
                  color: 'var(--pg-text)', display: 'flex', gap: 12, alignItems: 'center',
                }}
              >
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                  background: i.severity === 'SEV-1' ? 'rgba(239,68,68,0.2)' : i.severity === 'SEV-2' ? 'rgba(245,158,11,0.2)' : 'rgba(34,211,238,0.2)',
                  color: i.severity === 'SEV-1' ? 'var(--pg-red)' : i.severity === 'SEV-2' ? 'var(--pg-orange)' : 'var(--pg-cyan)',
                }}>{i.severity}</span>
                <span style={{ flex: 1 }}>{i.title}</span>
                <span style={{ fontSize: 12, color: 'var(--pg-text-muted)' }}>{i.status}</span>
                <span style={{ fontSize: 12, color: 'var(--pg-text-muted)' }}>{i.started}</span>
              </button>
              {openId === i.id && (
                <div style={{ padding: '12px 4px 16px', background: 'var(--pg-bg-elev)', borderRadius: 6, margin: '8px 0' }}>
                  <div style={{ fontSize: 12, color: 'var(--pg-text-muted)' }}>ID {i.id} · Commander: {i.commander}</div>
                  <p style={{ marginTop: 8 }}>
                    A structured post-mortem is being drafted. Runbook, timeline, and impacted services will be linked here.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
