import React, { useEffect } from 'react'

import '../CreateItem/CreateItem.css';

import ItemContext from '../../contexts/items';
import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'framer-motion';
import InventoryContext from '../../contexts/inventory';
import Form from '../Form/Form';
import DropdownCategory from '../DropdownCategory/DropdownCategory';
import TextArea from '../TextArea/TextArea';
import ButtonAction from '../Button/ButtonAction';
import { ToastContext } from '../../contexts/toast';

function ItemDetail() {

    // get ID of item the user wants to see
    const { itemId } = useParams();

    const navigate = useNavigate();
    
    // contexts
    const {notifySuccess, notifyError} = useContext(ToastContext);
    const { itemContext, itemCreateContext, itemUpdateContext, itemGetContext, itemDeleteContext } = useContext(ItemContext);
    
    const [getItem] = itemGetContext;
    const [updateItem] = itemUpdateContext;

    const { selectedInventoryContext } = useContext(InventoryContext);
    const [items, setItems] = itemContext;

    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    // form handling
    const [itemForm, setItemForm] = useState({});
    const [categoryValue, setCategoryValue] = useState('');

    const handleChange = (e) => {
        e.preventDefault();

        let value = e.target.value;
        let name = e.target.name;

        setItemForm({ ...itemForm, [name]: value });
    }

    // update button handler
    const handleItemUpdate = async () => {
        // TODO: APPEND TO INVENTORY LOOKUP ARRAY
        setIsProcessing(true);
        itemForm['category'] = categoryValue;
        const { data, error } = await updateItem(itemId, itemForm);

        setIsProcessing(false);

        if (data) {
            notifySuccess(`${_.capitalize((itemForm?.name || "Item"))} successfully updated!`)
            navigate("/inventory/");

        } else {
            notifyError(error);
            setErrorMessage(error);
        }
    }

    // on mount get the details of the item
    useEffect(() => {
        const fetchItem = async () => {
            const {data, error} = await getItem(itemId);

            if(data) {
                setItemForm(data.item);
                setCategoryValue(data.item.category);
            }
        }

        fetchItem();
    }, [])

    // form array for "item information" section
    const formArray = [
        {
            label: 'Name',
            name: 'name',
            type: 'text',
            placeholder: 'The alternator is shot Saul'
        },
        {
            label: 'Quantity',
            name: 'quantity',
            type: 'text',
            placeholder: '1234'
        },
        {
            label: 'Measures (Optional)',
            name: 'measures',
            type: 'text',
            placeholder: '12x12x12'
        },
        {
            label: 'Located At (Optional)',
            name: 'locatedAt',
            type: 'text',
            placeholder: 'Shelve 12'
        },
        {
            label: 'Part Number (Optional)',
            name: 'partNumber',
            type: 'text',
            placeholder: '1234'
        },
    ]

    // form array for "additional details" section
    const formArray2 = [
        {
            label: 'Supplier',
            name: 'supplier',
            type: 'text',
            placeholder: 'ACME'
        }
    ]

    const containerVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: { delay: 0.3, duration: 0.3 }
        },
        exit: {
            opacity: 0,
            transition: { ease: 'easeInOut' }
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial={"hidden"}
            animate={"visible"}
            exit={"exit"}
            className="create-item">

            <div className="header">
                <div className="header-title-wrapper">
                    <label className="header-title"> Item detail </label>
                    <label className='error-message'>{errorMessage}</label>
                    <label className='processing-message'>{isProcessing ? 'Processing...' : ''}</label>
                </div>
            </div>

            {/* divider */}
            <div className="content">
                <div className='divider'>
                    <span>Item Information</span>
                </div>
                {/* Main form */}

                <div className="item-information">
                    <Form formArray={formArray} setFormState={setItemForm} formState={itemForm} />
                </div>

                {/* Additional form */}
                <div className="divider">
                    <label className="title"> Additional Details </label>
                </div>
                <div className="additional-details">
                    <div className="form-container-additional">
                        <Form formArray={formArray2} setFormState={setItemForm} formState={itemForm} />

                        <DropdownCategory categoryValue={categoryValue} setCategoryValue={setCategoryValue} />
                    </div>
                    <div className="form-container text-area">
                        <TextArea data={{ label: "Description", name: "description", type: "text", placeholder: "Hello World" }} onChange={handleChange} inputValue={itemForm['description']} />
                    </div>
                    <div className="content">
                        <ButtonAction onClick={handleItemUpdate} color={'#3F5BE8'} label={"Update"} />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default ItemDetail