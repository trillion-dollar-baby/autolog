import React from 'react'
import _ from 'lodash';
import { useState, useContext, useEffect } from 'react';
import InventoryContext from '../../contexts/inventory';
import Form from '../Form/Form';
import Modal from '../Modal/Modal';
import { ToastContext } from '../../contexts/toast';
import PermissionCheckbox from '../PermissionCheckbox/PermissionCheckbox';
import { RoleContext } from '../../contexts/role';

function ModalModifyRole({ closeModal, roleData }) {
    const { notifySuccess, notifyError } = useContext(ToastContext);
    // contexts
    const { updateRole } = useContext(RoleContext);
    const { selectedInventoryContext } = useContext(InventoryContext);
    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    // new inventory modal hooks
    const [formState, setFormState] = useState({});

    const [modalError, setModalError] = useState();
    const [modalProcessing, setModalProcessing] = useState(false);

    // new inventory form
    const formArray = [
        {
            label: 'Role Name',
            name: 'name',
            type: 'text',
            placeholder: 'Employee'
        },
    ]

    // On modal "Create" button, perform API call via InventoryContext
    const onSubmitModifyRole = async () => {
        setModalProcessing(true);
        console.log(formState);
        if(!formState?.name) {
            setModalError("No role name specified");
        }

        // make sure checkboxes are false if never checked
        const newRoleData = {
            name: formState.name,
            create: formState.create || false,
            read: formState.read || false,
            update: formState.update || false,
            delete: formState.delete || false,
        } 

        const { data, error } = await updateRole(roleData.id, newRoleData);

        if (error) {
            setModalError(error);
            notifyError(error);
        }
        // if it was successful and we got data back, close modal
        if (data) {
            closeModal();
        }

        setModalProcessing(false);
    }
    
    return (
        <Modal
            title={'Create New Category'}
            body={<ModalBody
                formState={formState}
                setFormState={setFormState}
                formArray={formArray}
                modalError={modalError}
                setModalError={setModalError}
                modalProcessing={modalProcessing} />
            }
            onSubmit={onSubmitModifyRole}
            handleClose={closeModal}
        />
    )
}

// modal body for inventory dropdown create
export function ModalBody({ formState, setFormState, formArray, setModalError, modalError, modalProcessing }) {
    // when mounted reset states (if any)
    useEffect(() => {
        setFormState({});
        setModalError();
    }, [])

    return (
        <>
            <h3 style={{ color: 'red' }}>{modalError || ''}</h3>
            <Form formState={formState} setFormState={setFormState} formArray={formArray} />
            <div className="permissions-container">
                <PermissionCheckbox label={"Create"} name={"create"} setForm={setFormState} />
                <PermissionCheckbox label={"Read"} name={"read"} setForm={setFormState} />
                <PermissionCheckbox label={"Update"} name={"update"} setForm={setFormState} />
                <PermissionCheckbox label={"Delete"} name={"delete"} setForm={setFormState} />
            </div>
            <h3 style={{ color: 'blue' }}>{modalProcessing ? 'Processing...' : ''}</h3>
        </>
    )

}

export default ModalModifyRole