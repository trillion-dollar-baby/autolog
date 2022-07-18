import * as React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'

export default function Sidebar() {
  return (
    <div className='sidebar-empty'>
      <nav className="sidebar">
        <span className="title">
          General
        </span>
        <NavLink className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} to='/dashboard/'>
          <img src="C:\Users\Enzo Falone\programming\autolog\autolog-ui\src\assets\dashboard.png" alt="icon" />
        <span>Dashboard</span>
        </NavLink>
        <NavLink className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} to='/performance/'>
          <span>Performance</span>
        </NavLink>
        <NavLink className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} to='/inventory/'>
          <span>Inventory</span>
        </NavLink>
        <NavLink className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} to='/settings/'>

          <span>Settings</span>

        </NavLink>
      </nav>
    </div>
  )
}