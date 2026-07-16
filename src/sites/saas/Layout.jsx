import { Outlet } from 'react-router-dom';
import { StoreProvider } from './store.jsx';
import './theme.css';

/**
 * Top-level Pulsegrid layout.
 * Wraps every /saas route in the store provider and applies the .sector-saas
 * theme scope (Datadog-inspired dark). Page chrome is rendered by the inner
 * PublicLayout (marketing) or AuthLayout (post-login product).
 */
export default function SaasLayout() {
  return (
    <div className="sector-saas">
      <StoreProvider>
        <Outlet />
      </StoreProvider>
    </div>
  );
}
