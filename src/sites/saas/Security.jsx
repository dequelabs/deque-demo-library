/**
 * Pulsegrid Security — Threats view.
 * Intentional issues:
 *   PG-060 svg-img-alt — inline SVG "shield" icon has no title/aria-label but is informative
 *   PG-061 aria-required-attr — role="progressbar" without aria-valuenow / aria-valuemin / aria-valuemax
 */
const FINDINGS = [
  { id: 'F-01', title: 'S3 bucket "app-uploads-prod" is publicly readable',   severity: 'critical', posture: 92 },
  { id: 'F-02', title: 'IAM role "deployer" has AdministratorAccess policy',  severity: 'critical', posture: 88 },
  { id: 'F-03', title: 'RDS instance without encryption at rest',              severity: 'warning',  posture: 60 },
  { id: 'F-04', title: 'Container image lambda-processor:1.2 has 4 CVEs',      severity: 'warning',  posture: 55 },
  { id: 'F-05', title: 'CloudTrail not enabled in eu-west-2',                  severity: 'info',     posture: 40 },
];

export default function Security() {
  const criticals = FINDINGS.filter((f) => f.severity === 'critical').length;

  return (
    <>
      <div className="pg-page-title">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* PG-060: informative SVG with no accessible name */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--pg-cyan)' }}>
            <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
          </svg>
          <h1>Cloud Security</h1>
        </div>
        <span className="pg-status pg-status--critical">{criticals} critical open</span>
      </div>

      <div className="pg-widget">
        <h2>Findings</h2>
        <div style={{ marginTop: 16 }}>
          {FINDINGS.map((f) => (
            <div key={f.id} style={{ padding: 12, borderBottom: '1px solid var(--pg-border)', display: 'grid', gridTemplateColumns: '80px 1fr 200px', gap: 12, alignItems: 'center' }}>
              <span className={`pg-status pg-status--${f.severity === 'critical' ? 'critical' : f.severity === 'warning' ? 'degraded' : 'healthy'}`}>
                {f.severity}
              </span>
              <div>
                <div style={{ color: 'var(--pg-text)', fontSize: 13 }}>{f.title}</div>
                <div style={{ color: 'var(--pg-text-muted)', fontSize: 11 }}>{f.id}</div>
              </div>
              <div>
                {/* PG-061: progressbar missing required aria attributes */}
                <div role="progressbar" style={{ width: '100%', height: 6, background: 'var(--pg-bg-elev)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${f.posture}%`, height: '100%', background: f.severity === 'critical' ? 'var(--pg-red)' : f.severity === 'warning' ? 'var(--pg-orange)' : 'var(--pg-cyan)' }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--pg-text-muted)', marginTop: 2 }}>Risk score {f.posture}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
