import * as React from 'react';
import './CreateItem.css'
import Search from "../../assets/Search.png"
import ItemContext from '../../contexts/items';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import InventoryContext from '../../contexts/inventory';
// import apiClient from '../../services/apiClient';

export default function CreateItem() {
    const{itemContext, itemCreateContext} = useContext(ItemContext);
    const [items, setItems] = itemContext;
    const[createItem]= itemCreateContext;
    const{selectedInventoryContext}=useContext(InventoryContext);
    const [selectedInventory, setSelectedInventory]=selectedInventoryContext;

    
    // const[itemName, setName]=useState("")
    // const[category, setCategory]=useState("")
    // const[quantity, setQuantity]=useState("")

    const navigate = useNavigate();
    const [itemThings, setItemThings] = useState({ name: "", category: "", quantity: "", itemPrice:"", standardCost: "", supplier:"", description:""});
    
    const handleChange = (e) => {
        e.preventDefault();
       let value = e.target.value;
       
       let name = e.target.name;

    setItemThings({...itemThings, [name]: value});
   
//    switch(e.target.name){
//        case "itemName": setName(value);
//            break;
//        case "category":setCategory(value);
//            break;
//         case "quantity": setQuantity(value);
//             break;
//        }
    }

    //{ itemName: itemName, category: category, quantity: quantity}
    const handleItemCreate = async () => {
        // values = { itemName: itemName, category: category, quantity: quantity}
        // const {data, error} = await apiClient.createItem(values)
        await createItem(itemThings, itemThings.inventoryId=selectedInventory.inventoryId);
        // itemThings.selectedInventory=selectedInventory.inventoryId;
        console.log(itemThings.inventoryId);
        // if(data?.items) {
        //     setItems([...items, data.items])
        //     navigate("/")
        // }
        navigate("/inventory/");
        /// Add code for onclick to create inventory
    }
    return (
        <div className ="create-item">
            <div className="page-contents">
                <div className="header-1">
                    <label className="heading"> Item Information </label>
                </div>
            <div className="create-input-fields">
                <div className="item-id">
                    <label className="labels"> Item # </label>
                    <input className="form-input" name="label" placeholder="Enter item #..."/>
                </div>
                <div className="item-name">
                    <label className="labels"> Item Name </label>
                    <input className="form-input" name="name" placeholder="Enter item name..." value={itemThings.name} onChange={handleChange}/>
                </div>
                <div className="quantity">
                    <label className="labels"> Quantity </label>
                    <input className="form-input" name="quantity" placeholder="0" value={itemThings.quantity} onChange={handleChange}/>
                </div>
                <div className="order-date">
                    <label className="labels"> Order Date </label>
                    <input className="form-input" name="orderDate" placeholder="MM-DD-YY"/>
                </div>
                <div className="arrival-date">
                    <label className="labels"> Arrival Date </label>
                    <input className="form-input" name="arrivalDate" placeholder="MM-DD-YY"/>
                </div>
                <div className="item-price">
                    <label className="labels"> Item Price </label>
                    <input className="form-input" name="itemPrice" placeholder="$00.00" value={itemThings.itemPrice} onChange={handleChange}/>
                </div>
                <div className="standard-cost">
                    <label className="labels"> Standard Cost </label>
                    <input className="form-input" name="standardCost" placeholder="$00.00" value={itemThings.standardCost} onChange={handleChange}/>
                </div>
                </div>
                <div className="header-2">
                    <label className="heading"> Additional Details </label>
                </div>
                <div className="create-input-fields">
                    <div className="category">
                        <label className="labels"> Category </label>
                        <input className="form-input" name="category" placeholder="Filter..." value={itemThings.category} onChange={handleChange}/>
                        <img className='img' src={Search}></img>
                    </div>
                    <div className="supplier">
                        <label className="labels"> Supplier </label>
                        <input className="form-input" name="supplier" placeholder="Enter a supplier name..." value={itemThings.supplier} onChange={handleChange}/>
                    </div>
                    <div className="description">
                        <label className="labels"> Description </label>
                        <input className="form-inputs" name="description" placeholder="Enter a description for the item..." value={itemThings.description} onChange={handleChange}/>
                    </div>
                    <div className="buttons">
                    <button className="submit-create-item" onClick={handleItemCreate} > Create </button>
                    <button className="submit-update-item"> Update </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
//I made a comment!