import * as React from 'react';
import { useContext } from 'react';
import './Inventory.css'
import Table from '../Table/Table'
import Topbar from '../Topbar/Topbar'
import Dropdown from '../Dropdown/Dropdown'
import FormInput from '../FormInput/FormInput'
import ItemContext from '../../contexts/items';
import InventoryContext from '../../contexts/inventory';
import Loading from '../Loading/Loading';

export default function Inventory() {
    //TODO: implement
    const { processingContext, initializedContext } = useContext(InventoryContext)
    const [ isProcessing, setIsProcessing ] = processingContext
    const [ initialized, setInitialized ] = initializedContext
    const { itemContext } = useContext(ItemContext)
    const [ items, setItems ] = itemContext

    console.log(items);

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
                <Topbar routes={settingsRoutes} buttonName={"Create"} buttonPath={"/item/create"} />
            </div>
            <div className='filter-container'>
              <div className='search-bar'>
                <FormInput data={{name: "search", type: "text", placeholder: "Search for items..."}} inputValue={null} onChange={null} />
              </div>
              <div className='filter-by-name'>
                <Dropdown items={nameFilters} value={"Sort by name"}/>
              </div>
              <div className='filter-by-category'>
                <Dropdown items={categoryFilter} value={"Sort by ctgry"}/>
              </div>
            </div>
            <div className='table-container'>
                {(isProcessing || !initialized) ? <Loading /> :
                <Table tableLabel={"Results"} tableElementArray={(items.length) ? items : []} tableColumnLabelArray={(items.length) ? Object.keys(items[0]) : []}/>}
            </div>
        </div>
    )
}