import MarketingHero from '../../components/marketing/MarketingHero.jsx';
import FeatureGrid  from '../../components/marketing/FeatureGrid.jsx';
import RatesTable   from '../../components/marketing/RatesTable.jsx';
import FAQList      from '../../components/marketing/FAQList.jsx';
import CTABanner    from '../../components/marketing/CTABanner.jsx';

export default function FintechBusiness() {
  return (
    <>
      <MarketingHero
        pill="Business"
        heading="Banking that scales with your business."
        subheading="From your first invoice to your 500th employee — checking, lending, and treasury services that grow with you."
        ctas={[
          { label: 'Open a business account', to: '/fintech/login',  variant: 'primary' },
          { label: 'Talk to a banker',        to: '/fintech/help',   variant: 'outline' },
        ]}
        visual={<img src="/fintech-hero.svg" alt="" role="presentation" />}
      />

      <FeatureGrid
        id="services"
        heading="Three pillars, one relationship"
        subheading="Designed to work together — or à la carte."
        alt
        features={[
          {
            title: 'Business checking',
            body: 'No monthly fees, unlimited transactions, integrated payroll, and same-day ACH.',
            link: { label: 'Open business checking', to: '/fintech/login' },
          },
          {
            title: 'Lending',
            body: 'Lines of credit, term loans, and SBA-preferred lending with decisions in days, not weeks.',
            link: { label: 'Apply for credit', to: '/fintech/help' },
          },
          {
            title: 'Treasury management',
            body: 'Cash flow tools, sweep accounts, fraud monitoring, and a dedicated relationship team.',
            link: { label: 'Schedule a treasury review', to: '/fintech/help' },
          },
        ]}
      />

      <RatesTable
        heading="Business checking at a glance"
        subheading="The same fair pricing that won us 2.4M personal customers."
        caption="Business checking fees and limits"
        columns={['Tier', 'Monthly fee', 'Free transactions', 'Cash deposit limit']}
        rows={[
          ['Starter',  '$0',  '200/mo', '$5,000/mo'],
          ['Growth',   '$0*', '500/mo', '$25,000/mo'],
          ['Scale',    '$25', 'Unlimited', '$100,000/mo'],
        ]}
        note="* $0 with $10,000 average daily balance. Otherwise $15/month."
      />

      <FAQList
        heading="Business banking FAQs"
        items={[
          { q: 'Can I open a business account online?', a: 'Yes — Starter and Growth tiers can be opened online in 10–15 minutes. Scale tier requires a brief call with a relationship banker.' },
          { q: 'Do you support QuickBooks and Xero?', a: 'Yes, with read-only and read-write integrations available. ACH initiation from Xero is supported on Growth and Scale tiers.' },
          { q: 'What documents do I need?', a: 'EIN letter, formation documents (articles of incorporation, operating agreement, or partnership agreement), and government-issued ID for each beneficial owner.' },
          { q: 'How quickly can I get a credit decision?', a: 'Lines of credit under $250,000 typically return a decision within 2 business days. Larger facilities take 5–10 days.' },
        ]}
      />

      <CTABanner
        heading="Let's talk"
        body="Tell us about your business and we'll match you with a banker who knows your industry."
        ctas={[
          { label: 'Schedule a consultation', to: '/fintech/help', variant: 'primary' },
          { label: 'Sign in',                 to: '/fintech/login', variant: 'outline' },
        ]}
        dark
      />
    </>
  );
}
