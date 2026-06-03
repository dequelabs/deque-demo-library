import { Outlet } from 'react-router-dom';
import { NBCStoreProvider } from './store.jsx';
import './theme.css';

/**
 * Top-level Northbrook Connect layout.
 * Wraps every NBC route in the store provider and applies the .sector-edu-gov
 * theme scope. The actual page chrome (public header vs. authed sidebar) is
 * rendered by the inner layouts (PublicLayout / AuthLayout).
 */
export default function EduGovLayout() {
  return (
    <div className="sector-edu-gov">
      <NBCStoreProvider>
        <Outlet />
      </NBCStoreProvider>
    </div>
  );
}
