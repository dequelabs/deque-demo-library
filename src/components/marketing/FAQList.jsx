import { useId } from 'react';

/**
 * FAQ list using native <details>/<summary> for accessible disclosure.
 *
 * Props:
 *   id          — anchor id applied to the wrapping <section> (for in-page links)
 *   heading     — section h2 (optional)
 *   subheading  — paragraph (optional)
 *   items       — array of { q, a } where a can be string or JSX
 *   alt         — alt section background
 */
export default function FAQList({
  id,
  heading,
  subheading,
  items = [],
  alt = true,
  sectionClassName = 'fintech-section',
}) {
  const auto = useId();
  const headingId = heading ? (id ? `${id}-heading` : `faq-${auto}-heading`) : undefined;
  return (
    <section
      id={id}
      className={sectionClassName + (alt ? ' alt' : '')}
      aria-labelledby={heading ? headingId : undefined}
    >
      {heading && <h2 id={headingId} className="section-title">{heading}</h2>}
      {subheading && <p className="section-sub">{subheading}</p>}
      <div className="container" style={{ maxWidth: 760 }}>
        {items.map((it, i) => (
          <details key={i} className="faq-item">
            <summary>{it.q}</summary>
            <div className="faq-answer">{it.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
