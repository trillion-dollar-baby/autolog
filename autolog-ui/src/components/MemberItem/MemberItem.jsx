import './MemberItem.css'

import _ from 'lodash';

import placeholderImage from '../../assets/placeholder.jpg';
import iconDelete from '../../assets/icons8-delete.png';
import Dropdown from '../Dropdown/Dropdown';
import { useContext, useState } from 'react';
import { ToastContext } from '../../contexts/toast';
import InventoriesContext from '../../contexts/inventories';
import AuthContext from '../../contexts/auth';

export default function MemberItem({ index, id, firstName, lastName, email, userRole, roleOptions, currentUserRole }) {
	const { notifySuccess, notifyError } = useContext(ToastContext);
	const { userContext } = useContext(AuthContext);
	const [user, setUser] = userContext;
	const { updateInventoryMember, removeInventoryMember, selectedInventoryContext } = useContext(InventoriesContext);
	const [selectedInventory, setSelectedInventory] = selectedInventoryContext;
	const [isDeleted, setIsDeleted] = useState(false);
	// get role value from the dropdown and change it in the backend 
	const onDropdownClick = async (role) => {
		const result = await updateInventoryMember(email, role);
		if (!result) {
			notifySuccess("Role successfully updated!")
		} else {
			notifyError(result.error);
		}
	}

	// Create API call to delete itself and set as deleted to not render
	const onClickDelete = async () => {
		const result = await removeInventoryMember(email);

		if(result?.data) {
			notifySuccess(`${firstName} ${lastName} was removed successfully`);
			setIsDeleted(true);
		} else {
			notifyError(result?.error);
		}
	}

	return (
		<>
			{!isDeleted ?
				<div className={`member-item ${index}`}>
					<div className="user-section">
						<img className='member-item-image' src={placeholderImage} />
						<div className="member-item-name">
							<span>{_.capitalize(firstName)} {_.capitalize(lastName)} {selectedInventory?.ownerId === id ? "(Owner)" : ""} {id === user?.id? "(You)" : ""}</span>
							<span>{email}</span>
						</div>
					</div>
					<div className='permissions-section'>
						<div className='dropdown'>
							<Dropdown value={userRole} onSelect={onDropdownClick} items={roleOptions} disabled={currentUserRole?.roleName !== 'admin'} />
						</div>
						<div className='remove-btn'>
							<img className={'member-item-delete'} title='Remove member from inventory' alt='remove button' onClick={onClickDelete} src={iconDelete} />
						</div>
					</div>
				</div>
				:
				<></>}
		</>
	)
}