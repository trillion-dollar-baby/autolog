import * as React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'

export default function Sidebar() {
  return (
    <nav className='sidebar'>
      <span className="sidebar title">
        General
      </span>
      <NavLink className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`} to='/dashboard/'>Dashboard</NavLink>
      <NavLink className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`} to='/performance/'>Performance</NavLink>
      <NavLink className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`} to='/inventory/'>Inventory</NavLink>
      <NavLink className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`} to='/settings/'>
        
        <span>Settings</span>

      </NavLink>
      
    </nav>
  )
}