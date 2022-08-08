import * as React from 'react';
import './CreateItem.css'
import ItemContext from '../../contexts/items';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ToastContext } from '../../contexts/toast';
import InventoriesContext from '../../contexts/inventories';
import Form from '../Form/Form';
import DropdownCategory from '../DropdownCategory/DropdownCategory';
import TextArea from '../TextArea/TextArea';
import ButtonAction from '../Button/ButtonAction';


export default function CreateItem() {
    const navigate = useNavigate();
    // contexts
    const {notifySuccess, notifyError} = useContext(ToastContext);
    const { itemCreateContext } = useContext(ItemContext);
    const { selectedInventoryContext } = useContext(InventoriesContext);
    const [createItem] = itemCreateContext;
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

    // submit button handler
    const handleItemCreate = async () => {
        // TODO: APPEND TO INVENTORY LOOKUP ARRAY
        setIsProcessing(true);
        itemForm['category'] = categoryValue;
        itemForm.inventoryId = selectedInventory.inventoryId
        const {data, error} = await createItem(itemForm);

        setIsProcessing(false);

        if(data) {
            navigate("/inventory/");
            notifySuccess(`Item successfully created!`);
        } else {
            notifyError(error);
        }
    }

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
                    <label className="header-title"> Create a new item </label>
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
                        <ButtonAction onClick={handleItemCreate} color={'#3F5BE8'} label={"Create"} />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
