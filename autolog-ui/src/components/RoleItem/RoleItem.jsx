import React from 'react'

import './RoleItem.css';

function RoleItem({ role }) {

    const onClickModify = () => {

    }

    const onClickDelete = () => {

    }

    return (
        <div className='role-item'>
            <h3>{role.roleName}</h3>
            <h4>ID {role.roleId}</h4>
            <span onClick={onClickModify}>Modify</span>
            <span onClick={onClickDelete}>Delete</span>
        </div>
    )
}

export default RoleItem