import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoImage from '../../assets/red-car.png';
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className='navbar'>
      <div className="section">
        <Link to='/dashboard'>
          <img className='logo-image' src={logoImage} />
          <span className="logo-title">Autolog</span>
        </Link>
      </div>
      <div className="section">
        {/* TODO: create a function to log out the user and lead to landing page or login screen */}
        <NavLink className={(isActive) => { return 'btn-log-out' }} to={'/'} onClick={undefined}>
          Log Out
        </NavLink>
      </div>
    </nav>
  )
}