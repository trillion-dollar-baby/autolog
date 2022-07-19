import * as React from 'react';
import './CreateItem.css'
import Search from "../../assets/Search.png"

export default function CreateItem() {
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
                    <input className="form-input" name="itemName" placeholder="Enter item name..."/>
                </div>
                <div className="quantity">
                    <label className="labels"> Quantity </label>
                    <input className="form-input" name="quantity" placeholder="0"/>
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
                    <input className="form-input" name="itemPrice" placeholder="$00.00"/>
                </div>
                <div className="standard-cost">
                    <label className="labels"> Standard Cost </label>
                    <input className="form-input" name="standardCost" placeholder="$00.00"/>
                </div>
                </div>
                <div className="header-2">
                    <label className="heading"> Additional Details </label>
                </div>
                <div className="create-input-fields">
                    <div className="category">
                        <label className="labels"> Category </label>
                        <input className="form-input" name="category" placeholder="Filter..."/>
                        <img className='img' src={Search}></img>
                    </div>
                    <div className="supplier">
                        <label className="labels"> Supplier </label>
                        <input className="form-input" name="supplier" placeholder="Enter a supplier name..."/>
                    </div>
                    <div className="description">
                        <label className="labels"> Description </label>
                        <input className="form-inputs" name="description" placeholder="Enter a description for the item..."/>
                    </div>
                    <div className="buttons">
                    <button className="submit-create-item"> Create </button>
                    <button className="submit-update-item"> Update </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
//I made a comment!