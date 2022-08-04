import React from 'react'
import { useState, useContext,useEffect } from 'react';
import InventoryContext from '../../contexts/inventory';
import _ from 'lodash';
import apiClient from '../../services/apiClient';
import Form from '../Form/Form';
import Modal from '../Modal/Modal';
import { ToastContext } from '../../contexts/toast';

function ModalCreateCategory({closeModal, setCategory}) {
    const {notifySuccess, notifyError} = useContext(ToastContext);
    // contexts
    const { selectedInventoryContext } = useContext(InventoryContext);
    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    // new inventory modal hooks
    const [formState, setFormState] = useState({});
    
    const [modalError, setModalError] = useState();
    const [modalProcessing, setModalProcessing] = useState(false);

    // new inventory form
    const formArray = [
        {
            label: 'Category Name',
            name: 'categoryName',
            type: 'text',
            placeholder: 'Bodywork'
        },
    ]

    // On modal "Create" button, perform API call via InventoryContext
    const onSubmitNewCategory = async () => {
        setModalProcessing(true);

        const { data, error } = await apiClient.createCategory(selectedInventory?.inventoryId, formState.categoryName);

        if (error) {
            setModalError(error);
            notifyError(error);
        }
        // if it was successful and we got data back, close modal
        if (data) {
            notifySuccess(`Successfully created new category ${data?.category.categoryName}`)
            setCategory(_.upperFirst(data?.category.categoryName));
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
            onSubmit={onSubmitNewCategory}
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
            <h3 style={{ color: 'blue' }}>{modalProcessing ? 'Processing...' : ''}</h3>
        </>
    )

}

export default ModalCreateCategory