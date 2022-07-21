import './App.css'
import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
// components
import CreateItem from './components/CreateItem/CreateItem'
import Landing from './components/Landing/Landing.jsx'
import Login from './components/Login/Login'
import Registration from './components/Registration/Registration'
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Settings from './components/Settings/Settings';
import Dashboard from './components/Dashboard/Dashboard';
import Inventory from './components/Inventory/Inventory';
import NotFound from './components/NotFound/NotFound';
import Performance from './components/Performance/Performance'
import { useState } from 'react';
import { useContext } from 'react';
import AuthContext from './contexts/auth';
import CreateInventory from './components/CreateInventory/CreateInventory';
import RequireAuth from './components/RequireAuth/RequireAuth';

function App() {
  const {userContext} = useContext(AuthContext);
  const [user, setUser] = userContext;

  return (
    <div className="app">
      <BrowserRouter>
        {/* rendered in all paths */}
        <Navbar />

        <div className="page-content">
          <Sidebar login={user?.email}></Sidebar>

          <Routes>
            <Route path='/' element={<Landing />} />

            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Registration />} />

            {/* TODO: create authorized routes for routes below */}
            <Route path='/dashboard' element={<RequireAuth><Dashboard/></RequireAuth>} />
            <Route path='/inventory' element={<RequireAuth><Inventory /></RequireAuth>} />
            <Route path='/item/create' element={<RequireAuth><CreateItem /></RequireAuth>} />
            <Route path='/inventory/create' element={<RequireAuth><CreateInventory/></RequireAuth>} />
            <Route path='/performance' element={<RequireAuth><Performance /></RequireAuth>} />
            <Route path='/settings/*' element={<RequireAuth><Settings /></RequireAuth>} />

            {/* Not found error */}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
