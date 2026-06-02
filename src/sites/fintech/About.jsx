import MarketingHero from '../../components/marketing/MarketingHero.jsx';
import CTABanner from '../../components/marketing/CTABanner.jsx';

/**
 * /fintech/about — company story, leadership, and values.
 * Help/support and product copy live on their own pages.
 */
export default function FintechAbout() {
  return (
    <>
      <MarketingHero
        pill="About DQBC · Deque Banking Corporation"
        heading={<>A modern bank, built around your life.</>}
        subheading="Deque Banking Corporation — known as DQBC — combines a century of trust with mobile-first tools, fair pricing, and a team that treats your money the way you would."
        ctas={[
          { label: 'Sign in to online banking', to: '/fintech/login', variant: 'primary' },
          { label: 'See our products',          to: '/fintech',       variant: 'outline' },
        ]}
        visual={<img src="/fintech-hero.svg" alt="" role="presentation" />}
      />

      <section className="fintech-section alt" aria-labelledby="story-heading">
        <div className="container" style={{ maxWidth: 920 }}>
          <h2 id="story-heading" className="section-title">Our story</h2>
          <p className="section-sub">
            From a single Chicago branch in 1923 to 2.4 million customers nationwide.
          </p>

          <ol style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 720, marginInline: 'auto' }}>
            {STORY.map((m) => (
              <li key={m.year} className="card" style={{ marginBottom: 12, display: 'grid', gridTemplateColumns: '80px 1fr', gap: 16, alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: 22, color: 'var(--brand-deep)' }}>{m.year}</span>
                <span>{m.event}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="fintech-section" aria-labelledby="leaders-heading">
        <h2 id="leaders-heading" className="section-title">Leadership</h2>
        <p className="section-sub">The team shaping the next chapter.</p>

        {/* PHASE-2 a11y issue MT-019 — see ACCESSIBILITY_ISSUES.md
            Added: an empty <a href="#"></a> meant as a "share this story" link that was
            never wired up with text or an icon. Triggers axe-core `link-name`
            (Critical, WCAG 2.4.4). */}
        <p className="section-sub" style={{ marginTop: 0 }}>
          <a href="#" onClick={(e) => e.preventDefault()}></a>
        </p>

        <ul className="team-grid" style={{ listStyle: 'none' }}>
          {LEADERS.map((l) => (
            <li key={l.name} className="team-card">
              <div className="team-avatar" aria-hidden="true">
                {l.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <h3>{l.name}</h3>
              <p>{l.role}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="fintech-section alt" aria-labelledby="values-heading">
        <h2 id="values-heading" className="section-title">What we believe</h2>
        <p className="section-sub">Four ideas that guide every decision.</p>
        <div className="feature-grid">
          {VALUES.map((v) => (
            <article key={v.title} className="feature-card">
              <div className="feature-icon" aria-hidden="true" />
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </article>
          ))}
        </div>
      </section>

      <CTABanner
        heading="Ready to get started?"
        body="Open an account in under five minutes — no monthly fees, no minimums."
        ctas={[
          { label: 'Sign in',   to: '/fintech/login', variant: 'primary' },
          { label: 'Talk to us', to: '/fintech/help',  variant: 'outline' },
        ]}
        dark
      />
    </>
  );
}

/* ----------- Content (sector-specific; reusable shape) ----------- */

const STORY = [
  { year: 1923, event: 'Founded as DQBC Savings on Chicago\'s West Loop.' },
  { year: 1956, event: 'First federally-chartered branch network in the Midwest.' },
  { year: 1998, event: 'Online banking launched — among the first 50 U.S. banks.' },
  { year: 2014, event: 'Mobile-first redesign; same-day deposits become standard.' },
  { year: 2024, event: '2.4M customers, $48B in assets, top-rated app two years running.' },
];

const LEADERS = [
  { name: 'Marisol Reyes',    role: 'Chief Executive Officer' },
  { name: 'Devon Park',       role: 'Chief Operating Officer' },
  { name: 'Aisha Khan',       role: 'Chief Technology Officer' },
  { name: 'Jonas Berg',       role: 'Chief Risk Officer' },
];

const VALUES = [
  { title: 'Earned trust',  body: 'Every interaction is a chance to be the bank you tell a friend about.' },
  { title: 'Fair by default', body: 'No surprise fees, no minimums, no fine print designed to confuse.' },
  { title: 'Real humans',   body: 'You can reach a person — quickly — when something matters.' },
  { title: 'Built for everyone', body: 'Accessible, multilingual, and mobile-first from the ground up.' },
];
