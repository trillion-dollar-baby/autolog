import './App.css'
import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useContext, useLocation } from 'react';
import {AnimatePresence} from 'framer-motion';
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
import Orders from './components/Orders/Orders';
import NotFound from './components/NotFound/NotFound';
import Performance from './components/Performance/Performance'
import CreateInventory from './components/CreateInventory/CreateInventory';
import RequireAuth from './components/RequireAuth/RequireAuth';
import ItemDetail from './components/ItemDetail/ItemDetail';
import EmailConfirmation from './components/EmailConfirmation/EmailConfirmation';
import CreateInvoice from './components/CreateInvoice/CreateInvoice';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        {/* rendered in all paths */}
        <Navbar />

        <div className="page-content">
          <Sidebar></Sidebar>
          <AnimatePresence>
          <Routes >
            <Route path='/' element={<Landing />} />

            <Route path='/email-confirmation' element={<EmailConfirmation />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Registration />} />
            

            {/* Routes for only logged in users */}
            <Route path='/dashboard' element={<RequireAuth><Dashboard/></RequireAuth>} />
            <Route path='/inventory' element={<RequireAuth><Inventory /></RequireAuth>} />
            <Route path='/invoice/create' element={<RequireAuth><CreateInvoice /></RequireAuth>} />
            <Route path='/purchase/create' element={<RequireAuth><CreateInvoice /></RequireAuth>} />
            <Route path='/purchase/' element={<RequireAuth><CreateInvoice /></RequireAuth>} />
            <Route path='/invoice/' element={<RequireAuth><CreateInvoice /></RequireAuth>} />
            <Route path='/item/create' element={<RequireAuth><CreateItem /></RequireAuth>} />
            <Route path='/item/id/:itemId' element={<RequireAuth><ItemDetail/></RequireAuth>}/>
            <Route path='/inventory/create' element={<RequireAuth><CreateInventory/></RequireAuth>} />
            <Route path='/performance' element={<RequireAuth><Performance /></RequireAuth>} />
            <Route path='/settings/*' element={<RequireAuth><Settings /></RequireAuth>} />

            {/* Not found error */}
            <Route path='*' element={<NotFound />} />
          </Routes>
          </AnimatePresence>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
