import { useState } from 'react';
import Form from '../Form/Form';

import './SettingsMembers.css';
import DropdownSmall from '../DropdownSmall/DropdownSmall';
import MemberList from '../MemberList/MemberList';
import Dropdown from '../Dropdown/Dropdown';

export default function SettingsMembers() {
  const data = {
    0: 'admin',
    1: 'manager',
    2: 'employee',
    3: 'viewer'
  }

  const [userRoles, setUserRoles] = useState(data);

  const userArray = [
    {
      id: 0,
      firstName: 'enzo',
      lastName: 'falone',
      email: 'enzo@falone.io',
      role: 'admin'
    },
    {
      id: 1,
      firstName: 'enzo2',
      lastName: 'falone2',
      email: 'enzo2@falone.io',
      role: 'manager'
    },
    {
      id: 2,
      firstName: 'enzo3',
      lastName: 'falone3',
      email: 'enzo3@falone.io',
      role: 'employee'
    },
    {
      id: 3,
      firstName: 'enzo4',
      lastName: 'falone4',
      email: 'enzo4@falone.io',
      role: 'viewer'
    }
  ]



  return (
    <div>
      <div className="settings settings-members">
        <MemberList userArray={userArray} userRoles={userRoles} setUserRoles={setUserRoles}/>
      </div>
      
      {/* <div className='settings-divider'>
                <span>Password settings</span>
            </div> */}

    </div>
  )
}