import { createContext, useContext, useMemo, useReducer, useEffect } from 'react';
import { CURRENT_USER, ORGANIZATION, METRICS, SERVICES, ALERTS, HOSTS, TIME_RANGES, AREA_SERIES } from './data.js';

const KEY = 'pulsegrid-store-v1';

const initial = {
  user: CURRENT_USER,
  organization: ORGANIZATION,
  metrics: METRICS,
  services: SERVICES,
  alerts: ALERTS,
  hosts: HOSTS,
  areaSeries: AREA_SERIES,
  timeRange: '1h',
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'signIn':
      return { ...state, isAuthenticated: true };
    case 'signOut':
      return { ...state, isAuthenticated: false };
    case 'setTimeRange':
      return { ...state, timeRange: action.payload };
    case 'ackAlert':
      return {
        ...state,
        alerts: state.alerts.map((a) => (a.id === action.payload ? { ...a, ack: true } : a)),
      };
    default:
      return state;
  }
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ isAuthenticated: state.isAuthenticated, timeRange: state.timeRange }));
    } catch {
      /* localStorage disabled — fine, session-only */
    }
  }, [state.isAuthenticated, state.timeRange]);

  const value = useMemo(() => ({ state, dispatch, timeRanges: TIME_RANGES }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
