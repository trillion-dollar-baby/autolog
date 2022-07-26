import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import InventoryContext from '../../contexts/inventory';
import Form from '../Form/Form';
import Modal from '../Modal/Modal';

function ModalCreateInventory({closeModal}) {
    // contexts
    const { accessibleInventoriesContext, selectedInventoryContext, inventoryPostContext } = useContext(InventoryContext);
    const [createInventory] = inventoryPostContext;
    const [accessibleInventories, setAccessibleInventories] = accessibleInventoriesContext;
    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    // new inventory modal hooks
    const [formState, setFormState] = useState({});
    
    const [modalError, setModalError] = useState();
    const [modalProcessing, setModalProcessing] = useState(false);

    // new inventory form
    const formArray = [
        {
            label: 'Inventory Name',
            name: 'name',
            type: 'text',
            placeholder: 'This is a placeholder'
        },
        {
            label: 'Inventory Password',
            name: 'password',
            type: 'password',
            placeholder: '********'
        }
    ]

    // On modal "Create" button, perform API call via InventoryContext
    const onSubmitNewInventory = async () => {
        setModalProcessing(true);
        const { data, error } = await createInventory(formState);

        if (error) {
            setModalError(error);
        }
        // if it was successful and we got data back, close modal
        if (data) {
            closeModal();
        }

        setModalProcessing(false);
    }


    return (
        <Modal
            title={'Create New Inventory'}
            body={<ModalBody
                formState={formState}
                setFormState={setFormState}
                formArray={formArray}
                modalError={modalError}
                setModalError={setModalError}
                modalProcessing={modalProcessing} />
            }
            onSubmit={onSubmitNewInventory}
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
            {/* TODO: change this for something consistent with design and spaced */}
            <h3 style={{ color: 'red' }}>{modalError || ''}</h3>
            <h3 style={{ color: 'blue' }}>{modalProcessing ? 'Processing...' : ''}</h3>
            <Form formState={formState} setFormState={setFormState} formArray={formArray} />
        </>
    )

}

export default ModalCreateInventory