import { useState, useId } from 'react';
import { useStore, actions } from './store.jsx';
import { fmtMoney } from './format.js';

export default function FintechCards() {
  const { state, dispatch } = useStore();

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Cards &amp; alerts</h1>
          <p className="subtitle">Lock cards instantly and adjust spending limits.</p>
        </div>
      </div>

      <div className="cards-grid">
        {state.cards.map((card) => (
          <CardItem key={card.id} card={card} dispatch={dispatch} />
        ))}
      </div>
    </>
  );
}

function CardItem({ card, dispatch }) {
  const limitInputId = useId();
  const [editingLimit, setEditingLimit] = useState(false);
  const [draftLimit, setDraftLimit] = useState(card.spendingLimit);
  const lockId = useId();

  const onSaveLimit = (e) => {
    e.preventDefault();
    const n = Number(draftLimit);
    if (!isNaN(n) && n >= 0) {
      dispatch(actions.setCardLimit(card.id, n));
      setEditingLimit(false);
    }
  };

  const subtype = card.type === 'debit' ? 'Debit' : 'Credit';

  return (
    <article className="card" aria-labelledby={`card-${card.id}-title`}>
      <h2 id={`card-${card.id}-title`} style={{ fontSize: 16, color: 'var(--brand-deep)', margin: '0 0 12px' }}>
        {subtype} card · {card.network} ··{card.last4}
        {card.locked && (
          <span className="locked-badge" style={{ marginLeft: 8, verticalAlign: 'middle' }}>Locked</span>
        )}
      </h2>

      <div className={'card-visual' + (card.locked ? ' is-locked' : '')}>
        <span className="network">{card.network} {subtype}</span>
        <span className="number" aria-label={`Card number ending in ${card.last4}`}>
          •••• •••• •••• {card.last4}
        </span>
        {/* PHASE-2 a11y issue MT-015 — see ACCESSIBILITY_ISSUES.md
            Was: cardholder name + EXP rendered with the default white-on-deep-gradient
            styling from `.card-visual` (passes contrast).
            Now: inline color: '#3d5476' on the cardholder + EXP row over the deep-blue
            gradient (#0a2540) — ratio ~2.6:1, well below the 4.5:1 AA threshold for
            normal text. Triggers axe-core `color-contrast` (Serious, WCAG 1.4.3).
            (Previously used #7a8595, but at ~5.9:1 against the deep brand background
            it actually passed and the rule didn't fire.) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#3d5476' }}>
          <span className="name">{card.nameOnCard}</span>
          <span className="exp">EXP {card.expISO.replace('-', '/')}</span>
        </div>
      </div>

      {card.type === 'credit' && (
        <p className="muted" style={{ marginTop: 12, fontSize: 13 }}>
          Current balance: {fmtMoney(card.creditBalance)} of {fmtMoney(card.creditLimit)}
        </p>
      )}

      <div className="card-controls" style={{ marginTop: 16 }}>
        {/* PHASE-2 a11y issue MT-014 — see ACCESSIBILITY_ISSUES.md
            Was: <label htmlFor={lockId}><input id={lockId} type="checkbox" checked={card.locked}
                  onChange={...} /> Lock this card</label>
            Now: <div role="switch"> with NO `aria-checked` and NO `aria-label`.
            Triggers axe-core `aria-required-attr` (Critical, WCAG 4.1.2) — a switch
            role requires aria-checked. Also commonly co-fires `aria-toggle-field-name`. */}
        <div
          id={lockId}
          role="switch"
          tabIndex={0}
          onClick={() => dispatch(actions.toggleCardLock(card.id))}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); dispatch(actions.toggleCardLock(card.id)); } }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 32, height: 18, borderRadius: 10, position: 'relative',
              background: card.locked ? 'var(--brand-primary)' : 'var(--border)',
              transition: 'background 120ms ease',
            }}
          >
            <span style={{
              position: 'absolute', top: 2, left: card.locked ? 16 : 2,
              width: 14, height: 14, borderRadius: '50%', background: '#fff',
              transition: 'left 120ms ease',
            }} />
          </span>
          {card.locked ? 'Card is locked' : 'Lock this card'}
        </div>
      </div>

      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid var(--border)' }} />

      {!editingLimit ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="muted" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Daily spending limit
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand-deep)' }}>
              {fmtMoney(card.spendingLimit)}
            </div>
          </div>
          <button type="button" className="btn btn-outline" onClick={() => setEditingLimit(true)}>
            Adjust
          </button>
        </div>
      ) : (
        <form onSubmit={onSaveLimit}>
          <div className="form-row">
            <label htmlFor={limitInputId}>Daily spending limit (USD)</label>
            <input
              id={limitInputId}
              type="number"
              min="0"
              step="50"
              value={draftLimit}
              onChange={(e) => setDraftLimit(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex gap-8">
            <button type="submit" className="btn btn-primary">Save limit</button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => { setDraftLimit(card.spendingLimit); setEditingLimit(false); }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </article>
  );
}
