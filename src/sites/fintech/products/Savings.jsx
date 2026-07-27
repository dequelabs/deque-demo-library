import MarketingHero from '../../../components/marketing/MarketingHero.jsx';
import FeatureGrid  from '../../../components/marketing/FeatureGrid.jsx';
import RatesTable   from '../../../components/marketing/RatesTable.jsx';
import FAQList      from '../../../components/marketing/FAQList.jsx';
import CTABanner    from '../../../components/marketing/CTABanner.jsx';

function showCompoundingDetail() {
  alert('Compounding detail: coming soon.');
}

export default function FintechSavings() {
  return (
    <>
      <MarketingHero
        pill="Personal · Savings"
        heading="Smart Savings. 4.25% APY."
        subheading="One of the highest yields in U.S. banking — with FDIC insurance and no fees, no minimums."
        ctas={[
          { label: 'Open Smart Savings', to: '/fintech/login', variant: 'primary' },
          { label: 'See the math',       href: '#math',         variant: 'outline' },
        ]}
        visual={<img src="/fintech-hero.svg" alt="" role="presentation" />}
      />

      <FeatureGrid
        heading="Why people open Smart Savings"
        alt
        features={[
          { title: '4.25% APY',          body: 'Variable rate, compounded daily, paid monthly. No tiers — every dollar earns the same.' },
          { title: 'FDIC insured',       body: 'Up to $250,000 per depositor, per ownership category.' },
          { title: 'No fees, no minimums', body: 'No monthly fee, no minimum balance, no minimum opening deposit.' },
          { title: 'Automate everything', body: 'Round up purchases, set rules ("save $100 on payday"), and link goals to specific buckets.' },
          { title: 'Linked transfers',   body: 'Move money to and from Everyday Checking instantly. No hold periods.' },
          { title: 'Goals',              body: 'Track up to 10 savings goals (vacation, emergency fund, down payment) inside one account.' },
        ]}
      />

      <RatesTable
        id="math"
        heading="Rate & terms"
        caption="Smart Savings rate and terms"
        columns={['Item', 'Amount']}
        rows={[
          ['Annual percentage yield (APY)', '4.25%'],
          ['Minimum opening deposit',       '$0'],
          ['Monthly maintenance fee',       '$0'],
          ['Compounding',                   'Daily, paid monthly'],
          ['Maximum balance for stated APY', 'Unlimited'],
          ['Withdrawal limit',              '6 per statement cycle (Reg D)'],
        ]}
        note="APY accurate as of today and subject to change. Tiered rates do not apply — every dollar earns the same yield."
      />

      {/* PHASE-3 a11y issue MT-089 — see ACCESSIBILITY_ISSUES.md
          Pale-gold-to-white gradient banner with white text — passes at the
          gold end, fails at the white end. axe-core `color-contrast` can
          only return "Needs Review" because the background is a CSS
          gradient, not a single color. axe DevTools Pro Advanced
          `text-contrast` (screenshot-based) resolves it as an automatic
          Serious finding — same pattern as MT-028/041/053/060/078. */}
      <div
        className="container"
        style={{
          maxWidth: 700,
          margin: '24px auto 0',
          padding: '16px 24px',
          background: 'linear-gradient(90deg, var(--brand-accent), #ffffff)',
          borderRadius: 8,
          color: '#ffffff',
        }}
      >
        {/* PHASE-3 a11y issue MT-097 — see ACCESSIBILITY_ISSUES.md
            FDIC-insured shield/seal icon rendered as `<svg role="img">`
            with no `<title>`, no aria-label, no aria-labelledby. axe-core
            `svg-img-alt` fires Serious (WCAG 1.1.1) under the DEFAULT scan
            (no toggles needed) — same rule as MT-026 on Home, new instance
            here since the icon genuinely conveys "FDIC insured" meaning,
            not just decoration. */}
        <svg
          role="img"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ verticalAlign: 'middle', marginRight: 6 }}
        >
          <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" />
        </svg>
        Every dollar compounds daily — see exactly how in the math above.{' '}
        {/* PHASE-3 a11y issue MT-090 — see ACCESSIBILITY_ISSUES.md
            Keyboard-focusable (tabIndex=0), clickable span styled as a
            solid pill BUTTON (background fill, no underline) but with no
            button/link role. Deliberately a different visual shape than
            MT-088's underlined-text link look, so the Keyboard IGT's AI
            role-mismatch reasoning suggests `role="button"` here instead
            of `role="link"`. axe-core `focus-order-semantics` fires Minor
            (BP, WCAG 2.4.3); the automated Keyboard IGT's role-mismatch
            lens also catches this. */}
        <span
          tabIndex={0}
          onClick={showCompoundingDetail}
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            background: '#ffffff',
            color: 'var(--brand-deep)',
            borderRadius: 999,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          See a compounding example
        </span>
      </div>

      <FAQList
        items={[
          { q: 'Is the rate fixed?', a: 'No. The rate is variable and can change at any time. Historically DQBC has stayed near the top of national savings rates.' },
          { q: 'How fast can I move money in and out?', a: 'Transfers between DQBC Checking and Smart Savings are instant. External transfers take 1–3 business days depending on the source.' },
          { q: 'Are there transaction limits?', a: 'Federal regulation limits savings withdrawals to 6 per statement cycle. ATM withdrawals from a linked checking are unlimited.' },
          { q: 'Can I have multiple savings accounts?', a: 'Yes. You can open multiple Smart Savings accounts (each independently FDIC-insured up to limits) for different goals.' },
        ]}
      />

      <CTABanner
        heading="Start earning 4.25% today"
        body="Smart Savings opens in under five minutes from your phone."
        ctas={[{ label: 'Open Smart Savings', to: '/fintech/login', variant: 'primary' }]}
        dark
      />
    </>
  );
}
