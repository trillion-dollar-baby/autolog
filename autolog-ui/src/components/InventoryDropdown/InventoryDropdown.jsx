
import { useState } from 'react';
import './InventoryDropdown.css';

import _ from 'lodash';

import arrowExpand from '../../assets/icons8-expand-arrow-2.png'
import arrowCollapse from '../../assets/icons8-collapse-arrow-2.png'
import { useContext } from 'react';
import InventoryContext from '../../contexts/inventory';
import { useEffect } from 'react';

/**
 * Dropdown for navbar that switches between inventories
 * that the user has access to
 */
export default function InventoryDropdown() {
    const {accessibleInventoriesContext, selectedInventoryContext} = useContext(InventoryContext);
    const [accessibleInventories, setAccessibleInventories] = accessibleInventoriesContext;
    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    const [open, setOpen] = useState(false);

    // toggle open/closed state
    const toggle = () => setOpen(!open);

    // handle dropdown item's clicks
    const handleOnClick = (inventory) => {
        //TODO: share value to InventoryContext

        setSelectedInventory(inventory);
        setOpen(!open);
    }
    
    return (
        <div className={`dropdown-inventory-wrapper ${open ? 'active' : ''}`}>
            {/* header */}
            <div
                tabIndex={0}
                onClick={() => toggle()}
                role="button"
                className="dropdown-inventory-header">

                <div className="dropdown-inventory-header-title">
                    <span>{_.capitalize(selectedInventory.inventoryName)}</span>
                </div>

                <div className="dropdown-inventory-header-action">
                    <img src={open ? arrowCollapse : arrowExpand} />
                </div>
            </div>
            {/* items wrapper */}
            {open && (
                <ul className="dropdown-inventory-list">
                    {/* items */}
                    {accessibleInventories.map((item, idx) => {
                        return (<div className={`dropdown-inventory-item ${(idx === (accessibleInventories.length - 1) ? 'last' : '')}`} onClick={() => handleOnClick(item)}>
                            <span>{_.capitalize(item.inventoryName)}</span>
                        </div>)
                    })}
                </ul>
            )}
        </div>
    )
}