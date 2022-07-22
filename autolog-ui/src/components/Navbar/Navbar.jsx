import * as React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoImage from '../../assets/red-car.png';
import AuthContext from '../../contexts/auth';
import InventoryDropdown from '../InventoryDropdown/InventoryDropdown';
import './Navbar.css'

export default function Navbar({login}) {
  const {userContext, authContext} = useContext(AuthContext);
  const [user, setUser] = userContext;
  const [loginUser, registerUser, logoutUser] = authContext;

  // check on every render where the logo should redirect users to
  const logoRedirect = user?.email ? '/dashboard' : '/';

  return (
    <nav className='navbar'>
      {/* logo section */}
      <div className="section">
        <Link to={logoRedirect}>
          <img className='logo-image' src={logoImage} />
          <span className="logo-title">Autolog</span>
        </Link>
      </div>
      {/* auth and inventory dropdown section */}
      <div className="section">
        {/* Render buttons depending on whether user is logged in or not */}
        {(user?.email ?
        <>
          <InventoryDropdown/>
          <NavLink className={(isActive) => 'btn-log-out'} to={'/login'} onClick={() => logoutUser()}>
            Log Out
          </NavLink>
        </>
        :
        <>
          <Link to='/login'><span className='btn-log-in'>Log In</span></Link>
          <NavLink className={(isActive) => 'btn-sign-up'} to={'/register'}>
            Sign Up
          </NavLink>
        </>
        )}
      </div>
    </nav>
  )
}