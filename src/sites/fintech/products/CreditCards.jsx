import { useState } from 'react';
import MarketingHero from '../../../components/marketing/MarketingHero.jsx';
import RatesTable   from '../../../components/marketing/RatesTable.jsx';
import FAQList      from '../../../components/marketing/FAQList.jsx';
import CTABanner    from '../../../components/marketing/CTABanner.jsx';

export default function FintechCreditCards() {
  const [remember, setRemember] = useState(false);
  return (
    <>
      <MarketingHero
        pill="Personal · Credit cards"
        heading="Credit cards that work for you, not against you."
        subheading="Three cards. No annual fees on two of them. Real cash back, real travel benefits, no fine print."
        ctas={[
          { label: 'Apply now',    to: '/fintech/login', variant: 'primary' },
          { label: 'Compare cards', href: '#compare',     variant: 'outline' },
        ]}
        visual={<img src="/fintech-hero.svg" alt="" role="presentation" />}
      />

      <section id="compare" className="fintech-section alt" aria-labelledby="compare-heading">
        <h2 id="compare-heading" className="section-title">Pick your card</h2>
        <p className="section-sub">All three earn rewards. None charge foreign transaction fees.</p>

        <div className="cards-grid" style={{ maxWidth: 1100, margin: '0 auto', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {CARDS.map((c) => (
            <article key={c.name} className="card" aria-labelledby={`card-${c.id}-h`}>
              <div className="card-visual" style={{ marginBottom: 16 }}>
                <span className="network">{c.tag}</span>
                <span className="number">{c.name}</span>
                <span className="exp">{c.tagline}</span>
              </div>
              <h3 id={`card-${c.id}-h`} style={{ margin: '0 0 6px' }}>{c.name}</h3>
              <p style={{ marginTop: 0, color: 'var(--text-secondary)', fontSize: 14 }}>{c.tagline}</p>
              <ul style={{ paddingLeft: 18, margin: '12px 0 16px', fontSize: 14, color: 'var(--text-secondary)' }}>
                {c.perks.map((p) => <li key={p} style={{ marginBottom: 4 }}>{p}</li>)}
              </ul>
              <div className="muted" style={{ fontSize: 12, marginBottom: 12 }}>
                Annual fee: <strong>{c.fee}</strong> · APR: <strong>{c.apr}</strong>
              </div>
              {/* PHASE-3 a11y issue MT-091 — see ACCESSIBILITY_ISSUES.md
                  .card-apply-btn strips the keyboard focus ring (theme.css)
                  with no replacement visual state. axe DevTools Pro
                  Advanced `css-focus-visible` (screenshot diff of
                  unfocused vs focused state) flags this — same pattern as
                  MT-010/MT-083. */}
              <a className="btn btn-primary btn-block card-apply-btn" href="/#/fintech/login">Apply</a>
            </article>
          ))}
        </div>
      </section>

      {/* PHASE-3 a11y issue MT-095 — see ACCESSIBILITY_ISSUES.md
          RatesTable's `id` prop reuses the page's existing anchor id
          "compare" (already used above on the card-grid <section id="compare">,
          targeted by the hero's "Compare cards" href="#compare"). RatesTable
          derives its own heading id as `${id}-heading` = "compare-heading" —
          identical to the card-grid section's own <h2 id="compare-heading">.
          Confirmed via Playwright DOM inspection: both "compare" and
          "compare-heading" genuinely render twice, and both sections'
          aria-labelledby reference the duplicated heading id — ambiguous
          which heading labels which region. axe-core `duplicate-id-aria`
          IS violated here (WCAG 4.1.1/4.1.2), but this rule ships with
          `reviewOnFail: true` in axe-core's config — confirmed by reading
          the rule definition directly — so it always surfaces as a
          **Needs Review** finding, never a confirmed violation, same
          bucket as MT-009. The axe MCP server's `analyze` tool only
          returns confirmed violations, so this genuinely won't appear in
          its output (verified: scanning this page returns empty) even
          though the defect is real — check the Needs Review panel in the
          axe DevTools extension instead. A realistic copy-paste mistake:
          a dev reused an anchor id for a new component without realizing
          it also drives an internal accessible-name id. */}
      <RatesTable
        id="compare"
        heading="Rates & fees"
        caption="Credit card rates and fees"
        columns={['Card', 'Annual fee', 'Purchase APR', 'Cash advance APR', 'Foreign tx fee']}
        rows={[
          ['Cash Back',  '$0',         '17.99%–24.99% variable', '29.99%', '$0'],
          ['Travel',     '$95',        '18.99%–25.99% variable', '29.99%', '$0'],
          ['Secured',    '$0',         '24.99% variable',         '29.99%', '$0'],
        ]}
        note="APRs vary based on creditworthiness and the Prime Rate. See your cardmember agreement for full terms."
      />

      {/* PHASE-3 a11y issue MT-092 — see ACCESSIBILITY_ISSUES.md
          Keyboard-focusable (tabIndex=0), clickable CHECKBOX look-alike
          (square box + checkmark) with no role at all — a different
          interaction model than MT-088/MT-090's link/button look-alikes,
          so the Keyboard IGT's AI role-mismatch reasoning suggests
          `role="checkbox"` here. axe-core `focus-order-semantics` fires
          Minor (BP, WCAG 2.4.3); the automated Keyboard IGT's
          role-mismatch lens also catches this. */}
      <div className="container" style={{ maxWidth: 700, margin: '24px auto 0', padding: '0 24px' }}>
        <div
          tabIndex={0}
          onClick={() => setRemember((v) => !v)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              border: '1px solid var(--border)',
              borderRadius: 3,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: remember ? 'var(--brand-primary)' : '#fff',
              color: '#fff',
              fontSize: 11,
              lineHeight: 1,
            }}
          >
            {remember ? '✓' : ''}
          </span>
          Remember my card choice for next time
        </div>
      </div>

      <FAQList
        items={[
          { q: 'Will applying hurt my credit?', a: 'You can pre-qualify with a soft pull — no impact on your score. A hard pull happens only if you proceed to a formal application.' },
          { q: 'When do rewards post?', a: 'Cash back and travel points post within 1–2 billing cycles after the qualifying purchase.' },
          { q: 'Can I lock my card if I lose it?', a: 'Yes — instantly from the Cards page after sign-in. Locked cards block new purchases but allow recurring bills you authorized.' },
          { q: 'What\'s the Secured card for?', a: 'It\'s designed for building or rebuilding credit. Your security deposit becomes your credit limit, and we report to all three bureaus monthly.' },
        ]}
      />

      <CTABanner
        heading="See if you pre-qualify"
        body="A soft pull, no impact on your credit score. Takes about 60 seconds."
        ctas={[{ label: 'Check pre-qualification', to: '/fintech/login', variant: 'primary' }]}
        dark
      />
    </>
  );
}

const CARDS = [
  {
    id: 'cb',
    name: 'Cash Back',
    tag: 'Most popular',
    tagline: '2% on everything. No category games.',
    perks: ['2% cash back on every purchase', '$200 sign-up bonus after $1,000 spend', 'No annual fee', 'No foreign transaction fees'],
    fee: '$0',
    apr: '17.99%–24.99%',
  },
  {
    id: 'tr',
    name: 'Travel',
    tag: 'For travelers',
    tagline: '3x points on travel. Lounge access included.',
    perks: ['3x points on travel & dining', '60,000-point sign-up bonus', 'Priority Pass lounge access', 'Trip cancellation insurance'],
    fee: '$95',
    apr: '18.99%–25.99%',
  },
  {
    id: 'sc',
    name: 'Secured',
    tag: 'Build credit',
    tagline: 'Build or rebuild your credit responsibly.',
    perks: ['Reports to all 3 bureaus monthly', 'Graduate to unsecured after 6–12 months', '1% cash back on all purchases', 'Refundable security deposit'],
    fee: '$0',
    apr: '24.99%',
  },
];
