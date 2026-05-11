import { Outlet } from 'react-router-dom';
import SiteSwitcher from '../../components/SiteSwitcher.jsx';
import './theme.css';

export default function AgencyLayout() {
  return (
    <div className="sector-agency">
      <Outlet />
      <SiteSwitcher activeId="agency" />
    </div>
  );
}
