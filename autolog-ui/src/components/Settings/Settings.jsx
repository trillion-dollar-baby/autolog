import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import SettingsMembers from '../SettingsMembers/SettingsMembers';
import SettingsUser from '../SettingsUser/SettingsUser';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import './Settings.css'

export default function Settings() {

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

      {/* <div className="content"> */}
        <Topbar routes={settingsRoutes} />

        <Routes>
          <Route exact path='/' element={<SettingsUser />} />
          <Route exact path='/members' element={<SettingsMembers />} />
        </Routes>

      </div>
    // </div>
  )
}