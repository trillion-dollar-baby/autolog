import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoImage from '../../assets/red-car.png';
import './Navbar.css'

export default function Navbar({login}) {

  //testing useState, remove this and check if user is logged in 

  return (
    <nav className='navbar'>
      <div className="section">
        <Link to='/dashboard'>
          <img className='logo-image' src={logoImage} />
          <span className="logo-title">Autolog</span>
        </Link>
      </div>
      <div className="section">
        {(login ?
        <>
          {/* TODO: create dropdown showing what inventories does the user has */}
          {/* TODO: create a function to log out the user and lead to landing page or login screen */}
          <NavLink className={(isActive) => 'btn-log-out'} to={'/'} onClick={() => setLogin(false)}>
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