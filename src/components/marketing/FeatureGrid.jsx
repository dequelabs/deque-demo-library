import { Link } from 'react-router-dom';

/**
 * Reusable feature/services grid. Sector-agnostic.
 *
 * Props:
 *   heading    — section h2 (optional)
 *   subheading — supporting paragraph (optional)
 *   features   — array of { title, body, link?: { label, to } }
 *   alt        — boolean, applies the .alt section background
 *   sectionClassName — class for the <section>, defaults to "fintech-section"
 *   columns    — 2 | 3 | 4, controls grid template (CSS-driven)
 *   id         — anchor id for in-page jumps
 */
export default function FeatureGrid({
  heading,
  subheading,
  features = [],
  alt = false,
  sectionClassName = 'fintech-section',
  id,
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      className={sectionClassName + (alt ? ' alt' : '')}
      aria-labelledby={heading && headingId ? headingId : undefined}
    >
      {heading && <h2 id={headingId} className="section-title">{heading}</h2>}
      {subheading && <p className="section-sub">{subheading}</p>}
      <div className="feature-grid">
        {features.map((f, i) => (
          <article key={i} className="feature-card">
            <div className="feature-icon" aria-hidden="true" />
            <h3>{f.title}</h3>
            <p>{f.body}</p>
            {f.link && (
              <p style={{ marginTop: 12, marginBottom: 0 }}>
                <Link to={f.link.to}>{f.link.label} →</Link>
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
