// Sector metadata. Drives the landing page cards + footer site switcher.
export const SECTORS = [
  {
    id: 'fintech',
    name: 'DQBC · Deque Banking Corporation',
    tag: 'FinTech / Banking',
    blurb:
      'Online banking portal: marketing site, sign-in, account dashboard, transfers, bill pay, deposits, statements, cards, and profile.',
    accent: '#1a73e8',
    accentDeep: '#0a2540',
    path: '/fintech',
    status: 'ready',
  },
  {
    id: 'edu-gov',
    name: 'Northbrook Connect',
    tag: 'Education / Government (SLED)',
    blurb:
      'Citizen portal covering K-12 schools, public university, state services (DMV, benefits), and city services (permits, voter info) — one login across all of state government.',
    accent: '#16604b',
    accentDeep: '#0b2a23',
    path: '/edu-gov',
    status: 'ready',
  },
  {
    id: 'saas',
    name: 'Pulsegrid',
    tag: 'SaaS · Observability',
    blurb:
      'Datadog-inspired observability platform: marketing site, mock auth, and an interactive post-login product with metrics, services, alerts, hosts, logs, incidents, and security.',
    accent: '#6366f1',
    accentDeep: '#1e1b4b',
    path: '/saas',
    status: 'ready',
  },
  {
    id: 'agency',
    name: 'Foundry & Ash',
    tag: 'Creative Agency',
    blurb:
      'Portfolio site: hero with auto-play media, case studies, team grid, and contact form.',
    accent: '#ec4899',
    accentDeep: '#0a0a0a',
    path: '/agency',
    status: 'stub',
  },
  {
    id: 'hospitality',
    name: 'Cala Verde Resort',
    tag: 'Hospitality',
    blurb:
      'Boutique resort: room booking with date picker, room cards, amenities, and confirmation.',
    accent: '#d97757',
    accentDeep: '#3a1d12',
    path: '/hospitality',
    status: 'stub',
  },
];

export const sectorById = (id) => SECTORS.find((s) => s.id === id);
