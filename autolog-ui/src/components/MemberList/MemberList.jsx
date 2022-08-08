import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { RoleContext } from '../../contexts/role';
import MemberItem from '../MemberItem/MemberItem';
import './MemberList.css';

/**
 * Shows a list of members based on array received
 * each object contains
 * (firstName,
 *  lastName,
 *  email,
 *  role,
 *  )
 */

export default function MemberList({userArray, roleArray}) {
	const {getUserRole} = useContext(RoleContext);

	const [isProcessing, setIsProcessing] = useState(false);
	const [currentUserRole, setCurrentUserRole] = useState({});

	useEffect(() => {
		const fetchUserRole = async () => {
			setIsProcessing(true);
			
			const result = await getUserRole();
			
			if(result?.data) {
				setCurrentUserRole(result?.data)
			}

			setIsProcessing(false);
		} 

		fetchUserRole();
	}, [])

	if(isProcessing) return <></>

	return (
		<div className="member-list">
			{userArray?.map((item, idx) => {
				let index = '';
				if (idx === 0) index += ' first';
				if (idx === userArray.length - 1) index += ' last'

				return (
					<MemberItem
						key={idx} 
						index={index} 
						id={item.id} 
						firstName={item.firstName} 
						lastName={item.lastName} 
						email={item.userEmail} 
						userRole={item.roleName}
						roleOptions={roleArray}
						currentUserRole={currentUserRole}/>
				)
			})}
		</div>
	)
}