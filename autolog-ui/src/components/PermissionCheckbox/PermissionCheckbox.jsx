import React, { useRef } from 'react'
import "./PermissionCheckbox.css"

function PermissionCheckbox({label, name, setForm, value}) {

    const onCheckboxClick = (event) => {
        setForm((prevForm) => ({
            ...prevForm,
            [event.target.name]: event.target.checked
        }));
    }
    
    return (
    <div className="permissions-container">
        <div className="checkbox-container">
            <input className="checkboxes" type={"checkbox"}  onChange={onCheckboxClick} name={name} checked={value || false} value={!value || true}/>
        </div>
        <div className="text-container">
            <span className="checkbox-text">{label}</span>
        </div>
    </div>
  )
}

export default PermissionCheckbox