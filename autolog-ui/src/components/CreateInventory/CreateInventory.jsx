import * as React from 'react';
import './CreateInventory.css';

export default function CreateInventory() {
    const [ field, setField ] = React.useState({name: "", password: ""});

    const handleOnFormChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        // Change the value of the given field
        setCredentials({...credentials, [name]: value});
    }

    const createInventory = async () => {
        /// Add code for onclick to create inventory
    }

    return (
        <div className='create-inventory-page'>
            <div className='content'>
                <div className='create-inventory-form'>
                    <div className='header'>
                        <h2 className='header-instruction'> Create a new inventory! </h2>
                    </div>
                    <div className='inventory-name form-input-gray'>
                        <label className='input-label' for="name">Inventory Name</label>
                        <input className='create-inventory-input' id="name" name="email" placeholder='Enter Inventory Name...' value={field.name} onChange={handleOnFormChange}></input>
                    </div>
                    <div className='inventory-admin-password form-input-gray'>
                        <label className='input-label' for="password">Admin Password</label>
                        <input className='create-inventory-input' id="password" name="password" placeholder='***********' value={field.password} onChange={handleOnFormChange}></input>
                    </div>
                    <button className='create-inventory-button' onClick={createInventory}> Create! </button>
                </div>
            </div>
        </div>
    )
}