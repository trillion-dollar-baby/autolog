import * as React from 'react';
import './CreateInventory.css';
import InventoryContext from '../../contexts/inventory';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
export default function CreateInventory() {
    const navigate = useNavigate();
    const [ field, setField ] = React.useState({name: "", password: ""});
    const { inventoryGetContext, errorContext} = useContext(InventoryContext);
    const [error, setError] = errorContext;
    const [createInventory, getAccessibleInventories, getOwnedInventories, getInventoryMembers]= inventoryGetContext;
    
    const handleOnFormChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        // Change the value of the given field
        setField({...field, [name]: value});
        console.log(field.name);
    }

    const handleCreateInventory = async () => {
        await createInventory(field);
            navigate('/dashboard');
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
                        <input className='create-inventory-input' id="name" name="name" type="text" placeholder='Enter Inventory Name...' value={field.name} onChange={handleOnFormChange}></input>
                    </div>
                    <div className='inventory-admin-password form-input-gray'>
                        <label className='input-label' for="password">Admin Password</label>
                        <input className='create-inventory-input' id="password" name="password" placeholder='***********' value={field.password} onChange={handleOnFormChange}></input>
                    </div>
                    <button className='create-inventory-button' onClick={handleCreateInventory}> Create! </button>
                </div>
            </div>
        </div>
    )
}