import MarketingHero from '../../../components/marketing/MarketingHero.jsx';
import FeatureGrid  from '../../../components/marketing/FeatureGrid.jsx';
import RatesTable   from '../../../components/marketing/RatesTable.jsx';
import FAQList      from '../../../components/marketing/FAQList.jsx';
import CTABanner    from '../../../components/marketing/CTABanner.jsx';

function showFeeGlossary() {
  alert('Fee glossary: coming soon.');
}

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

      {/* PHASE-3 a11y issue MT-087 — see ACCESSIBILITY_ISSUES.md
          "Not sure which fee applies?" reads visually as a section heading
          (20px / 700 / brand-deep, own line above body copy) but is a plain
          <div> — no heading role in the document outline. axe DevTools Pro
          Advanced `heading-markup` (CV/AI classifier) flags this; the
          axe-core baseline has no automatic equivalent. */}
      <div className="container" style={{ maxWidth: 700, margin: '24px auto 0', padding: '0 24px' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--brand-deep)', marginBottom: 8 }}>
          Not sure which fee applies?
        </div>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          Most customers pay $0 in monthly fees.{' '}
          {/* PHASE-3 a11y issue MT-088 — see ACCESSIBILITY_ISSUES.md
              "See full fee glossary" is keyboard-focusable (tabIndex=0) and
              clickable, but has no button/link role — a sighted mouse user
              reads it as a link (blue, underlined) with no semantic backing.
              axe-core `focus-order-semantics` fires Minor (BP, WCAG 2.4.3).
              The automated Keyboard IGT also classifies it (role-mismatch
              lens) the same way it caught MT-086 on Home. */}
          <span
            tabIndex={0}
            onClick={showFeeGlossary}
            style={{ color: 'var(--brand-primary)', textDecoration: 'underline', cursor: 'pointer' }}
          >
            See full fee glossary
          </span>
          {/* PHASE-3 a11y issue MT-096 — see ACCESSIBILITY_ISSUES.md
              Icon-only info toggle implemented with an explicit
              `role="button"` (so it already has an interactive role,
              distinguishing it from MT-088's role-mismatch pattern) but no
              visible text, aria-label, aria-labelledby, or title — the SVG
              is aria-hidden. axe-core `aria-command-name` fires Serious
              (WCAG 4.1.2) under the DEFAULT scan (no toggles needed). Not
              yet used anywhere else in the catalog — button-name/link-name
              cover native `<button>`/`<a>` elements, aria-command-name
              covers the ARIA-role equivalent. */}
          <span
            role="button"
            tabIndex={0}
            onClick={showFeeGlossary}
            style={{ marginLeft: 6, cursor: 'pointer', display: 'inline-flex' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </span>
        </p>
      </div>

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
