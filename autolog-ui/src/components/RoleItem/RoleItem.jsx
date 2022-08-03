import _ from 'lodash';
import React, { useContext, useState } from 'react'
import { RoleContext } from '../../contexts/role';
import { ToastContext } from '../../contexts/toast';
import RoleAbility from '../RoleAbility/RoleAbility';

import './RoleItem.css';

function RoleItem({ role, index }) {
    const {notifySuccess, notifyError} = useContext(ToastContext);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const {deleteRole} = useContext(RoleContext);

    const onClickModify = async () => {

    }

    const onClickDelete = async () => {
        setIsProcessing(true);
        const result = await deleteRole(role.roleId);
        
        if(!result) {
            notifySuccess("Successfully deleted role");
            setIsDeleted(true);
        } else {
            notifyError(result);
        }
        setIsProcessing(false);
    }

    return (
        <>
        { !isDeleted ?
        <div className={`role-item ${index}`}>
            <div className="section">
                <h3>{_.capitalize(role.roleName)}</h3>
                <h4>Role ID {role.roleId}</h4>
            </div>
            <div className="section">
                <RoleAbility label={"Create"} state={role.create}/>
                <RoleAbility label={"Read"} state={role.read}/>
                <RoleAbility label={"Update"} state={role.update}/>
                <RoleAbility label={"Delete"} state={role.delete}/>
            </div>
            <div className="section">
            <span className='role-option' onClick={onClickModify}>Modify</span>
            <span className='role-option' onClick={onClickDelete}>Delete</span>
            </div>
        </div> 
        :
        (<></>)
        }
        </>
    )
}

export default RoleItem