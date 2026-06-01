import { Link } from 'react-router-dom';
import { handleHashClick } from './scrollToHash.js';

/**
 * Reusable marketing hero. Sector-agnostic.
 * Sectors style it via their own .marketing-hero / .fintech-hero CSS scope.
 *
 * Props:
 *   pill         — small badge label above the heading
 *   heading      — string or JSX for the h1
 *   subheading   — string or JSX for the supporting paragraph
 *   ctas         — array of { label, to, variant } where variant is "primary"|"outline"|"accent"|"ghost"
 *   visual       — optional element rendered in the right column (image, illustration, or null)
 *   className    — sector-scoped classes, e.g. "fintech-hero"
 *   visualClassName — sector class for the right column, e.g. "fintech-hero-visual"
 */
export default function MarketingHero({
  pill,
  heading,
  subheading,
  ctas = [],
  visual,
  className = 'fintech-hero',
  visualClassName = 'fintech-hero-visual',
  pillClassName = 'fintech-pill',
}) {
  return (
    <section className={className} aria-labelledby="marketing-hero-heading">
      <div>
        {pill && <span className={pillClassName}>{pill}</span>}
        <h1 id="marketing-hero-heading">{heading}</h1>
        {subheading && <p className="sub">{subheading}</p>}
        {ctas.length > 0 && (
          <div className="flex gap-12">
            {ctas.map((cta, i) => (
              <CtaLink key={i} {...cta} />
            ))}
          </div>
        )}
      </div>
      {visual && <div className={visualClassName}>{visual}</div>}
    </section>
  );
}

function CtaLink({ label, to, href, variant = 'primary' }) {
  const cls =
    'btn ' +
    (variant === 'primary' ? 'btn-primary'
    : variant === 'outline' ? 'btn-outline'
    : variant === 'accent'  ? 'btn-accent btn-accent--accessible'
    : 'btn-outline');
  if (href) {
    return <a className={cls} href={href} onClick={handleHashClick(href)}>{label}</a>;
  }
  return <Link className={cls} to={to}>{label}</Link>;
}
