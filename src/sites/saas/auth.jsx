import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from './store.jsx';

/**
 * Pulsegrid mock auth — same shape as fintech/auth.jsx.
 * ProtectedRoute redirects unauth users to /saas/login.
 */
export function useAuth() {
  const { state, dispatch } = useStore();
  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    signIn: () => dispatch({ type: 'signIn' }),
    signOut: () => dispatch({ type: 'signOut' }),
  };
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/saas/login" state={{ from: location }} replace />;
  }
  return children;
}
