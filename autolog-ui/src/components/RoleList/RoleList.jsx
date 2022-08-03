import React from 'react'
import RoleItem from '../RoleItem/RoleItem'

function RoleList({roleArray}) {
  return (
    <div className='role-list'>
        {roleArray?.map((role) => {
            return <RoleItem key={role.roleName} role={role}/>
        })}
    </div>
  )
}

export default RoleList