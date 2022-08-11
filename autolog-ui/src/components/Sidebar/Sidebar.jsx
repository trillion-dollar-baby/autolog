import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

import dashboardIcon from '../../assets/dashboard.png';
import performanceIcon from '../../assets/pie-chart.png';
import inventoryIcon from '../../assets/icons8-warehouse.png';
import settingsIcon from '../../assets/icons8-info.png';


export default function Sidebar() {
  const location = useLocation();
  
  if (location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/' && location.pathname !== '/email-confirmation') {
    return (
      <div className='sidebar-empty'>
        <nav className="sidebar">
          <span className="title">
            General
          </span>
          <NavLink className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} to='/dashboard/'>
            <img className='icon' src={dashboardIcon} alt="icon" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} to='/performance/'>
            <img className='icon' src={performanceIcon} alt="icon" />
            <span>Performance</span>
          </NavLink>
          <NavLink className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} to='/inventory/'>
            <img className='icon' src={inventoryIcon} alt="icon" />
            <span>Inventory</span>
          </NavLink>
          <NavLink className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} to='/settings/'>
            <img className='icon' src={settingsIcon} alt="icon" />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>
    )
  }
}