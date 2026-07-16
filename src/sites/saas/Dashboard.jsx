import { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from './store.jsx';

/**
 * Pulsegrid Dashboard — the interactive, post-login core of the demo.
 *
 * The whole page is designed to feel like Datadog: dense grid of widgets, live
 * filtering, sortable services table, area chart with togglable series, alert
 * acknowledgement modal, host heatmap.
 *
 * Intentional axe issues (see PULSEGRID_ACCESSIBILITY_ISSUES.md):
 *   PG-015 color-contrast              — metric delta uses low-contrast green
 *   PG-016 aria-required-attr          — tablist tabs are missing aria-selected/aria-controls
 *   PG-017 scrollable-region-focusable — services table wrapper is scrollable, no tabindex
 *   PG-018 nested-interactive          — services table has <button> inside <a>
 *   PG-019 link-in-text-block          — "See report" link in alert body has no underline
 *   PG-021 dialog role missing         — Ack modal doesn't declare role="dialog"
 *   PG-022 aria-required-attr          — Ack modal missing aria-modal + aria-labelledby
 *   PG-IGT-006 Modals                  — Ack modal doesn't return focus to trigger on close
 *   PG-IGT-007 Modals                  — Ack modal doesn't move focus into itself on open
 *   PG-IGT-009 Keyboard                — "Run query" custom control is a div, not a button
 *   PG-IGT-010 Keyboard                — Time range dropdown ignores Escape
 */
export default function Dashboard() {
  const { state, dispatch, timeRanges } = useStore();

  const [activeTab, setActiveTab] = useState('overview'); // overview | apm | infra | logs
  const [sortKey, setSortKey] = useState('requests');
  const [sortDir, setSortDir] = useState('desc');
  const [seriesVisible, setSeriesVisible] = useState({ requests: true, errors: true });
  const [rangeOpen, setRangeOpen] = useState(false);
  const [envFilter, setEnvFilter] = useState('all');
  const [queryText, setQueryText] = useState('service:*');
  const [ackTarget, setAckTarget] = useState(null); // alert id being acknowledged
  const rangeBtnRef = useRef(null);

  const currentRange = timeRanges.find((r) => r.id === state.timeRange) || timeRanges[1];

  const sortedServices = useMemo(() => {
    const filtered = envFilter === 'all' ? state.services : state.services.filter((s) => s.env === envFilter);
    const parseVal = (v) => {
      if (typeof v === 'number') return v;
      if (typeof v === 'string' && v.endsWith('M')) return parseFloat(v) * 1e6;
      if (typeof v === 'string' && v.endsWith('k')) return parseFloat(v) * 1e3;
      return v;
    };
    return [...filtered].sort((a, b) => {
      const av = parseVal(a[sortKey]);
      const bv = parseVal(b[sortKey]);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [state.services, sortKey, sortDir, envFilter]);

  const openAlerts = state.alerts.filter((a) => !a.ack).length;

  // Column header click → sort
  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  }

  return (
    <>
      <div className="pg-page-title">
        <div>
          <h1>{activeTab === 'overview' ? 'Platform Overview' : activeTab === 'apm' ? 'Application Performance' : activeTab === 'infra' ? 'Infrastructure' : 'Logs Explorer'}</h1>
          <p style={{ fontSize: 13, marginTop: 4 }}>
            {state.organization.name} · {state.organization.plan} · {state.organization.region}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {openAlerts > 0 && (
            <span className="pg-status pg-status--critical" aria-live="polite">
              {openAlerts} open alert{openAlerts === 1 ? '' : 's'}
            </span>
          )}
          <TimeRangePicker
            ranges={timeRanges}
            value={currentRange}
            open={rangeOpen}
            setOpen={setRangeOpen}
            onSelect={(id) => dispatch({ type: 'setTimeRange', payload: id })}
            triggerRef={rangeBtnRef}
          />
        </div>
      </div>

      {/* PG-016: role="tablist" but tabs lack aria-selected / aria-controls */}
      <div role="tablist" style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--pg-border)', marginBottom: 20 }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'apm', label: 'APM' },
          { id: 'infra', label: 'Infrastructure' },
          { id: 'logs', label: 'Logs' },
        ].map((t) => (
          <button
            key={t.id}
            role="tab"
            className="pg-btn pg-btn--ghost"
            style={{
              borderRadius: '4px 4px 0 0',
              borderBottom: activeTab === t.id ? '2px solid var(--pg-violet)' : '2px solid transparent',
              color: activeTab === t.id ? 'var(--pg-text)' : 'var(--pg-text-secondary)',
            }}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* METRIC CARDS */}
      <div className="pg-metric-grid">
        {state.metrics.map((m) => <MetricCard key={m.id} metric={m} />)}
      </div>

      {/* MAIN CHART + ALERTS SIDE-BY-SIDE */}
      <div className="pg-widget-grid">
        <div className="pg-widget">
          <div className="pg-widget-head">
            <h2>Request rate & error rate</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <label style={{ fontSize: 12, color: 'var(--pg-text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={seriesVisible.requests}
                  onChange={(e) => setSeriesVisible((s) => ({ ...s, requests: e.target.checked }))}
                  style={{ marginRight: 4 }}
                />
                Requests
              </label>
              <label style={{ fontSize: 12, color: 'var(--pg-text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={seriesVisible.errors}
                  onChange={(e) => setSeriesVisible((s) => ({ ...s, errors: e.target.checked }))}
                  style={{ marginRight: 4 }}
                />
                Errors
              </label>
            </div>
          </div>
          <AreaChart series={state.areaSeries} visible={seriesVisible} />
        </div>

        <div className="pg-widget">
          <div className="pg-widget-head">
            <h2>Active alerts</h2>
            <span style={{ fontSize: 12, color: 'var(--pg-text-muted)' }}>{state.alerts.length} total</span>
          </div>
          <ul className="pg-alerts-list">
            {state.alerts.map((a) => (
              <li key={a.id} className="pg-alert-item">
                <span className={`pg-alert-sev pg-alert-sev--${a.severity}`} aria-label={`${a.severity} severity`} />
                <div className="pg-alert-body">
                  <div className="pg-alert-title">{a.title}</div>
                  <div className="pg-alert-meta">
                    {a.source} · {a.triggered}
                    {/* PG-019: link in text block only distinguished by color, no underline */}
                    {' · '}
                    <a
                      href={`#alert-${a.id}`}
                      onClick={(e) => e.preventDefault()}
                      style={{ textDecoration: 'none' }}
                    >
                      See report
                    </a>
                  </div>
                </div>
                {a.ack ? (
                  <span className="pg-status pg-status--healthy">Acked ✓</span>
                ) : (
                  <button
                    type="button"
                    className="pg-btn pg-btn--outline"
                    style={{ padding: '4px 10px', fontSize: 12 }}
                    onClick={() => setAckTarget(a.id)}
                  >
                    Ack
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* QUERY BAR + SERVICES TABLE */}
      <div className="pg-widget">
        <div className="pg-widget-head">
          <h2>Services</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'prod'].map((e) => (
              <button
                key={e}
                type="button"
                className="pg-btn pg-btn--ghost"
                style={{
                  fontSize: 12, padding: '4px 12px',
                  borderBottom: envFilter === e ? '2px solid var(--pg-violet)' : '2px solid transparent',
                }}
                onClick={() => setEnvFilter(e)}
              >
                {e === 'all' ? 'All envs' : 'Prod'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            className="pg-search-input"
            style={{ flex: 1, paddingLeft: 12 }}
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            aria-label="Log query"
          />
          {/* PG-IGT-009: div acting as a button, no role/tabIndex/keyboard handler */}
          <div
            className="pg-btn pg-btn--primary"
            onClick={() => { /* re-run query */ }}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            Run query
          </div>
        </div>

        {/* PG-017: this wrapper scrolls horizontally on small screens but has no tabindex="0" */}
        <div style={{ overflowX: 'auto' }}>
          <table className="pg-services-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Service {sortKey === 'name' && (sortDir === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleSort('env')}>Env</th>
                <th onClick={() => handleSort('requests')}>Requests {sortKey === 'requests' && (sortDir === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleSort('errors')}>Errors {sortKey === 'errors' && (sortDir === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleSort('p95')}>p95 (ms) {sortKey === 'p95' && (sortDir === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleSort('apdex')}>Apdex {sortKey === 'apdex' && (sortDir === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleSort('status')}>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedServices.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.env}</td>
                  <td>{s.requests}</td>
                  <td>{s.errors}</td>
                  <td>{s.p95}</td>
                  <td>{s.apdex}</td>
                  <td><span className={`pg-status pg-status--${s.status}`}>{s.status}</span></td>
                  <td>
                    {/* PG-018: <button> nested inside <a> — nested-interactive */}
                    <a href={`#svc-${s.id}`} onClick={(e) => e.preventDefault()}>
                      <button
                        type="button"
                        className="pg-btn pg-btn--ghost"
                        style={{ padding: '2px 8px', fontSize: 11 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Trace
                      </button>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HOST HEATMAP */}
      <div className="pg-widget">
        <div className="pg-widget-head">
          <h2>Host saturation ({state.hosts.length} hosts)</h2>
          <span style={{ fontSize: 12, color: 'var(--pg-text-muted)' }}>Green = healthy · Amber = warn · Red = critical</span>
        </div>
        <div className="pg-heatmap" role="grid" aria-label="Host status heatmap">
          {state.hosts.map((h) => (
            <div
              key={h.id}
              role="gridcell"
              className={`pg-heat-cell pg-heat-cell--${h.status}`}
              tabIndex="0"
              title={`${h.id} · ${h.region} · CPU ${h.cpu}% · Mem ${h.memory}%`}
              aria-label={`${h.id} in ${h.region}, ${h.status}, CPU ${h.cpu} percent, memory ${h.memory} percent`}
            />
          ))}
        </div>
      </div>

      {/* ACK MODAL */}
      {ackTarget && (
        <AckModal
          alertId={ackTarget}
          alerts={state.alerts}
          onClose={() => setAckTarget(null)}
          onConfirm={() => { dispatch({ type: 'ackAlert', payload: ackTarget }); setAckTarget(null); }}
        />
      )}
    </>
  );
}

/* -------------------- helpers -------------------- */

function MetricCard({ metric }) {
  return (
    <div className="pg-metric-card">
      <div className="pg-metric-label">{metric.label}</div>
      <div className="pg-metric-value">{metric.value}</div>
      {/* PG-015: low-contrast lime on dark bg (looks ok but fails 4.5:1) */}
      <div
        className={`pg-metric-delta ${metric.trend === 'up' && metric.id !== 'errors' ? 'pg-metric-delta--up' : metric.trend === 'down' && metric.id === 'errors' ? 'pg-metric-delta--up' : 'pg-metric-delta--down'}`}
        style={{ color: metric.id === 'apdex' ? '#5a8a3a' : undefined }}
      >
        {metric.delta} vs previous
      </div>
      <Sparkline points={metric.sparkline} />
    </div>
  );
}

function Sparkline({ points }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const w = 140, h = 32;
  const step = w / (points.length - 1);
  const path = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${h - ((v - min) / span) * (h - 4) - 2}`).join(' ');
  return (
    <svg className="pg-metric-spark" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <path d={path} fill="none" stroke="var(--pg-violet)" strokeWidth="1.5" />
    </svg>
  );
}

function AreaChart({ series, visible }) {
  const w = 620, h = 200;
  const requests = series.requests;
  const errors = series.errors.map((e) => e * 20); // scale errors so both series show
  const max = Math.max(...requests, ...errors);
  const step = w / (requests.length - 1);
  const pointsFor = (arr) => arr.map((v, i) => `${i * step},${h - (v / max) * (h - 20) - 10}`).join(' ');
  const areaFor = (arr) => `M 0,${h} L ${pointsFor(arr).replace(/,/g, ' ').replace(/ /g, ',').replace(/,/g, ' ')} L ${w},${h} Z`;

  const buildArea = (arr) => {
    const pts = arr.map((v, i) => [i * step, h - (v / max) * (h - 20) - 10]);
    return `M 0 ${h} L ${pts.map(([x, y]) => `${x} ${y}`).join(' L ')} L ${w} ${h} Z`;
  };
  const buildLine = (arr) => {
    const pts = arr.map((v, i) => [i * step, h - (v / max) * (h - 20) - 10]);
    return `M ${pts.map(([x, y]) => `${x} ${y}`).join(' L ')}`;
  };

  return (
    <>
      <svg viewBox={`0 0 ${w} ${h}`} className="pg-area-chart" role="img" aria-label="Request and error rate over time">
        <defs>
          <linearGradient id="areaViolet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="1" stopColor="#6366f1" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="areaFuchsia" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d946ef" stopOpacity="0.4" />
            <stop offset="1" stopColor="#d946ef" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {visible.requests && (
          <>
            <path d={buildArea(requests)} fill="url(#areaViolet)" />
            <path d={buildLine(requests)} fill="none" stroke="#6366f1" strokeWidth="2" />
          </>
        )}
        {visible.errors && (
          <>
            <path d={buildArea(errors)} fill="url(#areaFuchsia)" />
            <path d={buildLine(errors)} fill="none" stroke="#d946ef" strokeWidth="2" />
          </>
        )}
      </svg>
      <div className="pg-area-legend">
        <span><span className="pg-legend-dot" style={{ background: '#6366f1' }} /> Requests</span>
        <span><span className="pg-legend-dot" style={{ background: '#d946ef' }} /> Errors (×20)</span>
      </div>
    </>
  );
}

function TimeRangePicker({ ranges, value, open, setOpen, onSelect, triggerRef }) {
  // PG-IGT-010: this popup doesn't respond to Escape or click-outside
  return (
    <div className="pg-timerange">
      <button
        type="button"
        ref={triggerRef}
        className="pg-timerange-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        🕒 {value.label} ▾
      </button>
      {open && (
        <div className="pg-timerange-menu" role="listbox">
          {ranges.map((r) => (
            <div
              key={r.id}
              role="option"
              aria-selected={r.id === value.id}
              onClick={() => { onSelect(r.id); setOpen(false); }}
            >
              {r.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AckModal({ alertId, alerts, onClose, onConfirm }) {
  const alert = alerts.find((a) => a.id === alertId);
  const [note, setNote] = useState('');
  // PG-IGT-006 / PG-IGT-007: on mount we do NOT move focus into the dialog,
  // and on close we do NOT return focus to the invoking button.
  useEffect(() => {
    // (Intentionally empty — behavioral IGT issue)
  }, []);

  if (!alert) return null;

  return (
    <div className="pg-modal-backdrop" onClick={onClose}>
      {/* PG-021: this should be role="dialog" (or role="alertdialog"), it's not.
          PG-022: aria-modal / aria-labelledby also missing. */}
      <div className="pg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pg-modal-title">Acknowledge alert</div>
        <p style={{ color: 'var(--pg-text-secondary)', fontSize: 13, marginBottom: 8 }}>
          {alert.title}
        </p>
        <label htmlFor="ack-note" style={{ fontSize: 12, color: 'var(--pg-text-secondary)' }}>Optional note (visible to team)</label>
        <textarea
          id="ack-note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 4, background: 'var(--pg-bg-elev)', border: '1px solid var(--pg-border)', borderRadius: 6, color: 'var(--pg-text)' }}
        />
        <div className="pg-modal-actions">
          <button type="button" className="pg-btn pg-btn--outline" onClick={onClose}>Cancel</button>
          <button type="button" className="pg-btn pg-btn--primary" onClick={onConfirm}>Acknowledge</button>
        </div>
      </div>
    </div>
  );
}
