import * as React from 'react';
import { useContext } from 'react';
import './Inventory.css'
import Table from '../Table/Table'
import Topbar from '../Topbar/Topbar'
import Dropdown from '../Dropdown/Dropdown'
import FormInput from '../FormInput/FormInput'
import ItemContext from '../../contexts/items';

export default function Inventory() {
    //TODO: implement

    const { itemContext } = useContext(ItemContext)
    const [ items, setItems ] = itemContext

    const settingsRoutes = [
        {
          name: 'Inventory',
          to: './'
        },
        {
          name: 'Orders',
          to: '/item/create'
        }
      ]

    const nameFilters = ["A", "B", "C"]
    const categoryFilter = ["Tools", "Parts", "Cars"]

    return (
        <div className='inventory-content'>
            <div className='topbar-container'>
                <Topbar routes={settingsRoutes} buttonName={"Create"} buttonPath={"./create"} />
            </div>
            <div className='filter-container'>
              <div className='search-bar'>
                <FormInput data={{name: "search", type: "text", placeholder: "Search for items..."}} inputValue={null} onChange={null} />
              </div>
              <div className='filter-by-name'>
                <Dropdown items={nameFilters} value={"Sort by name"}/>
              </div>
              <div className='filter-by-category'>
                <Dropdown items={categoryFilter} value={"Sort by category"}/>
              </div>
            </div>
            <div className='table-container'>
                <Table tableElementArray={(items.length) ? items : []} tableColumnLabelArray={(items.length) ? Object.keys(items[0]) : []}/>
            </div>
        </div>
    )
}