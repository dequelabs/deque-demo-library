import { useState, useId } from 'react';
import MarketingHero from '../../components/marketing/MarketingHero.jsx';
import FeatureGrid  from '../../components/marketing/FeatureGrid.jsx';
import FAQList      from '../../components/marketing/FAQList.jsx';

export default function FintechHelp() {
  const [zip, setZip] = useState('');
  const filterId = useId();
  const filtered = zip
    ? BRANCHES.filter((b) => b.zip.startsWith(zip.trim()))
    : BRANCHES;

  return (
    <>
      <MarketingHero
        pill="Help & support"
        heading="We're here when you need us."
        subheading="Phone, secure messaging, branch — pick whichever fits the moment."
        ctas={[
          { label: 'Sign in to message us', to: '/fintech/login', variant: 'primary' },
          { label: 'See our FAQs',          href: '#faqs',         variant: 'outline' },
        ]}
        visual={<img src="/fintech-hero.svg" alt="" role="presentation" />}
      />

      <FeatureGrid
        heading="Three ways to reach us"
        alt
        features={[
          {
            title: 'Call us',
            body: '1-800-MERIDIAN. Fraud line is staffed 24/7. Other inquiries Mon–Fri 7am–10pm CT.',
          },
          {
            title: 'Secure message',
            body: 'Encrypted messaging is available inside online banking. Most replies come back within 4 business hours.',
            link: { label: 'Sign in to start a thread', to: '/fintech/login' },
          },
          {
            title: 'Visit a branch',
            body: 'Over 240 branches in 14 states. Most open Saturdays. Use the finder below to locate one near you.',
            link: { label: 'Find a branch', href: '#branches' },
          },
        ]}
      />

      <section id="branches" className="fintech-section" aria-labelledby="branches-heading">
        <h2 id="branches-heading" className="section-title">Find a branch</h2>
        <p className="section-sub">Filter by ZIP code to see your nearest branches.</p>

        <div className="container" style={{ maxWidth: 760, marginBottom: 16 }}>
          {/* PHASE-2 a11y issue MT-020 — see ACCESSIBILITY_ISSUES.md
              Was: a real <label htmlFor={filterId}>ZIP code</label> + <input ... placeholder="60607" />
              with implicit role=textbox + visible label.
              Now: role="searchbox" with NO <label>, NO aria-label, NO aria-labelledby,
              NO placeholder. Triggers axe-core `aria-input-field-name` (Moderate, WCAG 4.1.2). */}
          <div className="form-row" style={{ marginBottom: 0 }}>
            <input
              id={filterId}
              role="searchbox"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="postal-code"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </div>
        </div>

        <div className="container" style={{ maxWidth: 920 }}>
          <p role="status" aria-live="polite" className="muted" style={{ marginBottom: 12 }}>
            Showing {filtered.length} of {BRANCHES.length} branches
          </p>
          {filtered.length === 0 ? (
            <div className="empty-state card">No branches match that ZIP. Try a nearby code.</div>
          ) : (
            <ul className="branch-list">
              {filtered.map((b) => (
                <li key={b.id}>
                  <strong>{b.name}</strong>
                  <small>{b.address}</small>
                  <small>{b.city}, {b.state} {b.zip}</small>
                  <small style={{ marginTop: 6 }}>{b.hours}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <FAQList
        id="faqs"
        heading="Frequently asked questions"
        items={[
          { q: 'My card was lost or stolen — what now?', a: 'Sign in and lock the card immediately from the Cards page (instant). Then call 1-800-MERIDIAN to request a replacement (typically arrives in 3 business days; expedited shipping available).' },
          { q: 'How do I dispute a transaction?', a: 'You have 60 days to dispute most transactions. Open the transaction in online banking and select "Dispute," or call us. We\'ll typically credit your account within 1–2 business days while we investigate.' },
          { q: 'Can I add a joint account holder?', a: 'Yes. Both parties must complete a short verification — easiest in-branch, but available online for Personal Checking and Savings.' },
          { q: 'What\'s the daily transfer limit?', a: '$25,000 per account per day for online banking transfers. Higher limits are available for Wealth and Business customers.' },
          { q: 'How do I close an account?', a: 'Sign in and visit Profile → Close account, or call us. We\'ll mail any remaining balance as a cashier\'s check or transfer it to an external account on file.' },
        ]}
      />
    </>
  );
}

/* ----------- Branch data (sector-specific) ----------- */
const BRANCHES = [
  { id: 'b1', name: 'West Loop',     address: '142 Park Avenue',     city: 'Chicago',  state: 'IL', zip: '60607', hours: 'Mon–Fri 9–6 · Sat 9–1' },
  { id: 'b2', name: 'Lincoln Park',  address: '2200 N Clark St',     city: 'Chicago',  state: 'IL', zip: '60614', hours: 'Mon–Fri 9–6 · Sat 9–1' },
  { id: 'b3', name: 'Loop',          address: '300 S Wacker Dr',     city: 'Chicago',  state: 'IL', zip: '60606', hours: 'Mon–Fri 8–6' },
  { id: 'b4', name: 'Evanston',      address: '1620 Sherman Ave',    city: 'Evanston', state: 'IL', zip: '60201', hours: 'Mon–Fri 9–6 · Sat 9–1' },
  { id: 'b5', name: 'Madison Square',address: '8 W 23rd St',         city: 'New York', state: 'NY', zip: '10010', hours: 'Mon–Fri 8–7 · Sat 10–4' },
  { id: 'b6', name: 'Brooklyn Heights', address: '125 Court St',     city: 'Brooklyn', state: 'NY', zip: '11201', hours: 'Mon–Fri 9–6 · Sat 9–1' },
  { id: 'b7', name: 'Beacon Hill',   address: '40 Charles St',       city: 'Boston',   state: 'MA', zip: '02114', hours: 'Mon–Fri 9–6 · Sat 9–1' },
  { id: 'b8', name: 'Capitol Hill',  address: '720 Pine St',         city: 'Seattle',  state: 'WA', zip: '98101', hours: 'Mon–Fri 9–6' },
];
