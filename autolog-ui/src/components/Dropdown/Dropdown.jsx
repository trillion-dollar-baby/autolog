import { useState } from 'react';
import './Dropdown.css';

import arrowExpand from '../../assets/icons8-expand-arrow-2.png'
import arrowCollapse from '../../assets/icons8-collapse-arrow-2.png'

export default function Dropdown({ title, items = ['test','test2'], multiSelect = false }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(items[0]);

    const toggle = () => setOpen(!open);

    const handleOnClick = (value) => {
        setSelected(value);
        setOpen(!open);
    }

    return (
        <div className="dropdown-wrapper">
            <div
                tabIndex={0}
                onClick={() => toggle()}
                role="button"
                className="dropdown-header">
                <div className="dropdown-header-title">
                    <span>{selected}</span>
                </div>
                <div className="dropdown-header-action">
                    <img src={open ? arrowCollapse : arrowExpand}/>
                </div>
            </div>

            {open && (
                <ul className="dropdown-list">
                    {items.map((item,idx) => {
                        return(<div className={`dropdown-item ${(idx === (items.length-1) ? 'last' : '')}`} onClick={() => handleOnClick(item)}>
                            <span>{item}</span>
                        </div>)
                    })}
                </ul>
            )}
        </div>
    )
}