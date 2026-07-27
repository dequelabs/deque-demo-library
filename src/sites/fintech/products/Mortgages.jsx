import { useState } from 'react';
import MarketingHero from '../../../components/marketing/MarketingHero.jsx';
import FeatureGrid  from '../../../components/marketing/FeatureGrid.jsx';
import RatesTable   from '../../../components/marketing/RatesTable.jsx';
import FAQList      from '../../../components/marketing/FAQList.jsx';
import CTABanner    from '../../../components/marketing/CTABanner.jsx';

export default function FintechMortgages() {
  const [panel, setPanel] = useState('rate');
  return (
    <>
      <MarketingHero
        pill="Personal · Mortgages"
        heading="Home loans that move at your pace."
        subheading="Pre-qualify in minutes, close in as little as 21 days. Conventional, FHA, VA, and jumbo loans — all under one roof."
        ctas={[
          { label: 'Get pre-qualified',  to: '/fintech/login', variant: 'primary' },
          { label: 'Talk to a loan officer', to: '/fintech/help', variant: 'outline' },
        ]}
        visual={<img src="/fintech-hero.svg" alt="" role="presentation" />}
      />

      <FeatureGrid
        heading="What we lend"
        subheading="Whatever your situation, there's a DQBC loan that fits."
        alt
        features={[
          { title: 'Conventional', body: '15-, 20-, and 30-year fixed. 5/6 and 7/6 ARMs. As low as 3% down for first-time buyers.' },
          { title: 'FHA',          body: 'Down payments as low as 3.5%. Flexible underwriting for buyers with limited credit history.' },
          { title: 'VA',           body: 'Zero down for eligible service members and veterans. We waive lender fees for active-duty applications.' },
          { title: 'Jumbo',        body: 'Loans up to $3M with relationship pricing for Wealth customers.' },
          { title: 'Refinance',    body: 'Rate-and-term, cash-out, and streamline refis. We\'ll show you the break-even before you commit.' },
          { title: 'HELOC',        body: 'Revolving line of credit secured by your home. Draw, repay, and re-draw for up to 10 years.' },
        ]}
      />

      <RatesTable
        heading="Today's sample rates"
        caption="Indicative mortgage rates by loan type"
        columns={['Loan', 'Rate', 'APR', 'Points']}
        rows={[
          ['30-year fixed (conforming)', '6.625%', '6.781%', '0.500'],
          ['15-year fixed',              '5.875%', '6.082%', '0.500'],
          ['7/6 ARM',                    '6.250%', '7.043%', '0.625'],
          ['FHA 30-year',                '6.500%', '7.221%', '0.500'],
          ['VA 30-year',                 '6.250%', '6.554%', '0.000'],
          ['Jumbo 30-year fixed',        '6.875%', '6.973%', '0.625'],
        ]}
        note="Illustrative rates assume excellent credit, owner-occupied, $400,000 loan amount. Your actual rate depends on credit, loan amount, LTV, and term. Rates change daily."
      />

      {/* PHASE-3 a11y issue MT-093 — see ACCESSIBILITY_ISSUES.md
          Branch-photo image showing a real DQBC branch (used as the
          "find a loan officer in person" visual) served with alt="" —
          treats informative content as decorative. axe-core `image-alt`
          has nothing to flag (an empty alt is valid syntax); axe DevTools
          Pro Advanced `image-informative-has-alt` (AI image classifier)
          recognizes the photo as informative and flags the empty alt —
          same pattern as MT-029. */}
      <div className="container text-center" style={{ maxWidth: 700, margin: '24px auto 0', padding: '0 24px' }}>
        <img src="/branch-photo.svg" alt="" style={{ width: 160, height: 80 }} />
        <p style={{ marginTop: 8, color: 'var(--text-secondary)' }}>
          Prefer to talk in person? Loan officers are available at every DQBC branch.
        </p>

        {/* PHASE-3 a11y issue MT-094 — see ACCESSIBILITY_ISSUES.md
            A segmented-control / TAB-look pair — two keyboard-focusable
            (tabIndex=0) spans with no `role="tab"` / `tablist` ancestor,
            no `aria-selected`. A third distinct interaction shape from
            MT-088 (link) and MT-090 (button): the Keyboard IGT's AI
            role-mismatch reasoning suggests `role="tab"` for each. Two
            tab stops instead of one — richer demo than a single link.
            axe-core `focus-order-semantics` fires Minor (BP, WCAG 2.4.3)
            on each; the automated Keyboard IGT's role-mismatch lens also
            catches both. */}
        <div style={{ display: 'inline-flex', gap: 4, borderBottom: '1px solid var(--border)' }}>
          <span
            tabIndex={0}
            onClick={() => setPanel('rate')}
            style={{
              padding: '6px 14px',
              cursor: 'pointer',
              fontWeight: panel === 'rate' ? 700 : 400,
              color: panel === 'rate' ? 'var(--brand-deep)' : 'var(--text-secondary)',
              borderBottom: panel === 'rate' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            }}
          >
            Rate lock terms
          </span>
          <span
            tabIndex={0}
            onClick={() => setPanel('lock')}
            style={{
              padding: '6px 14px',
              cursor: 'pointer',
              fontWeight: panel === 'lock' ? 700 : 400,
              color: panel === 'lock' ? 'var(--brand-deep)' : 'var(--text-secondary)',
              borderBottom: panel === 'lock' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            }}
          >
            Extended lock options
          </span>
          {/* PHASE-3 a11y issue MT-098 — see ACCESSIBILITY_ISSUES.md
              Icon-only help toggle with an explicit `role="button"` but no
              visible text, aria-label, aria-labelledby, or title (SVG is
              aria-hidden). axe-core `aria-command-name` fires Serious
              (WCAG 4.1.2) under the DEFAULT scan — same rule as MT-096 on
              Checking, second instance for broader demo coverage. */}
          <span
            role="button"
            tabIndex={0}
            onClick={() => alert('Help: coming soon.')}
            style={{ marginLeft: 6, alignSelf: 'center', cursor: 'pointer', display: 'inline-flex' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
        </div>
        <p style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
          {panel === 'rate'
            ? 'Lock your rate for 30, 45, or 60 days at no cost once you\'re under contract.'
            : 'Extended locks (up to 180 days) are available for new construction, for a small fee.'}
        </p>
      </div>

      <FAQList
        items={[
          { q: 'How long does pre-qualification take?', a: 'Pre-qualification is a soft pull and takes about 5 minutes. A formal pre-approval (with a hard pull and full document review) typically takes 1–3 business days.' },
          { q: 'What credit score do I need?', a: 'Conventional starts at 620. FHA starts at 580. VA has no minimum but most programs require 580+.' },
          { q: 'Do you sell my loan after closing?', a: 'Most loans are serviced by DQBC for the life of the loan. You\'ll always have a single point of contact, in the U.S.' },
          { q: 'Can I lock my rate?', a: 'Yes — for 30, 45, or 60 days at no cost. Longer locks are available for new construction.' },
          { q: 'How much will my payment be?', a: 'Sign in and use the in-app calculator, or call a loan officer for a written estimate that includes taxes and insurance.' },
        ]}
      />

      <CTABanner
        heading="Pre-qualify in five minutes"
        body="Soft pull only — no impact on your credit score."
        ctas={[
          { label: 'Get pre-qualified',  to: '/fintech/login', variant: 'primary' },
          { label: 'Talk to a loan officer', to: '/fintech/help', variant: 'outline' },
        ]}
        dark
      />
    </>
  );
}
