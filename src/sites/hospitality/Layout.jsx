import { Outlet } from 'react-router-dom';
import SiteSwitcher from '../../components/SiteSwitcher.jsx';
import './theme.css';

export default function HospitalityLayout() {
  return (
    <div className="sector-hospitality">
      <Outlet />
      <SiteSwitcher activeId="hospitality" />
    </div>
  );
}
