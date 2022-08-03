import * as React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import SettingsMembers from '../SettingsMembers/SettingsMembers';
import SettingsUser from '../SettingsUser/SettingsUser';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import './Settings.css'
import SettingsRoles from '../SettingsRoles/SettingsRoles';

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
    },
    {
      name: 'roles',
      to: './roles'
    }
  ]

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: { delay: 0.3, duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { ease: 'easeInOut' }
    }
  }

  return (
    <motion.div className="settings"
      variants={containerVariants}
      initial={"hidden"}
      animate={"visible"}
      exit={"exit"}>
      {/* always render in page */}

      <div className="content">
        <Topbar routes={settingsRoutes} />

        <AnimatePresence>
          <Routes location={location} key={location.key}>
            <Route exact path='/' element={<SettingsUser />} />
            <Route exact path='/members' element={<SettingsMembers />} />
            <Route exact path='/roles' element={<SettingsRoles />}/>
          </Routes>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}