import './Inventory.css'
import Table from '../Table/Table'
import Topbar from '../Topbar/Topbar'
import Dropdown from '../Dropdown/Dropdown'
import FormInput from '../FormInput/FormInput'

export default function Inventory() {
    //TODO: implement
    const testCol = ["ID", "Part", "Quantity"]
    const testArr = [{ID: 5, Part: "hammer", Quantity: 5}, {ID: 6, Part: "screw", Quantity: 10}, {ID: 15, Part: "table", Quantity: 3}]

    const settingsRoutes = [
        {
          name: 'Inventory',
          to: './'
        },
        {
          name: 'Orders',
          to: './orders'
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
                <Table tableElementArray={testArr} tableColumnLabelArray={testCol}/>
            </div>
        </div>
    )
}