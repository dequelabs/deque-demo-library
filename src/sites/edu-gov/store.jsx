import { createContext, useContext, useEffect, useReducer } from 'react';
import { buildInitialState } from './data.js';

/**
 * Northbrook Connect (NBC) client-side store.
 * Single source of truth for the citizen, their children, schools, vehicles,
 * benefits, permits, university courses, and enrollments.
 * Persists to localStorage so a refresh during a demo doesn't reset anything.
 *
 * Use the `resetDemo` action to restore seed data.
 */

const STORAGE_KEY = 'nbc-store-v1';

// ---------- helpers ----------
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

    case 'ENROLL_CHILD': {
      const { firstName, lastName, dob, grade, schoolId } = action;
      const child = {
        id: genId('kid'),
        firstName,
        lastName: lastName || state.citizen.lastName,
        dob,
        age: dob ? Math.max(0, new Date().getFullYear() - new Date(dob).getFullYear()) : null,
        grade,
        schoolId,
      };
      return {
        ...state,
        children: [...state.children, child],
        grades: { ...state.grades, [child.id]: [] },
      };
    }

    case 'RENEW_VEHICLE': {
      const { id, newExpiresISO } = action;
      return {
        ...state,
        vehicles: state.vehicles.map((v) =>
          v.id === id ? { ...v, registrationExpiresISO: newExpiresISO } : v
        ),
      };
    }

    case 'APPLY_BENEFIT': {
      const { program, household, notes } = action;
      const benefit = {
        id: genId('ben'),
        program,
        household: household || 1,
        notes: notes || '',
        status: 'submitted',
        submittedISO: new Date().toISOString().slice(0, 10),
      };
      return { ...state, benefits: [benefit, ...state.benefits] };
    }

    case 'REGISTER_VOTER':
      return { ...state, voterRegistered: true };

    case 'APPLY_PERMIT': {
      const { kind, address, details } = action;
      const permit = {
        id: genId('prm'),
        kind,
        address: address || '',
        details: details || '',
        status: 'pending',
        submittedISO: new Date().toISOString().slice(0, 10),
      };
      return { ...state, permits: [permit, ...state.permits] };
    }

    case 'REGISTER_COURSE': {
      const { courseId } = action;
      const course = state.courses.find((c) => c.id === courseId);
      if (!course) return state;
      if (state.enrollments.some((e) => e.courseId === courseId)) return state;
      if (course.enrolled >= course.capacity) return state;
      const enrollment = {
        id: genId('enr'),
        courseId,
        registeredISO: new Date().toISOString().slice(0, 10),
      };
      return {
        ...state,
        enrollments: [enrollment, ...state.enrollments],
        courses: state.courses.map((c) =>
          c.id === courseId ? { ...c, enrolled: c.enrolled + 1 } : c
        ),
      };
    }

    case 'DROP_COURSE': {
      const { courseId } = action;
      const isEnrolled = state.enrollments.some((e) => e.courseId === courseId);
      if (!isEnrolled) return state;
      return {
        ...state,
        enrollments: state.enrollments.filter((e) => e.courseId !== courseId),
        courses: state.courses.map((c) =>
          c.id === courseId ? { ...c, enrolled: Math.max(0, c.enrolled - 1) } : c
        ),
      };
    }

    case 'UPDATE_PROFILE':
      return { ...state, citizen: { ...state.citizen, ...action.updates } };

    case 'RESET_DEMO':
      return { ...buildInitialState(), isAuthenticated: state.isAuthenticated };

    default:
      return state;
  }
}

// ---------- context ----------
const StoreContext = createContext(null);

export function NBCStoreProvider({ children }) {
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
    throw new Error('useStore must be used inside <NBCStoreProvider>');
  }
  return ctx;
}

// ---------- typed action creators (sugar) ----------
export const actions = {
  login:            () =>                                              ({ type: 'LOGIN' }),
  logout:           () =>                                              ({ type: 'LOGOUT' }),
  enrollChild:      (firstName, lastName, dob, grade, schoolId) =>     ({ type: 'ENROLL_CHILD', firstName, lastName, dob, grade, schoolId }),
  renewVehicle:     (id, newExpiresISO) =>                             ({ type: 'RENEW_VEHICLE', id, newExpiresISO }),
  applyBenefit:     (program, household, notes) =>                     ({ type: 'APPLY_BENEFIT', program, household, notes }),
  registerVoter:    () =>                                              ({ type: 'REGISTER_VOTER' }),
  applyPermit:      (kind, address, details) =>                        ({ type: 'APPLY_PERMIT', kind, address, details }),
  registerCourse:   (courseId) =>                                      ({ type: 'REGISTER_COURSE', courseId }),
  dropCourse:       (courseId) =>                                      ({ type: 'DROP_COURSE', courseId }),
  updateProfile:    (updates) =>                                       ({ type: 'UPDATE_PROFILE', updates }),
  resetDemo:        () =>                                              ({ type: 'RESET_DEMO' }),
};
