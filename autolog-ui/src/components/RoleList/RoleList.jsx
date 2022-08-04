import React from 'react'
import RoleItem from '../RoleItem/RoleItem'
import './RoleList.css';


function RoleList({ roleArray, fetchList }) {

	return (
		<div className='role-list'>
			{roleArray?.map((role, idx) => {
				let index = '';
				if (idx === 0) index += ' first';
				if (idx === roleArray.length - 1) index += ' last'

				return <RoleItem fetchList={fetchList} key={role.roleName} index={index} role={role} />
			})}
		</div>
	)
}

export default RoleList