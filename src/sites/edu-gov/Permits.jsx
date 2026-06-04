import { useState, useId } from 'react';
import { useStore, actions } from './store.jsx';

/**
 * City of Cedarbrook — building permit search & apply.
 * Top: search + filter chips. Cards for ~6 permit types. Inline apply form
 * below the cards. Active permits table at bottom from state.permits.
 */
const PERMIT_TYPES = [
  { id: 'building',    kind: 'Building',   name: 'Residential Building Permit',   fee: 245, turnaround: '10 business days' },
  { id: 'electrical',  kind: 'Electrical', name: 'Electrical Service Upgrade',    fee: 95,  turnaround: '5 business days' },
  { id: 'plumbing',    kind: 'Plumbing',   name: 'Plumbing Permit',               fee: 110, turnaround: '5 business days' },
  { id: 'demolition',  kind: 'Demolition', name: 'Demolition Permit',             fee: 320, turnaround: '15 business days' },
  { id: 'sign',        kind: 'Sign',       name: 'Business Sign Permit',          fee: 75,  turnaround: '7 business days' },
  { id: 'fence',       kind: 'Building',   name: 'Fence / Retaining Wall',        fee: 60,  turnaround: '3 business days' },
];

const CATEGORIES = ['Building', 'Electrical', 'Plumbing', 'Demolition', 'Sign'];

export default function Permits() {
  const { state, dispatch } = useStore();
  const formId = useId();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedType, setSelectedType] = useState(null);
  const [form, setForm] = useState({
    line1: state.citizen.address.line1,
    city: state.citizen.address.city,
    zip: state.citizen.address.zip,
    description: '',
    cost: '',
    startISO: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  // NB-IGT-013: confirmation dialog open state (see comment near submit).
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const filteredTypes = PERMIT_TYPES.filter((t) => {
    if (activeFilter !== 'all' && t.kind !== activeFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return t.name.toLowerCase().includes(q) || t.kind.toLowerCase().includes(q);
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.line1.trim() || !form.description.trim() || !form.startISO) {
      setError('Please complete the address, project description, and start date.');
      return;
    }
    const address = `${form.line1}, ${form.city} ${form.zip}`;
    const details = `${form.description}${form.cost ? ` · Est. cost $${form.cost}` : ''} · Start ${form.startISO}`;
    dispatch(actions.applyPermit(selectedType.kind, address, details));
    setSuccess(`Application for ${selectedType.name} submitted.`);
    setError('');
    setSelectedType(null);
    setForm((f) => ({ ...f, description: '', cost: '', startISO: '' }));
    // NB-IGT-013: open confirmation dialog (no focus management, no trap).
    setConfirmDialogOpen(true);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Building permits</h1>
          <p className="subtitle">Find the right permit type and apply online — City of Cedarbrook.</p>
        </div>
      </div>

      {success && (
        <div className="alert-success" role="status" style={{ maxWidth: 800 }}>
          {success}
        </div>
      )}

      {/* PHASE-2 a11y issue NB-IGT-013 (Modals IGT) — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          Confirmation dialog opened after submit. Renders a
          role="dialog" overlay WITHOUT initial-focus management (focus
          stays on the submitted button) and WITHOUT a focus trap (Tab
          escapes to the page behind). The Modals IGT verifies both
          focus-on-open and focus-trap behavior. */}
      {confirmDialogOpen && (
        <div
          role="dialog"
          aria-labelledby="permit-confirm-h"
          style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 16, zIndex: 50, maxWidth: 360, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
        >
          <h2 id="permit-confirm-h" style={{ margin: '0 0 8px', fontSize: 16 }}>Application received</h2>
          <p style={{ margin: '0 0 12px', fontSize: 13 }}>
            We will email you within 3 business days with next steps.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => setConfirmDialogOpen(false)}>
            OK
          </button>
        </div>
      )}

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="form-row" style={{ margin: 0 }}>
          <label htmlFor="permit-search">Find a permit type</label>
          <input
            id="permit-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. fence, electrical"
          />
        </div>
        {/* PHASE-2 a11y issue NB-160 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Unlabeled "Permit type" <select> with no label / aria-label.
            axe-core `select-name` fires Critical (WCAG 4.1.2). SLED
            pattern: permit-type filter selects ship without an
            accessible name. */}
        <select style={{ marginTop: 12 }}>
          <option>All permit types</option>
          <option>Building</option>
          <option>Electrical</option>
          <option>Plumbing</option>
        </select>

        {/* PHASE-2 a11y issue NB-161 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Icon-only "Save draft" button with NO accessible name.
            axe-core `button-name` fires Critical (WCAG 4.1.2). SLED
            pattern: permit-toolbar icons omit aria-label. */}
        <button type="button" style={{ background: 'none', border: '1px solid var(--border)', padding: 6, marginLeft: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
          </svg>
        </button>

        {/* PHASE-2 a11y issue NB-162 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Empty anchor (icon-only export link, no text, no aria-label).
            axe-core `link-name` fires Critical (WCAG 2.4.4). SLED
            pattern: export-icon links ship without a name. */}
        <a href="/permits/export" onClick={(e) => e.preventDefault()} style={{ marginLeft: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </a>

        {/* PHASE-2 a11y issue NB-163 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Zoning sparkline <svg role="img"> with NO <title>. axe-core
            `svg-img-alt` fires Serious (WCAG 1.1.1). SLED pattern:
            permit-volume sparkline trends ship without textual
            equivalents. */}
        <svg role="img" width="120" height="32" viewBox="0 0 120 32" style={{ verticalAlign: 'middle', marginLeft: 8 }}>
          <polyline points="0,24 20,18 40,20 60,10 80,12 100,6 120,8" fill="none" stroke="#0a66c2" strokeWidth="2" />
        </svg>

        {/* PHASE-2 a11y issue NB-164 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            `lang="latn"` is not a valid BCP-47 primary subtag. axe-core
            `valid-lang` fires Serious (WCAG 3.1.2). SLED pattern: Latin
            zoning terms tagged with bogus lang codes. */}
        <span lang="latn" style={{ fontSize: 12, marginLeft: 8 }}>Sui generis zoning</span>

        {/* PHASE-2 a11y issue NB-165 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Stray <dt> outside any <dl>. axe-core `dlitem` fires Serious
            (WCAG 1.3.1). SLED pattern: leftover dt from converted
            card. */}
        <dt style={{ display: 'none' }}>Zoning</dt>

        {/* PHASE-2 a11y issue NB-166 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Permit-volume <div role="meter"> with NO accessible name.
            axe-core `aria-meter-name` fires Critical (WCAG 1.1.1). SLED
            pattern: permit-office dashboards show queue volume as a bar
            without naming the meter. */}
        <div role="meter" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} style={{ height: 6, background: '#e5e7eb', maxWidth: 240, margin: '8px 0' }}>
          <div style={{ width: '60%', height: '100%', background: '#0a66c2' }} />
        </div>

        {/* PHASE-2 a11y issue NB-167 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            role="combobox" missing required aria-expanded. axe-core
            `aria-required-attr` fires Critical (WCAG 4.1.2). SLED
            pattern: custom comboboxes on permit forms omit required ARIA
            state. */}
        <div role="combobox" aria-controls="permits-listbox" style={{ display: 'none' }}>
          Filter
        </div>

        {/* PHASE-2 a11y issue NB-168 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            `aria-labeledby` is a typo of `aria-labelledby`. axe-core
            `aria-valid-attr` fires Critical (WCAG 4.1.2). SLED pattern:
            ARIA attribute misspellings survive code review. */}
        <div aria-labeledby="permit-search" style={{ display: 'none' }} />

        {/* PHASE-2 a11y issue NB-169 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Pale-taupe required-marker (#cdbf9f on #fff ~2.0:1). axe-core
            `color-contrast` fires Serious (WCAG 1.4.3). SLED pattern:
            required-field markers use brand-tint text on white. */}
        <p style={{ color: '#cdbf9f', background: '#ffffff', fontSize: 13, margin: '4px 0 0' }}>
          * Required field
        </p>

        {/* PHASE-2 a11y issue NB-170 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Review-stage <div role="progressbar"> with NO accessible
            name. axe-core `aria-progressbar-name` fires Serious (WCAG
            1.1.1). SLED pattern: multi-stage permit review progress is
            shown as a bar without naming. */}
        <div role="progressbar" aria-valuenow={2} aria-valuemin={0} aria-valuemax={5} style={{ height: 6, background: '#e5e7eb', maxWidth: 240, margin: '8px 0' }}>
          <div style={{ width: '40%', height: '100%', background: '#0a66c2' }} />
        </div>
        <div role="group" aria-label="Filter by category" style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button
            type="button"
            className={'btn ' + (activeFilter === 'all' ? 'btn-primary' : 'btn-outline')}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={'btn ' + (activeFilter === cat ? 'btn-primary' : 'btn-outline')}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
        {filteredTypes.map((t) => (
          <article key={t.id} className="card">
            <h2 style={{ fontSize: 16, margin: '0 0 4px', color: 'var(--brand-deep)' }}>{t.name}</h2>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-secondary)' }}>
              Typical fee: ${t.fee} · Turnaround: {t.turnaround}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { setSelectedType(t); setSuccess(''); }}
            >
              Apply
            </button>
          </article>
        ))}
        {filteredTypes.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>No permit types match your filters.</p>
        )}
      </div>

      {selectedType && (
        <div className="card" style={{ maxWidth: 720, marginBottom: 24 }} aria-labelledby={`${formId}-head`}>
          <h2 id={`${formId}-head`} style={{ margin: '0 0 12px', fontSize: 18, color: 'var(--brand-deep)' }}>
            Apply: {selectedType.name}
          </h2>

          {error && <div role="alert" className="alert-error">{error}</div>}

          <form onSubmit={submit} noValidate>
            {/* PHASE-2 a11y issue NB-003 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                Was: <label htmlFor={`${formId}-line1`}>Project address (line 1)</label>
                Replaced with a styled <span> that visually looks like a label
                but is not programmatically associated. The input has no
                aria-label, no aria-labelledby, no title, no placeholder. axe-core
                `label` fires Critical (WCAG 3.3.2 / 4.1.2). Classic SLED audit
                finding: long permit / records-request forms ship with a
                misformed label tag and screen-reader users hit a nameless
                required field. */}
            <div className="form-row">
              <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Project address (line 1)</span>
              <input
                id={`${formId}-line1`}
                type="text"
                value={form.line1}
                onChange={(e) => update('line1', e.target.value)}
                autoComplete="address-line1"
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div className="form-row">
                <label htmlFor={`${formId}-city`}>City</label>
                <input
                  id={`${formId}-city`}
                  type="text"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  autoComplete="address-level2"
                />
              </div>
              <div className="form-row">
                <label htmlFor={`${formId}-zip`}>ZIP</label>
                <input
                  id={`${formId}-zip`}
                  type="text"
                  value={form.zip}
                  onChange={(e) => update('zip', e.target.value)}
                  autoComplete="postal-code"
                />
              </div>
            </div>
            <div className="form-row">
              <label htmlFor={`${formId}-desc`}>Project description</label>
              <textarea
                id={`${formId}-desc`}
                rows={4}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Briefly describe the scope of work."
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* PHASE-2 a11y issue NB-171 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
                  `autoComplete="cost"` is not a valid WHATWG token.
                  axe-core `autocomplete-valid` fires Serious (WCAG
                  1.3.5). SLED pattern: permit/intake forms use invented
                  autocomplete tokens. */}
              <div className="form-row">
                <label htmlFor={`${formId}-cost`}>Estimated cost (USD)</label>
                <input
                  id={`${formId}-cost`}
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.cost}
                  onChange={(e) => update('cost', e.target.value)}
                  inputMode="decimal"
                  placeholder="e.g. 8500"
                  autoComplete="cost"
                />
              </div>
              <div className="form-row">
                <label htmlFor={`${formId}-start`}>Preferred start date</label>
                <input
                  id={`${formId}-start`}
                  type="date"
                  value={form.startISO}
                  onChange={(e) => update('startISO', e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <button type="button" className="btn btn-outline" onClick={() => setSelectedType(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Submit application</button>
            </div>
          </form>
        </div>
      )}

      <h2 style={{ fontSize: 18, margin: '0 0 12px', color: 'var(--brand-deep)' }}>
        Your active permits
      </h2>
      {state.permits.length === 0 ? (
        <div className="card">
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            You have no active permit applications.
          </p>
        </div>
      ) : (
        <table className="data-table">
          <caption>Permits filed with the City of Cedarbrook</caption>
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Address</th>
              <th scope="col">Status</th>
              <th scope="col">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {state.permits.map((p) => (
              <tr key={p.id}>
                <th scope="row" style={{ fontWeight: 600 }}>{p.kind}</th>
                <td>{p.address}</td>
                <td>{p.status}</td>
                <td>{p.submittedISO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
