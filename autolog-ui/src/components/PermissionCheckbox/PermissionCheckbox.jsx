import React, { useRef } from 'react'

function PermissionCheckbox({label, name, setForm, value}) {

    const onCheckboxClick = (event) => {
        setForm((prevForm) => ({
            ...prevForm,
            [event.target.name]: event.target.checked
        }));
    }
    
    return (
    <div className="permission-container">
        <span>{label}</span>
        <input type={"checkbox"}  onChange={onCheckboxClick} name={name} checked={value || false} value={!value || true}/>
    </div>
  )
}

export default PermissionCheckbox