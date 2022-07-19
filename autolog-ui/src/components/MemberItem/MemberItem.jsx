import './MemberItem.css'

import _ from 'lodash';

import placeholderImage from '../../assets/placeholder.jpg';
import iconDelete from '../../assets/icons8-delete.png';
import Dropdown from '../Dropdown/Dropdown';

export default function MemberItem({index, id, firstName, lastName, email, userRole, setUserRole}) {
  
  const roleOptions = [
    'admin',
    'manager',
    'employee',
    'viewer'
  ]

  // get role value from the dropdown and change it to 
  const onDropdownClick = (role) => {
    // change member role
    setUserRole(id, role);
  }

  return (
    <div className={`member-item ${index}`}>
      <div className="section">
        <img className='member-item-image' src={placeholderImage} />
        <div className="member-item-name">
          <span>{_.capitalize(firstName)} {_.capitalize(lastName)}</span>
          <span>{email}</span>
        </div>
      </div>
      <div className='section'>
        <Dropdown value={userRole} onSelect={onDropdownClick} items={roleOptions} />
        <img className={'member-item-delete'} title='Remove member from inventory' alt='remove button' src={iconDelete} />
      </div>
    </div>
  )
}