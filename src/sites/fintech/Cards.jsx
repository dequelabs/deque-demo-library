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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
        <label
          htmlFor={lockId}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14 }}
        >
          <input
            id={lockId}
            type="checkbox"
            checked={card.locked}
            onChange={() => dispatch(actions.toggleCardLock(card.id))}
          />
          {card.locked ? 'Card is locked' : 'Lock this card'}
        </label>
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
