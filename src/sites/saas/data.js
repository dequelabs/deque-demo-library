/**
 * Pulsegrid demo data — fake observability platform.
 * Modeled loosely on Datadog + GoodData: services, hosts, alerts, metrics,
 * team members. All static — no back end, no external API calls.
 */

export const CURRENT_USER = {
  id: 'usr-001',
  firstName: 'Deke',
  lastName: 'Quinn',
  email: 'dq@deque.com',
  role: 'SRE Manager',
  team: 'Platform',
  avatarInitials: 'DQ',
};

export const ORGANIZATION = {
  name: 'Deque Systems',
  plan: 'Enterprise',
  seats: 84,
  region: 'us-east-1',
};

export const METRICS = [
  {
    id: 'apdex',
    label: 'Apdex Score',
    value: '0.94',
    delta: '+0.02',
    trend: 'up',
    sparkline: [0.88, 0.89, 0.91, 0.9, 0.92, 0.93, 0.94],
  },
  {
    id: 'errors',
    label: 'Error Rate',
    value: '0.13%',
    delta: '-0.04pp',
    trend: 'down',
    sparkline: [0.22, 0.21, 0.19, 0.18, 0.16, 0.14, 0.13],
  },
  {
    id: 'latency',
    label: 'p95 Latency',
    value: '312 ms',
    delta: '+18 ms',
    trend: 'up',
    sparkline: [280, 285, 290, 300, 305, 310, 312],
  },
  {
    id: 'saturation',
    label: 'CPU Saturation',
    value: '68%',
    delta: '+3pp',
    trend: 'up',
    sparkline: [55, 58, 60, 62, 65, 66, 68],
  },
];

export const SERVICES = [
  { id: 'svc-checkout', name: 'checkout-api', env: 'prod', requests: '1.2M', errors: 143, p95: 240, apdex: 0.96, status: 'healthy' },
  { id: 'svc-orders', name: 'orders-worker', env: 'prod', requests: '840k', errors: 12, p95: 92, apdex: 0.99, status: 'healthy' },
  { id: 'svc-search', name: 'search-frontend', env: 'prod', requests: '3.1M', errors: 502, p95: 410, apdex: 0.88, status: 'degraded' },
  { id: 'svc-billing', name: 'billing-svc', env: 'prod', requests: '92k', errors: 4, p95: 118, apdex: 0.98, status: 'healthy' },
  { id: 'svc-auth', name: 'auth-gateway', env: 'prod', requests: '4.6M', errors: 22, p95: 76, apdex: 0.99, status: 'healthy' },
  { id: 'svc-notify', name: 'notifications', env: 'prod', requests: '520k', errors: 88, p95: 280, apdex: 0.92, status: 'degraded' },
  { id: 'svc-media', name: 'media-cdn', env: 'prod', requests: '12M', errors: 2201, p95: 620, apdex: 0.71, status: 'critical' },
  { id: 'svc-analytics', name: 'analytics-ingest', env: 'prod', requests: '2.8M', errors: 41, p95: 195, apdex: 0.95, status: 'healthy' },
  { id: 'svc-mail', name: 'mail-relay', env: 'prod', requests: '180k', errors: 6, p95: 145, apdex: 0.97, status: 'healthy' },
  { id: 'svc-payments', name: 'payments-processor', env: 'prod', requests: '450k', errors: 18, p95: 210, apdex: 0.96, status: 'healthy' },
  // Non-prod entries so the Dashboard's "All envs / Prod" filter tabs
  // render differently — otherwise both tabs show the same 10 rows.
  { id: 'svc-checkout-stg', name: 'checkout-api', env: 'staging', requests: '84k',  errors: 3,  p95: 195, apdex: 0.98, status: 'healthy' },
  { id: 'svc-search-stg',   name: 'search-frontend', env: 'staging', requests: '120k', errors: 27, p95: 340, apdex: 0.91, status: 'degraded' },
  { id: 'svc-billing-dev',  name: 'billing-svc', env: 'dev', requests: '4.2k', errors: 0, p95: 88, apdex: 1.0, status: 'healthy' },
];

export const ALERTS = [
  { id: 'alrt-01', severity: 'critical', title: 'media-cdn p95 > 500ms for 10m', triggered: '2m ago', source: 'media-cdn', ack: false },
  { id: 'alrt-02', severity: 'warning',  title: 'search-frontend error rate > 0.5%', triggered: '17m ago', source: 'search-frontend', ack: false },
  { id: 'alrt-03', severity: 'warning',  title: 'notifications queue depth > 5k', triggered: '32m ago', source: 'notifications', ack: true },
  { id: 'alrt-04', severity: 'info',     title: 'auth-gateway deploy completed', triggered: '1h ago', source: 'auth-gateway', ack: true },
  { id: 'alrt-05', severity: 'info',     title: 'checkout-api throughput anomaly', triggered: '2h ago', source: 'checkout-api', ack: true },
];

export const HOSTS = Array.from({ length: 24 }, (_, i) => ({
  id: `host-${String(i + 1).padStart(3, '0')}`,
  region: ['us-east-1', 'us-west-2', 'eu-west-1'][i % 3],
  cpu: 20 + (i * 7) % 75,
  memory: 30 + (i * 11) % 60,
  status: i % 7 === 0 ? 'critical' : i % 4 === 0 ? 'warning' : 'healthy',
}));

export const TIME_RANGES = [
  { id: '15m', label: 'Past 15 minutes' },
  { id: '1h',  label: 'Past 1 hour' },
  { id: '4h',  label: 'Past 4 hours' },
  { id: '1d',  label: 'Past 1 day' },
  { id: '1w',  label: 'Past 1 week' },
  { id: '1M',  label: 'Past 1 month' },
];

/** Area-chart series: 24 points (~24 buckets over the selected range). */
export const AREA_SERIES = {
  requests: [420, 480, 510, 495, 520, 560, 590, 610, 640, 620, 660, 700, 740, 720, 690, 660, 630, 610, 640, 680, 710, 730, 700, 680],
  errors:   [ 12,  14,  11,  15,  18,  20,  17,  16,  19,  22,  20,  18,  17,  19,  21,  24,  22,  20,  18,  16,  15,  17,  16,  15],
};
