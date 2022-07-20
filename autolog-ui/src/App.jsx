import './App.css'
import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
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
import CreateInventory from './components/CreateInventory/CreateInventory';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        {/* rendered in all paths */}
        <Navbar />

        <div className="page-content">
          <Sidebar />

          <Routes>
            <Route path='/' element={<Landing />} />

            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Registration />} />

            {/* TODO: create authorized routes for routes below */}
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/inventory' element={<Inventory />} />
            <Route path='/item/create' element={<CreateItem />} />
            <Route path='/inventory/create' element={<CreateInventory />} />
            <Route path='/performance' element={<Performance />} />
            <Route path='/settings/*' element={<Settings />} />

            {/* Not found error */}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
