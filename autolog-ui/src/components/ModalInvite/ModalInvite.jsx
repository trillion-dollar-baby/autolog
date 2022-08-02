import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import InventoryContext from '../../contexts/inventory';
import { ToastContext } from '../../contexts/toast';
import apiClient from '../../services/apiClient';
import Dropdown from '../Dropdown/Dropdown';
import Form from '../Form/Form';
import Loading from '../Loading/Loading';
import Modal from '../Modal/Modal';

/**
 * Modal body content that will be displayed after clicking ButtonInvite
 */
export function ModalInvite({ closeModal }) {
    const {notifySuccess, notifyError} = useContext(ToastContext);
    // contexts
    const { addMemberContext, selectedInventoryContext } = useContext(InventoryContext);
    const [addInventoryMembers] = addMemberContext;
    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    const [modalError, setModalError] = useState();
    const [modalProcessing, setModalProcessing] = useState(false);

    const [isFetching, setIsFetching] = useState(false);

    // form state
    const [formState, setFormState] = useState({});

    const [roleList,setRoleList] = useState([]);
    const [selectedRole, setSelectedRole] = useState('Select a role');

    // user email form array for reusable component
    const formArray = [
        {
            label: 'User Email',
            name: 'email',
            type: 'text',
            placeholder: 'jane@doe.io'
        },
    ]

    // when form state changes, reset error
    useEffect(() => {
        setModalError();
    }, [formState])

    // when modal is mounted, reset form and existing errors (if any)
    // get roles in inventory
    useEffect(() => {
        const fetchRoles = async() => {
            setIsFetching(true);
            const result = await apiClient.getRoles(selectedInventory?.inventoryId);
            
            if(result?.data) {
                const roleNameArray = [];
                // append in array only the names as we don't need the ID 
                // and Dropdown component only accepts array of strings
                result?.data.forEach((item) => {
                    roleNameArray.push(item?.roleName);
                })
                setRoleList(roleNameArray);
            }

            setIsFetching(false);
        }
        
        setFormState({});
        setModalError();

        fetchRoles();
    }, [])    

    // function to handle Add button in modal and make an API call
    const onSubmitMember = async () => {
        // check only form value in this modal
        if (!formState.hasOwnProperty("email") || !formState.email.includes("@") || formState.email.length === 0) {
            setModalError("Invalid email!");
        } else {
            setModalProcessing(true);
        
            const { data, error } = await addInventoryMembers(selectedInventory.inventoryId, formState.email, selectedRole);

            // if an error was returned, let user know
            if (error) {
                setModalError(error);
                notifyError(error);
            }

            // close modal and reset form if successful
            if (data) {
                notifySuccess("User successfully added into the inventory!")
                setFormState({});
                closeModal();
            }

            //TODO: toast saying this is successful

            setModalProcessing(false);
        }
    }

    return (
        <Modal
            title={'Add user to inventory'}
            body={
            // pass props instead of defining inside so form does not re-render and lose focus
            <ModalBody  modalError={modalError} 
                        modalProcessing={modalProcessing} 
                        isFetching={isFetching}
                        formState={formState} 
                        setFormState={setFormState} 
                        formArray={formArray} 
                        selectedRole={selectedRole} 
                        roles={roleList} 
                        setSelectedRole={setSelectedRole} 
                            />
            }
            onSubmit={onSubmitMember}
            handleClose={closeModal}
        />


    )
}

export function ModalBody({ modalError, modalProcessing, isFetching, formState, setFormState, formArray, selectedRole, roles, setSelectedRole }) {
    return (
        !isFetching ? 
        <>
            {/* messages */}
            {/* TODO: change this for something consistent with design and spaced */}
            <h3 style={{ color: 'red' }}>{modalError || ''}</h3>
            <h3 style={{ color: 'blue' }}>{modalProcessing ? 'Processing...' : ''}</h3>

            {/* inputs */}
            <div className="form-container">
                <Form formState={formState} setFormState={setFormState} formArray={formArray} />
            </div>
            <div className="dropdown-container">
                <span style={{ fontSize: '18px', color: 'white' }}>Role</span>
                <Dropdown value={selectedRole} items={roles} onSelect={setSelectedRole} />
            </div>
        </>
        :
        <Loading/>
    )
}

export default ModalInvite