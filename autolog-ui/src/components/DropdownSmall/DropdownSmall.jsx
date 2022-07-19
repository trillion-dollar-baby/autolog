import _ from 'lodash';


/**
 * 
 * @param {useState getter} value 
 * @param {useState setter} setValue
 * @param {Array} options list of items for the dropdown
 * @param {String} label name for the label (optional)
 */

import './DropdownSmall.css'

export default function DropdownSmall({ value, setValue, options, label }) {

    const handleChange = (event) => {
        setValue(event.target.value);
        console.log(value);
    }

    return (
        <div className={`dropdown-small`}>
            {/* if there is a label render it */}
            {label ? <label className='dropdown-small-label'>{label}</label> : null}
            <select value={value} onChange={handleChange}>
                {/* render every option */}
                {options.map((item, idx) => {
                    return <option key={idx} value={item}>{_.capitalize(item)}</option>
                })}
            </select>
        </div>
    )
}