import './MemberItem.css'

import placeholderImage from '../../assets/placeholder.jpg';
import iconDelete from '../../assets/icons8-delete.png';
import DropdownSmall from '../DropdownSmall/DropdownSmall';
import { useState } from 'react';

/**
 * 
 * 
 */

export default function MemberItem() {
    const roleOptions = [
        'Admin',
        'Manager',
        'Employee',
        'Viewer'
    ]
    const [value, setValue] = useState(roleOptions[1]);

    return (

        <>
            {/* TODO: make component to be populated by data received */}
            {/* test with different components */}
            <div className="member-item first">
                <img className='member-item-image' src={placeholderImage} />
                <div className="member-item-name">
                    <span>Saul Goodman (saulGoodman123)</span>
                    <span>saul@goodman.io</span>
                </div>
                <DropdownSmall value={value} setValue={setValue} options={roleOptions} />
                <img className={'member-item-delete'} src={iconDelete} />
            </div>
            <div className="member-item">
                <img className='member-item-image' src={placeholderImage} />
                <div className="member-item-name">
                    <span>Saul Goodman (saulGoodman123)</span>
                    <span>saul@goodman.io</span>
                </div>
                <DropdownSmall value={value} setValue={setValue} options={roleOptions} />
                <img className={'member-item-delete'} src={iconDelete} />
            </div>
            <div className="member-item last">
                <img className='member-item-image' src={placeholderImage} />
                <div className="member-item-name">
                    <span>Saul Goodman (saulGoodman123)</span>
                    <span>saul@goodman.io</span>
                </div>
                <DropdownSmall value={value} setValue={setValue} options={roleOptions} />
                <img className={'member-item-delete'} src={iconDelete} />
            </div>
        </>
    )
}