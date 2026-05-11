import MarketingHero from '../../../components/marketing/MarketingHero.jsx';
import FeatureGrid  from '../../../components/marketing/FeatureGrid.jsx';
import RatesTable   from '../../../components/marketing/RatesTable.jsx';
import FAQList      from '../../../components/marketing/FAQList.jsx';
import CTABanner    from '../../../components/marketing/CTABanner.jsx';

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
