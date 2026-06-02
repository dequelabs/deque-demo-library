import { Link } from 'react-router-dom';
import MarketingHero from '../../components/marketing/MarketingHero.jsx';

/**
 * /fintech/legal — Terms, Privacy, Disclosures, Accessibility statement.
 * Each section is its own <section> with a stable id so deep links work.
 */
export default function FintechLegal() {
  return (
    <>
      <MarketingHero
        pill="Legal"
        heading="Legal & disclosures"
        subheading="The fine print, in plain English."
        ctas={[
          { label: 'Terms',                href: '#terms',         variant: 'outline' },
          { label: 'Privacy notice',       href: '#privacy',       variant: 'outline' },
          { label: 'Accessibility',        href: '#accessibility', variant: 'outline' },
        ]}
      />

      <div className="fintech-section">
        <div className="legal-stack">
          {/* PHASE-2 a11y issue MT-024 — see ACCESSIBILITY_ISSUES.md
              Added: TWO in-page anchors that both declare accessKey="t" — "Jump to
              Terms" and "Jump to Privacy". axe-core's `accesskeys` rule fires on
              duplicate accesskey values (the rule is about uniqueness, not the
              mere presence of an accesskey). Two anchors sharing "t" reliably
              triggers `accesskeys` (Serious, Best Practice). */}
          <p style={{ marginTop: 0, marginBottom: 16, fontSize: 14 }}>
            <a href="#terms" accessKey="t">Jump to Terms of service</a>
            {' · '}
            <a href="#privacy" accessKey="t">Jump to Privacy notice</a>
          </p>
          <section id="terms" aria-labelledby="terms-heading">
            <h2 id="terms-heading">Terms of service</h2>
            <p>
              By using DQBC online and mobile banking, you agree to our
              account agreements, which cover deposit accounts, electronic fund
              transfers, debit and credit cards, and online services.
            </p>
            <p>
              Standard provisions: you are responsible for safeguarding your
              credentials, transactions are subject to verification, and certain
              services may carry fees disclosed at the time of use. Disputes are
              handled per the dispute resolution provisions in your account
              agreement.
            </p>
            <p>
              Full agreement provided at account opening. Updates are posted with
              30 days' notice via secure message and email.
            </p>
          </section>

          <section id="privacy" aria-labelledby="privacy-heading">
            <h2 id="privacy-heading">Privacy notice</h2>
            <p>
              We collect information you provide (identity, contact, financial
              data) and information we generate from your account activity.
              We use it to operate the service, prevent fraud, comply with law,
              and improve products.
            </p>
            <p>
              We do not sell your personal information. We share it only with
              service providers under contract, with regulators when required,
              and with your explicit consent for any other purpose.
            </p>
            <p>
              You can request a copy of your data, ask us to correct it, or
              request deletion (subject to legal retention requirements) by
              contacting us at <strong>privacy@dqbc.example</strong>.
            </p>
          </section>

          <section id="disclosures" aria-labelledby="disclosures-heading">
            <h2 id="disclosures-heading">Disclosures</h2>
            <p>
              Deque Banking Corporation is a member of the FDIC. Standard insurance
              amount is $250,000 per depositor, per insured bank, for each
              account ownership category.
            </p>
            <p>
              Investment products offered through DQBC Wealth are{' '}
              <strong>not FDIC insured, not bank guaranteed, and may lose value</strong>.
              Past performance does not guarantee future results.
            </p>
            <p>
              Equal Housing Lender. NMLS #555555. Annual percentage yields (APY)
              are accurate as of the date shown and may change without notice.
            </p>
          </section>

          <section id="accessibility" aria-labelledby="a11y-heading">
            <h2 id="a11y-heading">Accessibility statement</h2>
            <p>
              DQBC is committed to making our products usable by everyone.
              We aim to conform with WCAG 2.2 AA across our website and mobile apps.
            </p>
            <p>
              If you have feedback, encounter a barrier, or need information in an
              alternate format, please contact us at{' '}
              <strong>accessibility@dqbc.example</strong> or 1-800-MERIDIAN.
              We aim to respond within two business days.
            </p>
            <p>
              <Link to="/fintech/help">Visit our Help &amp; support page</Link>{' '}
              for contact options.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
