
import { useState } from 'react';
import './InventoryDropdown.css';

import _ from 'lodash';

import arrowExpand from '../../assets/icons8-expand-arrow-2.png'
import arrowCollapse from '../../assets/icons8-collapse-arrow-2.png'
import { useContext } from 'react';
import InventoryContext from '../../contexts/inventory';
import { motion, AnimatePresence } from 'framer-motion';
import DropdownOverlay from '../DropdownOverlay/DropdownOverlay';
import ModalCreateInventory from '../ModalCreateInventory/ModalCreateInventory';

/**
 * Dropdown for navbar that switches between inventories
 * that the user has access to
 */
export default function InventoryDropdown() {
    // contexts
    const { accessibleInventoriesContext, selectedInventoryContext, inventoryPostContext } = useContext(InventoryContext);
    const [createInventory] = inventoryPostContext;
    const [accessibleInventories, setAccessibleInventories] = accessibleInventoriesContext;
    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    const [open, setOpen] = useState(false);

    // modal hook
    const [modalOpen, setModalOpen] = useState(false);

    // manage modal states
    const toggle = () => setOpen(!open);
    const closeModal = () => setModalOpen(false);
    const openModal = () => setModalOpen(true);

    const toggleModalOnDropdown = () => {
        setModalOpen(prevState => !prevState);
        setOpen(!open);
    }

    // handle dropdown item's clicks
    const handleOnClick = (inventory) => {
        setSelectedInventory(inventory);
        setOpen(!open);
    }

    // if there are accessible inventories, render dropdown, otherwise render nothing(empty fragment)
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
                    <DropdownOverlay onClick={toggle} />
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
                    <ModalCreateInventory closeModal={closeModal} />
                }
            </AnimatePresence>
        </div>
    )
}
