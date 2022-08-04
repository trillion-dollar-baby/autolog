import React, { useRef } from 'react'

function PermissionCheckbox({label, name, setForm}) {

    const onCheckboxClick = (event) => {
        setForm((prevForm) => ({
            ...prevForm,
            [event.target.name]: event.target.checked
        }));
    }
    
    return (
    <div className="permission-container">
        <span>{label}</span>
        <input type={"checkbox"} onClick={onCheckboxClick} name={name} value={true}/>
    </div>
  )
}

export default PermissionCheckbox