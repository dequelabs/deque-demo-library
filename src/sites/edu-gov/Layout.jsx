import { Outlet } from 'react-router-dom';
import SiteSwitcher from '../../components/SiteSwitcher.jsx';
import './theme.css';

export default function EduGovLayout() {
  return (
    <div className="sector-edugov">
      <Outlet />
      <SiteSwitcher activeId="edu-gov" />
    </div>
  );
}
