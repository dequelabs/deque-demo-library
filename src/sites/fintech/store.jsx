import { createContext, useContext, useEffect, useReducer } from 'react';
import { buildInitialState } from './data.js';

/**
 * DQBC client-side store.
 * Single source of truth for accounts, transactions, payees, cards, etc.
 * Persists to localStorage so a refresh during a demo doesn't reset anything.
 *
 * Use the `resetDemo` action to restore seed data.
 */

const STORAGE_KEY = 'dqbc-store-v1';

// ---------- helpers ----------
const nowISO = () => new Date().toISOString().slice(0, 10);
const genId = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

function loadFromStorage() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(state) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors etc. */
  }
}

// ---------- reducer ----------
function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };

    case 'LOGOUT':
      return { ...state, isAuthenticated: false };

    case 'TRANSFER': {
      const { fromId, toId, amount, memo } = action;
      const accounts = state.accounts.map((a) => {
        if (a.id === fromId) return { ...a, balance: +(a.balance - amount).toFixed(2) };
        if (a.id === toId)   return { ...a, balance: +(a.balance + amount).toFixed(2) };
        return a;
      });
      const fromAcc = state.accounts.find((a) => a.id === fromId);
      const toAcc   = state.accounts.find((a) => a.id === toId);
      const dateISO = nowISO();
      const debit = {
        id: genId('tx'),
        accountId: fromId,
        dateISO,
        merchant: `Transfer to ${toAcc.name}`,
        category: 'Transfer',
        amount: -Math.abs(amount),
        memo: memo || '',
      };
      const credit = {
        id: genId('tx'),
        accountId: toId,
        dateISO,
        merchant: `Transfer from ${fromAcc.name}`,
        category: 'Transfer',
        amount: +Math.abs(amount),
        memo: memo || '',
      };
      return {
        ...state,
        accounts,
        transactions: [debit, credit, ...state.transactions],
      };
    }

    case 'PAY_BILL': {
      const { payeeId, fromAccountId, amount, scheduleISO, memo } = action;
      const payee = state.payees.find((p) => p.id === payeeId);
      // If scheduled for today (or no date), debit immediately and create a tx.
      // Otherwise, queue it as a scheduledPayment.
      if (!scheduleISO || scheduleISO <= nowISO()) {
        const accounts = state.accounts.map((a) =>
          a.id === fromAccountId ? { ...a, balance: +(a.balance - amount).toFixed(2) } : a
        );
        const tx = {
          id: genId('tx'),
          accountId: fromAccountId,
          dateISO: nowISO(),
          merchant: payee ? payee.name : 'Bill payment',
          category: 'Bill pay',
          amount: -Math.abs(amount),
          memo: memo || '',
        };
        return {
          ...state,
          accounts,
          transactions: [tx, ...state.transactions],
        };
      }
      const sp = {
        id: genId('sp'),
        payeeId,
        fromAccountId,
        amount,
        scheduleISO,
        memo: memo || '',
        status: 'scheduled',
      };
      return { ...state, scheduledPayments: [sp, ...state.scheduledPayments] };
    }

    case 'CANCEL_SCHEDULED_PAYMENT':
      return {
        ...state,
        scheduledPayments: state.scheduledPayments.filter((p) => p.id !== action.id),
      };

    case 'ADD_PAYEE':
      return {
        ...state,
        payees: [
          ...state.payees,
          {
            id: genId('p'),
            name: action.name,
            accountNumber: action.accountNumber,
            category: action.category || 'Other',
          },
        ],
      };

    case 'REMOVE_PAYEE':
      return { ...state, payees: state.payees.filter((p) => p.id !== action.id) };

    case 'TOGGLE_CARD_LOCK':
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.id ? { ...c, locked: !c.locked } : c
        ),
      };

    case 'SET_CARD_LIMIT':
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.id ? { ...c, spendingLimit: action.limit } : c
        ),
      };

    case 'DEPOSIT_CHECK': {
      const { accountId, amount, memo } = action;
      const accounts = state.accounts.map((a) =>
        a.id === accountId ? { ...a, balance: +(a.balance + amount).toFixed(2) } : a
      );
      const tx = {
        id: genId('tx'),
        accountId,
        dateISO: nowISO(),
        merchant: 'Mobile check deposit',
        category: 'Deposit',
        amount: +Math.abs(amount),
        memo: memo || '',
      };
      return {
        ...state,
        accounts,
        transactions: [tx, ...state.transactions],
      };
    }

    case 'UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.updates } };

    case 'UPDATE_NOTIFICATIONS':
      return {
        ...state,
        user: {
          ...state.user,
          notifications: { ...state.user.notifications, ...action.updates },
        },
      };

    case 'RESET_DEMO':
      return { ...buildInitialState(), isAuthenticated: state.isAuthenticated };

    default:
      return state;
  }
}

// ---------- context ----------
const StoreContext = createContext(null);

export function DQBCStoreProvider({ children }) {
  const [state, dispatch] = useReducer(
    reducer,
    null,
    () => loadFromStorage() || buildInitialState()
  );

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside <DQBCStoreProvider>');
  }
  return ctx;
}

// ---------- typed action creators (sugar) ----------
export const actions = {
  login:                () =>                                            ({ type: 'LOGIN' }),
  logout:               () =>                                            ({ type: 'LOGOUT' }),
  transfer:             (fromId, toId, amount, memo) =>                  ({ type: 'TRANSFER', fromId, toId, amount, memo }),
  payBill:              (payeeId, fromAccountId, amount, scheduleISO, memo) =>
                                                                         ({ type: 'PAY_BILL', payeeId, fromAccountId, amount, scheduleISO, memo }),
  cancelScheduled:      (id) =>                                          ({ type: 'CANCEL_SCHEDULED_PAYMENT', id }),
  addPayee:             (name, accountNumber, category) =>               ({ type: 'ADD_PAYEE', name, accountNumber, category }),
  removePayee:          (id) =>                                          ({ type: 'REMOVE_PAYEE', id }),
  toggleCardLock:       (id) =>                                          ({ type: 'TOGGLE_CARD_LOCK', id }),
  setCardLimit:         (id, limit) =>                                   ({ type: 'SET_CARD_LIMIT', id, limit }),
  depositCheck:         (accountId, amount, memo) =>                     ({ type: 'DEPOSIT_CHECK', accountId, amount, memo }),
  updateProfile:        (updates) =>                                     ({ type: 'UPDATE_PROFILE', updates }),
  updateNotifications:  (updates) =>                                     ({ type: 'UPDATE_NOTIFICATIONS', updates }),
  resetDemo:            () =>                                            ({ type: 'RESET_DEMO' }),
};
