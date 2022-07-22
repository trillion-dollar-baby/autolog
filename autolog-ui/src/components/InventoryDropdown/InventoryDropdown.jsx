
import { useState } from 'react';
import './InventoryDropdown.css';

import _ from 'lodash';

import arrowExpand from '../../assets/icons8-expand-arrow-2.png'
import arrowCollapse from '../../assets/icons8-collapse-arrow-2.png'

/**
 * Dropdown for navbar that switches between inventories
 * that the user has access to
 */
export default function InventoryDropdown() {

    // TODO: fetch data from InventoryContext
    const items = [
        'Inventory1',
        'Inventory2',
        'Inventory3',
        'Inventory4'
    ]


    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(items[0]);

    // toggle open/closed state
    const toggle = () => setOpen(!open);

    // handle dropdown item's clicks
    const handleOnClick = (value) => {
        //TODO: share value to InventoryContext

        setSelected(value);
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
                    <span>{_.capitalize(selected)}</span>
                </div>

                <div className="dropdown-inventory-header-action">
                    <img src={open ? arrowCollapse : arrowExpand} />
                </div>
            </div>
            {/* items wrapper */}
            {open && (
                <ul className="dropdown-inventory-list">
                    {/* items */}
                    {items.map((item, idx) => {
                        return (<div className={`dropdown-inventory-item ${(idx === (items.length - 1) ? 'last' : '')}`} onClick={() => handleOnClick(item)}>
                            <span>{_.capitalize(item)}</span>
                        </div>)
                    })}
                </ul>
            )}
        </div>
    )
}