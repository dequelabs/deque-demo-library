import MarketingHero from '../../../components/marketing/MarketingHero.jsx';
import FeatureGrid  from '../../../components/marketing/FeatureGrid.jsx';
import RatesTable   from '../../../components/marketing/RatesTable.jsx';
import FAQList      from '../../../components/marketing/FAQList.jsx';
import CTABanner    from '../../../components/marketing/CTABanner.jsx';

export default function FintechMortgages() {
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
