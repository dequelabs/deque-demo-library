import { Outlet } from 'react-router-dom';
import { DQBCStoreProvider } from './store.jsx';
import './theme.css';

/**
 * Top-level FinTech layout.
 * Wraps every DQBC route in the store provider and applies the .sector-fintech
 * theme scope. The actual page chrome (public header vs. authed sidebar) is
 * rendered by the inner layouts (PublicLayout / AuthLayout).
 */
export default function FintechLayout() {
  return (
    <div className="sector-fintech">
      <DQBCStoreProvider>
        <Outlet />
      </DQBCStoreProvider>
    </div>
  );
}
