import { Outlet } from 'react-router-dom';
import SiteSwitcher from '../../components/SiteSwitcher.jsx';
import './theme.css';

export default function SaasLayout() {
  return (
    <div className="sector-saas">
      <Outlet />
      <SiteSwitcher activeId="saas" />
    </div>
  );
}
