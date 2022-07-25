
import { useState } from 'react';
import './InventoryDropdown.css';

import _ from 'lodash';

import arrowExpand from '../../assets/icons8-expand-arrow-2.png'
import arrowCollapse from '../../assets/icons8-collapse-arrow-2.png'
import { useContext } from 'react';
import InventoryContext from '../../contexts/inventory';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../Modal/Modal';
import Form from '../Form/Form';
import Backdrop from '../Backdrop/Backdrop';
import DropdownOverlay from '../DropdownOverlay/DropdownOverlay';
import apiClient from '../../services/apiClient';

/**
 * Dropdown for navbar that switches between inventories
 * that the user has access to
 */
export default function InventoryDropdown() {
    const { accessibleInventoriesContext, selectedInventoryContext, inventoryPostContext } = useContext(InventoryContext);
    const [createInventory] = inventoryPostContext;
    const [accessibleInventories, setAccessibleInventories] = accessibleInventoriesContext;
    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    const [open, setOpen] = useState(false);

    // toggle open/closed state
    const toggle = () => setOpen(!open);

    // handle dropdown item's clicks
    const handleOnClick = (inventory) => {
        setSelectedInventory(inventory);
        setOpen(!open);
    }

    // new inventory modal
    const [modalOpen, setModalOpen] = useState(false);
    const closeModal = () => setModalOpen(false);
    const openModal = () => setModalOpen(true);
    const toggleModalOnDropdown = () => {
        setModalOpen(prevState => !prevState);
        setOpen(!open);
    }

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
            type: 'text',
            placeholder: '********'
        }
    ]

    const [formState, setFormState] = useState({});

    const onSubmitNewInventory = async() => {
        await createInventory(formState);
    }
    // if there are accessible inventories, render dropdown, otherwise render nothing(empty fragment)
    if (accessibleInventories.length > 0) {
        return (
            <div className={`dropdown-inventory-wrapper ${open ? 'active' : ''}`}>
                {/* 
                    Header 
                */}
                <div
                    tabIndex={0}
                    onClick={() => toggle()}
                    role="button"
                    className="dropdown-inventory-header">

                    <div className="dropdown-inventory-header-title">
                        <span>{_.capitalize(selectedInventory?.inventoryName)}</span>
                    </div>

                    <div className="dropdown-inventory-header-action">
                        <img src={open ? arrowCollapse : arrowExpand} />
                    </div>
                </div>
                {/* 
                    Inventory List 
                */}
                {open && (
                    <>
                        <DropdownOverlay onClick={toggle}/>
                        <ul className="dropdown-inventory-list">
                            {/* items */}
                            {accessibleInventories?.map((item, idx) => {
                                return (<div key={idx} className={`dropdown-inventory-item`} onClick={() => handleOnClick(item)}>
                                    <span>{_.capitalize(item?.inventoryName)}</span>
                                </div>)
                            })}

                            {/* button that leads to create inventory */}
                            <div className={`dropdown-inventory-item button-create-inventory last`} onClick={toggleModalOnDropdown}>
                                <span>Create New Inventory</span>
                            </div>
                    </ul>
                    </>
                )}

                {/* 
                    Modal for new inventory
                */}

                <AnimatePresence
                    initial={false}
                    exitBeforeEnter={true}
                    onExitComplete={() => null}>
                    {
                        modalOpen && 
                        <Modal
                            title={'Create New Inventory'}
                            body={<Form formState={formState} setFormState={setFormState} formArray={formArray} />}
                            onSubmit={onSubmitNewInventory}
                            handleClose={closeModal} 
                        />
                    }
                </AnimatePresence>
            </div>
        )
    }
    else {
        // if no accessible inventories, show nothing
        <></>
    }
}