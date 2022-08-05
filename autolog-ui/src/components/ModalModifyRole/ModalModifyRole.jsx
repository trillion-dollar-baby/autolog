import React from 'react'
import _ from 'lodash';
import { useState, useContext, useEffect } from 'react';
import InventoriesContext from '../../contexts/inventories';
import Form from '../Form/Form';
import Modal from '../Modal/Modal';
import { ToastContext } from '../../contexts/toast';
import PermissionCheckbox from '../PermissionCheckbox/PermissionCheckbox';
import { RoleContext } from '../../contexts/role';

function ModalModifyRole({ closeModal, roleData, fetchList }) {
    const { notifySuccess, notifyError } = useContext(ToastContext);
    // contexts
    const { updateRole, getRoleById } = useContext(RoleContext);
    const { selectedInventoryContext } = useContext(InventoriesContext);
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

    useEffect(() => {
        setModalError();

        const fetchRole = async () => {
            setModalProcessing(true);

            const result = await getRoleById(roleData.roleId);

            if(result.data) {
                setFormState({
                    name: result.data.roleName,
                    create: result.data.create,
                    update: result.data.update,
                    read: result.data.read,
                    delete: result.data.delete,
                })
            }

            setModalProcessing(false);
        }

        fetchRole();
    }, [])

    // On modal "Create" button, perform API call via InventoryContext
    const onSubmitModifyRole = async () => {
        setModalProcessing(true);

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

        const { data, error } = await updateRole(roleData.roleId, newRoleData);

        if (error) {
            setModalError(error);
            notifyError(error);
        }
        // if it was successful and we got data back, close modal
        if (data) {
            fetchList();
            closeModal();
        }

        setModalProcessing(false);
    }

    return (
        <Modal
            title={`Modify ${roleData?.roleName} role`}
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
                <PermissionCheckbox label={"Create"} name={"create"} value={formState.create} setForm={setFormState} />
                <PermissionCheckbox label={"Read"} name={"read"} value={formState.read} setForm={setFormState} />
                <PermissionCheckbox label={"Update"} name={"update"} value={formState.update} setForm={setFormState} />
                <PermissionCheckbox label={"Delete"} name={"delete"} value={formState.delete} setForm={setFormState} />
            </div>
            <h3 style={{ color: 'blue' }}>{modalProcessing ? 'Processing...' : ''}</h3>
        </>
    )

}

export default ModalModifyRole