import React from 'react'
import RoleItem from '../RoleItem/RoleItem'
import './RoleList.css';


function RoleList({ roleArray, fetchList }) {

	return (
		<div className='role-list' data-tooltip="Depending on the role, your permissions will be checkmarked green as actions you can take or marked red as actions you can't">
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