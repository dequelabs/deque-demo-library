import { useState } from 'react';
import { useStore } from './store.jsx';

/**
 * Pulsegrid Infrastructure — hosts view.
 * Intentional issues:
 *   PG-040 target-size — small "×" filter chip close buttons are 12x12
 *   PG-041 aria-input-field-name — region combobox input has no accessible name
 */
export default function Hosts() {
  const { state } = useStore();
  const [regionFilter, setRegionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeChips, setActiveChips] = useState([]);

  const hosts = state.hosts.filter((h) =>
    (!regionFilter || h.region.includes(regionFilter)) &&
    (!statusFilter || h.status === statusFilter)
  );

  const addChip = (kind, value) => {
    setActiveChips((c) => [...c.filter((x) => x.kind !== kind), { kind, value }]);
    if (kind === 'region') setRegionFilter(value);
    if (kind === 'status') setStatusFilter(value);
  };
  const removeChip = (chip) => {
    setActiveChips((c) => c.filter((x) => x !== chip));
    if (chip.kind === 'region') setRegionFilter('');
    if (chip.kind === 'status') setStatusFilter('');
  };

  return (
    <>
      <div className="pg-page-title">
        <h1>Infrastructure</h1>
        <span style={{ fontSize: 13, color: 'var(--pg-text-muted)' }}>{hosts.length} of {state.hosts.length} hosts</span>
      </div>

      <div className="pg-widget">
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--pg-text-muted)' }}>Filter:</span>
          {['us-east-1', 'us-west-2', 'eu-west-1'].map((r) => (
            <button key={r} type="button" className="pg-btn pg-btn--ghost" style={{ fontSize: 12 }} onClick={() => addChip('region', r)}>
              {r}
            </button>
          ))}
          <span style={{ marginLeft: 12 }} />
          {['healthy', 'warning', 'critical'].map((s) => (
            <button key={s} type="button" className="pg-btn pg-btn--ghost" style={{ fontSize: 12 }} onClick={() => addChip('status', s)}>
              {s}
            </button>
          ))}

          {/* PG-041: input inside combobox-styled wrapper with no accessible name */}
          <div style={{ marginLeft: 'auto' }}>
            <input
              role="combobox"
              placeholder="Add custom filter..."
              style={{ padding: '6px 12px', background: 'var(--pg-bg-elev)', border: '1px solid var(--pg-border)', color: 'var(--pg-text)', borderRadius: 6, fontSize: 13 }}
            />
          </div>
        </div>

        {activeChips.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {activeChips.map((chip, i) => (
              <span key={i} style={{ padding: '4px 8px', background: 'var(--pg-bg-elev)', border: '1px solid var(--pg-border)', borderRadius: 4, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {chip.kind}: {chip.value}
                {/* PG-040: 12x12 tap target (target-size wants 24×24) */}
                <button
                  type="button"
                  onClick={() => removeChip(chip)}
                  aria-label={`Remove ${chip.kind} filter ${chip.value}`}
                  style={{ width: 12, height: 12, padding: 0, background: 'transparent', border: 'none', color: 'var(--pg-text-muted)', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {hosts.map((h) => (
            <div key={h.id} style={{ padding: 12, border: '1px solid var(--pg-border)', borderRadius: 6, background: 'var(--pg-bg-panel)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <strong style={{ color: 'var(--pg-text)', fontSize: 13 }}>{h.id}</strong>
                <span className={`pg-status pg-status--${h.status === 'warning' ? 'degraded' : h.status}`}>{h.status}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--pg-text-muted)' }}>{h.region}</div>
              <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 12 }}>
                <div><span style={{ color: 'var(--pg-text-muted)' }}>CPU</span> <strong>{h.cpu}%</strong></div>
                <div><span style={{ color: 'var(--pg-text-muted)' }}>Mem</span> <strong>{h.memory}%</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
