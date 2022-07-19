import { useState } from 'react';
import Form from '../Form/Form';

import './SettingsMembers.css';
import DropdownSmall from '../DropdownSmall/DropdownSmall';
import MemberList from '../MemberList/MemberList';
import Dropdown from '../Dropdown/Dropdown';

export default function SettingsMembers() {
  const roleOptions = [
    'Admin',
    'Manager',
    'Employee',
    'Viewer'
  ]
  const [value, setValue] = useState(roleOptions[1]);

  return (
    <div>
      <div className="settings settings-members">
        <MemberList/>
      </div>
      {/* <Dropdown title={'hello world'}/> */}
      
      {/* <div className='settings-divider'>
                <span>Password settings</span>
            </div> */}

    </div>
  )
}