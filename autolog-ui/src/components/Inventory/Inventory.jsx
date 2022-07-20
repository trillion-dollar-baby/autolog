import './Inventory.css'
import Table from '../Table/Table'
import Topbar from '../Topbar/Topbar'

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

    return (
        <div className='inventory-content'>
            <div className='topbar-container'>
                <Topbar routes={settingsRoutes} />
            </div>
            <div className='table-container'>
                <Table tableElementArray={testArr} tableColumnLabelArray={testCol} />
            </div>
        </div>
    )
}