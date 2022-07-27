import * as React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SettingsMembers from '../SettingsMembers/SettingsMembers';
import SettingsUser from '../SettingsUser/SettingsUser';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import './Settings.css'

export default function Settings() {
  const location = useLocation();
  // options that we want for top navigation bar
  const settingsRoutes = [
    {
      name: 'user',
      to: './'
    },
    {
      name: 'members',
      to: './members'
    }
  ]

  return (
    <div className='settings'>
      {/* always render in page */}

      <div className="content">
        <Topbar routes={settingsRoutes} />

        <AnimatePresence>
          <Routes location={location} key={location.key}>
            <Route exact path='/' element={<SettingsUser />} />
            <Route exact path='/members' element={<SettingsMembers />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  )
}