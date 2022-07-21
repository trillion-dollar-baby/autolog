import * as React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoImage from '../../assets/red-car.png';
import AuthContext from '../../contexts/auth';
import './Navbar.css'

export default function Navbar({login}) {
  const {userContext, authContext} = useContext(AuthContext);
  const [user, setUser] = userContext;
  const [loginUser, registerUser, logoutUser] = authContext;

  return (
    <nav className='navbar'>
      <div className="section">
        <Link to='/dashboard'>
          <img className='logo-image' src={logoImage} />
          <span className="logo-title">Autolog</span>
        </Link>
      </div>
      <div className="section">
        {(user?.email ?
        <>
          {/* TODO: create dropdown showing what inventories does the user has */}
          {/* TODO: create a function to log out the user and lead to landing page or login screen */}
          <NavLink className={(isActive) => 'btn-log-out'} to={'/login'} onClick={() => logoutUser()}>
            Log Out
          </NavLink>
        </>
        :
        <>
          <Link to='/login'>Login</Link>
          <NavLink className={(isActive) => 'btn-sign-up'} to={'/register'}>
            Sign Up
          </NavLink>
        </>
        )}
      </div>
    </nav>
  )
}