import { Link } from 'react-router-dom';

/**
 * Bottom-of-page CTA banner. Sector-agnostic.
 *
 * Props:
 *   heading, body, ctas (same shape as MarketingHero ctas), alt, dark
 */
export default function CTABanner({ heading, body, ctas = [], alt = false, dark = false, sectionClassName = 'fintech-section' }) {
  const style = dark
    ? {
        background: 'linear-gradient(135deg, var(--brand-deep), var(--brand-primary))',
        color: '#fff',
      }
    : undefined;
  return (
    <section className={sectionClassName + (alt ? ' alt' : '')} style={style}>
      <div className="container text-center" style={{ maxWidth: 700 }}>
        <h2 style={dark ? { color: '#fff' } : undefined}>{heading}</h2>
        {body && (
          <p
            className="muted"
            style={dark ? { color: 'rgba(255,255,255,0.92)' } : undefined}
          >
            {body}
          </p>
        )}
        {ctas.length > 0 && (
          <div className="flex gap-12 mt-24" style={{ justifyContent: 'center' }}>
            {ctas.map((cta, i) => (
              <Cta key={i} {...cta} dark={dark} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Cta({ label, to, href, variant = 'primary', dark }) {
  const cls =
    'btn ' +
    (variant === 'primary' ? 'btn-primary'
    : variant === 'outline' ? 'btn-outline'
    : variant === 'accent'  ? 'btn-accent btn-accent--accessible'
    : 'btn-outline');
  const darkOutlineStyle = dark && variant === 'outline'
    ? { background: 'transparent', borderColor: '#fff', color: '#fff' }
    : undefined;
  if (href) return <a className={cls} href={href} style={darkOutlineStyle}>{label}</a>;
  return <Link className={cls} to={to} style={darkOutlineStyle}>{label}</Link>;
}
