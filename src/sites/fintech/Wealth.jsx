import MarketingHero from '../../components/marketing/MarketingHero.jsx';
import FeatureGrid  from '../../components/marketing/FeatureGrid.jsx';
import RatesTable   from '../../components/marketing/RatesTable.jsx';
import FAQList      from '../../components/marketing/FAQList.jsx';
import CTABanner    from '../../components/marketing/CTABanner.jsx';

export default function FintechWealth() {
  return (
    <>
      <MarketingHero
        pill="Wealth"
        heading="Investing, retirement, and planning under one roof."
        subheading="Self-directed brokerage, managed portfolios, and human advice — at a price that respects compound interest."
        ctas={[
          { label: 'Schedule a planning call', to: '/fintech/help',  variant: 'primary' },
          { label: 'Open a brokerage',         to: '/fintech/login', variant: 'outline' },
        ]}
        visual={<img src="/fintech-hero.svg" alt="" role="presentation" />}
      />

      <FeatureGrid
        heading="Three ways to invest with DQBC"
        subheading="Pick the level of involvement that fits your life."
        alt
        features={[
          {
            title: 'Self-directed brokerage',
            body: 'Stocks, ETFs, and mutual funds with $0 commissions and no account minimums.',
            link: { label: 'Open a brokerage', to: '/fintech/login' },
          },
          {
            title: 'Managed portfolios',
            body: 'Automated, tax-loss-harvested portfolios from 0.25% per year. ESG and tax-aware variants available.',
            link: { label: 'Find your portfolio', to: '/fintech/login' },
          },
          {
            title: 'Wealth planning',
            body: 'Comprehensive planning with a human CFP — for retirement, estate, and tax strategy.',
            link: { label: 'Talk to a planner', to: '/fintech/help' },
          },
        ]}
      />

      <RatesTable
        heading="What it costs"
        subheading="Transparent pricing on every product."
        caption="Wealth product pricing"
        columns={['Product', 'Annual fee', 'Account minimum']}
        rows={[
          ['Self-directed brokerage',         '$0',                 '$0'        ],
          ['Managed portfolio (Standard)',    '0.25%',              '$1,000'    ],
          ['Managed portfolio (Tax-aware)',   '0.30%',              '$50,000'   ],
          ['Wealth planning + CFP',           '0.85% (incl. mgmt)', '$250,000'  ],
        ]}
        note="Trade execution fees may apply on certain products. Past performance does not guarantee future returns."
      />

      <FAQList
        heading="Wealth FAQs"
        items={[
          { q: 'Are my investments insured?', a: 'Brokerage assets are SIPC-insured up to $500,000 (including $250,000 cash). Bank deposits at DQBC are FDIC-insured separately.' },
          { q: 'Can I roll over a 401(k)?', a: 'Yes — IRAs, 401(k)s, 403(b)s, and most pension accounts. We handle the paperwork at no cost.' },
          { q: 'Do I need a planner to use managed portfolios?', a: 'No. Managed portfolios are self-service — answer a few questions, fund the account, and we handle the rest. A human CFP is included at the planning tier.' },
          { q: 'What if markets drop?', a: 'Tax-loss harvesting (where available) and an automatic rebalancing engine work to keep your portfolio aligned with your goals through volatility.' },
        ]}
      />

      <CTABanner
        heading="Plan your next decade"
        body="A 30-minute call with a CFP, free for prospective customers."
        ctas={[
          { label: 'Schedule a call', to: '/fintech/help',  variant: 'primary' },
          { label: 'Sign in',         to: '/fintech/login', variant: 'outline' },
        ]}
        dark
      />
    </>
  );
}
