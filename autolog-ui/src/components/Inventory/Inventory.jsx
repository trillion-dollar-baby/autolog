import './Inventory.css'
import Table from '../Table/Table'
import Topbar from '../Topbar/Topbar'
import Dropdown from '../Dropdown/Dropdown'
import FormInput from '../FormInput/FormInput'

export default function Inventory() {
    //TODO: implement
    const testCol = ["ID", "Date", "User"]
    const testArr = [{ID: 123456789, Date: "01-23-45", User: "MoeElias"}, 
                      {ID: 123456789, Date: "01-23-45", User: "MoeElias"}, 
                      {ID: 123456789, Date: "01-23-45", User: "MoeElias"}, 
                      {ID: 123456789, Date: "01-23-45", User: "MoeElias"},
                      {ID: 123456789, Date: "01-23-45", User: "MoeElias"}, 
                      {ID: 123456789, Date: "01-23-45", User: "MoeElias"},
                      {ID: 123456789, Date: "01-23-45", User: "MoeElias"}, 
                      {ID: 123456789, Date: "01-23-45", User: "MoeElias"},
                      {ID: 123456789, Date: "01-23-45", User: "MoeElias"}, 
                      {ID: 123456789, Date: "01-23-45", User: "MoeElias"},
                      {ID: 123456789, Date: "01-23-45", User: "MoeElias"}, 
                      {ID: 123456789, Date: "01-23-45", User: "MoeElias"},
                      {ID: 123456789, Date: "01-23-45", User: "MoeElias"}, 
                      {ID: 123456789, Date: "01-23-45", User: "MoeElias"}]

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
                <Table tableElementArray={testArr} tableColumnLabelArray={testCol}/>
            </div>
        </div>
    )
}