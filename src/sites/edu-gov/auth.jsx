import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from './store.jsx';

/** Hook for components that need to know auth state. */
export function useAuth() {
  const { state, dispatch } = useStore();
  return {
    isAuthenticated: state.isAuthenticated,
    citizen: state.citizen,
    login: () => dispatch({ type: 'LOGIN' }),
    logout: () => dispatch({ type: 'LOGOUT' }),
  };
}

/** Wrap an authed-route element to bounce unauthenticated users to login. */
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/edu-gov/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}
