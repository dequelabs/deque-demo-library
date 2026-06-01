import { useId } from 'react';

/**
 * Rates / fees / pricing table. Sector-agnostic.
 *
 * Props:
 *   id          — anchor id applied to the wrapping <section> (for in-page links)
 *   heading     — section h2 (optional)
 *   subheading  — paragraph (optional)
 *   caption     — accessible <caption> for the table (visually hidden)
 *   columns     — array of column header strings
 *   rows        — array of arrays (cells)
 *   alt         — alt section background
 *   note        — small footnote below the table
 */
export default function RatesTable({
  id,
  heading,
  subheading,
  caption,
  columns,
  rows,
  alt = false,
  note,
  sectionClassName = 'fintech-section',
}) {
  const auto = useId();
  const headingId = heading ? (id ? `${id}-heading` : `rates-${auto}-heading`) : undefined;
  const visuallyHidden = {
    position: 'absolute',
    width: 1, height: 1, padding: 0, margin: -1,
    overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
  };
  return (
    <section
      id={id}
      className={sectionClassName + (alt ? ' alt' : '')}
      aria-labelledby={heading ? headingId : undefined}
    >
      {heading && <h2 id={headingId} className="section-title">{heading}</h2>}
      {subheading && <p className="section-sub">{subheading}</p>}
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <table className="data-table">
          {caption && <caption style={visuallyHidden}>{caption}</caption>}
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={i} scope="col">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((cell, j) => (
                  j === 0
                    ? <th key={j} scope="row">{cell}</th>
                    : <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {note && (
          <p className="muted" style={{ fontSize: 13, marginTop: 12, textAlign: 'center' }}>
            {note}
          </p>
        )}
      </div>
    </section>
  );
}
