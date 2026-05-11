/**
 * FAQ list using native <details>/<summary> for accessible disclosure.
 *
 * Props:
 *   heading    — section h2 (optional)
 *   subheading — paragraph (optional)
 *   items      — array of { q, a } where a can be string or JSX
 *   alt        — alt section background
 */
export default function FAQList({ heading, subheading, items = [], alt = true, sectionClassName = 'fintech-section' }) {
  const headingId = heading ? 'faq-' + Math.random().toString(36).slice(2, 7) : undefined;
  return (
    <section
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
