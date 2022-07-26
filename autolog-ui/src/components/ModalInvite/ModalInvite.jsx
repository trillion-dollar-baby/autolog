import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import InventoryContext from '../../contexts/inventory';
import Dropdown from '../Dropdown/Dropdown';
import Form from '../Form/Form';
import Modal from '../Modal/Modal';

/**
 * Modal body content that will be displayed after clicking ButtonInvite
 */
export function ModalInvite({ closeModal }) {
    // contexts
    const { addMemberContext, selectedInventoryContext } = useContext(InventoryContext);
    const [addInventoryMembers] = addMemberContext;
    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    const [modalError, setModalError] = useState();
    const [modalProcessing, setModalProcessing] = useState(false);

    // user email form array for reusable component
    const formArray = [
        {
            label: 'User Email',
            name: 'email',
            type: 'text',
            placeholder: 'jane@doe.io'
        },
    ]
    // inside modal

    // form state
    const [formState, setFormState] = useState({});

    // dropdown hook and items
    const roles = [
        'Owner',
        'Manager',
        'Employee',
        'Viewer'
    ]
    const [selectedRole, setSelectedRole] = useState(roles[0]);

    // function to handle Add button in modal and make an API call
    const onSubmitMember = async () => {
        // check only form value in this modal
        if (!formState.hasOwnProperty("email") || !formState.email.includes("@") || formState.email.length === 0) {
            setModalError("Invalid email");
        } else {
            setModalProcessing(true);

            const { data, error } = await addInventoryMembers(formState.email, selectedInventory.inventoryId);

            // if an error was returned, let user know
            if (error) {
                setModalError(error);
            }

            // close modal and reset form if successful
            if (data) {
                setFormState({});
                closeModal();
            }

            //TODO: toast saying this is successful

            setModalProcessing(false);
        }
    }

    // when form state changes, reset error
    useEffect(() => {
        setModalError();
    }, [formState])

    // when modal is mounted, reset form and existing errors (if any)
    useEffect(() => {
        setFormState({});
        setModalError();

    }, [])

    return (
        <Modal
            title={'Add user to inventory'}
            body={
            // pass props instead of defining inside so form does not re-render and lose focus
            <ModalBody  modalError={modalError} 
                        modalProcessing={modalProcessing} 
                        formState={formState} 
                        setFormState={setFormState} 
                        formArray={formArray} 
                        selectedRole={selectedRole} 
                        roles={roles} 
                        setSelectedRole={setSelectedRole} 
                            />
            }
            onSubmit={onSubmitMember}
            handleClose={closeModal}
        />


    )
}

export function ModalBody({ modalError, modalProcessing, formState, setFormState, formArray, selectedRole, roles, setSelectedRole }) {
    return (
        <>
            {/* messages */}
            <h3 style={{ color: 'red' }}>{modalError || ''}</h3>

            <h3 style={{ color: 'blue' }}>{modalProcessing || ''}</h3>

            {/* inputs */}
            <div className="form-container">
                <Form formState={formState} setFormState={setFormState} formArray={formArray} />
            </div>
            <div className="dropdown-container">
                <span style={{ fontSize: '18px' }}>Role</span>
                <Dropdown value={selectedRole} items={roles} onSelect={setSelectedRole} />
            </div>
        </>
    )
}

export default ModalInvite