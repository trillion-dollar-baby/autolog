import { useState } from 'react';
import './Dropdown.css';

import _ from 'lodash';

import arrowExpand from '../../assets/icons8-expand-arrow-2.png'
import arrowCollapse from '../../assets/icons8-collapse-arrow-2.png'
import DropdownOverlay from '../DropdownOverlay/DropdownOverlay';

export default function Dropdown({ value, items, onSelect }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(value);

    const toggle = () => setOpen(!open);

    const handleOnClick = (value) => {
        //share value that user selected to the components above the dropdown component
        onSelect(value);

        setSelected(value);
        setOpen(!open);
    }

    const handleOnBlur = () => {
        if (open) {
            setOpen(!open);
        }
    }

    return (
        <div className={`dropdown-wrapper ${open ? 'active' : ''}`}>
            <div
                tabIndex={0}
                onClick={() => toggle()}
                role="button"
                className="dropdown-header">

                <div className="dropdown-header-title">
                    <span>{_.capitalize(selected)}</span>
                </div>

                <div className="dropdown-header-action">
                    <img src={open ? arrowCollapse : arrowExpand} />
                </div>
            </div>

            {open && (
                <>
                    <DropdownOverlay onClick={handleOnBlur} />
                    <ul className="dropdown-list">
                        {items.map((item, idx) => {
                            return (<div className={`dropdown-item ${(idx === (items.length - 1) ? 'last' : '')}`} onClick={() => handleOnClick(item)}>
                                <span>{_.capitalize(item)}</span>
                            </div>)
                        })}
                    </ul>
                </>
            )}
        </div>
    )
}