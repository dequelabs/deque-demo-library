import MarketingHero from '../../../components/marketing/MarketingHero.jsx';
import FeatureGrid  from '../../../components/marketing/FeatureGrid.jsx';
import RatesTable   from '../../../components/marketing/RatesTable.jsx';
import FAQList      from '../../../components/marketing/FAQList.jsx';
import CTABanner    from '../../../components/marketing/CTABanner.jsx';

export default function FintechChecking() {
  return (
    <>
      <MarketingHero
        pill="Personal · Checking"
        heading="Everyday Checking. Built for everyday."
        subheading="No monthly fees, no minimums, and a debit card that works the way you do."
        ctas={[
          { label: 'Open Everyday Checking', to: '/fintech/login', variant: 'primary' },
          { label: 'Compare accounts',       to: '/fintech',       variant: 'outline' },
        ]}
        visual={<img src="/fintech-hero.svg" alt="" role="presentation" />}
      />

      <FeatureGrid
        heading="What you get"
        alt
        features={[
          { title: 'No monthly fees',        body: 'No minimums, no balance traps, no waiver gymnastics.' },
          { title: 'Early direct deposit',   body: 'Get paid up to two days early when payroll comes from a U.S. employer.' },
          { title: 'Fee-free ATM network',   body: 'Over 55,000 fee-free ATMs nationwide via the AllPoint network.' },
          { title: 'Mobile check deposit',   body: 'Snap a photo. Funds available next business day on most checks.' },
          { title: 'Real-time alerts',       body: 'Customizable alerts for swipes, large transactions, and low balances.' },
          { title: 'No overdraft fees',      body: 'Choose to be declined, link to savings, or use SafeOverdraft (no fee under $50).' },
        ]}
      />

      <RatesTable
        heading="Fees & limits"
        caption="Everyday Checking fees and limits"
        columns={['Item', 'Amount']}
        rows={[
          ['Monthly maintenance fee',   '$0'],
          ['Minimum opening deposit',   '$0'],
          ['Out-of-network ATM fee',    '$0 (DQBC) + ATM owner\'s fee'],
          ['Foreign transaction fee',   '$0'],
          ['Wire transfer (domestic)',  '$10 outgoing · $0 incoming'],
          ['Daily mobile-deposit limit','$5,000'],
          ['Daily ATM withdrawal limit','$1,000'],
        ]}
      />

      <FAQList
        items={[
          { q: 'Is there a minimum balance?', a: 'No. There are no balance minimums and no maintenance fees, ever.' },
          { q: 'How long does mobile deposit take to clear?', a: 'Most checks are available the next business day. Larger checks (>$5,000) may take 2 business days.' },
          { q: 'Can I use Apple Pay or Google Pay?', a: 'Yes. Add your debit card to either wallet directly from the Cards page after sign-in.' },
          { q: 'What if I overdraw?', a: 'Default behavior is to decline transactions that would overdraw. You can opt in to SafeOverdraft (no fee for overdrafts under $50, repaid within 7 days) on the Cards & alerts page.' },
        ]}
      />

      <CTABanner
        heading="Ready in five minutes"
        body="Open Everyday Checking online — no paperwork, no branch visit required."
        ctas={[{ label: 'Open Everyday Checking', to: '/fintech/login', variant: 'primary' }]}
        dark
      />
    </>
  );
}
