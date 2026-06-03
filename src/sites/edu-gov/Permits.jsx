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
            <div className="form-row">
              <label htmlFor={`${formId}-line1`}>Project address (line 1)</label>
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
