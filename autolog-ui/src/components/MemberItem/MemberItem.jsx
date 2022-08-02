import './MemberItem.css'

import _ from 'lodash';

import placeholderImage from '../../assets/placeholder.jpg';
import iconDelete from '../../assets/icons8-delete.png';
import Dropdown from '../Dropdown/Dropdown';
import { useContext } from 'react';
import { ToastContext } from '../../contexts/toast';
import apiClient from '../../services/apiClient';
import InventoryContext from '../../contexts/inventory';

export default function MemberItem({index, id, firstName, lastName, email, userRole, roleOptions}) {
  const {notifySuccess, notifyError} = useContext(ToastContext);
  const {updateInventoryMember} = useContext(InventoryContext);

  // get role value from the dropdown and change it in the backend 
  const onDropdownClick = async(role) => {
    const result = await updateInventoryMember(email, role);
    if(!result) {
      notifySuccess("Role successfully updated!")
    } else {
      notifyError(result);
    }
  }

  return (
    <div className={`member-item ${index}`}>
      <div className="user-section">
        <img className='member-item-image' src={placeholderImage} />
        <div className="member-item-name">
          <span>{_.capitalize(firstName)} {_.capitalize(lastName)}</span>
          <span>{email}</span>
        </div>
      </div>
      <div className='permissions-section'>
        <div className='dropdown'>
          <Dropdown value={userRole} onSelect={onDropdownClick} items={roleOptions} />
        </div>
        <div className='remove-btn'>
          <img className={'member-item-delete'} title='Remove member from inventory' alt='remove button' src={iconDelete} />
        </div>
      </div>
    </div>
  )
}