import * as React from 'react';
import { useContext } from 'react';
import './Performance.css'
import Table from '../Table/Table'
import BarChart from '../BarChart/BarChart'
import PieChart from '../PieChart/PieChart';
import Dropdown from '../Dropdown/Dropdown'
import PerformanceContext from '../../contexts/performance';


export default function Performance() {
    const { performanceContext, filterContext, sortContext } = useContext(PerformanceContext)
    
    const [ performance, setPerformance ] = performanceContext
    const [ filter, setFilter ] = filterContext
    const [ sort, setSort ] = sortContext

    const data = {
        labels: [2017, 2018], datasets: [{
            label: "Users Gained",
            data: [200, 300],
            backgroundColor: "lightblue"
        }]
    }

    // Labels to render for the dropdown
    const sortItems = ["Quantity ↑", "Quantity ↓"]
    const filterItems = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "December"]
    const columnLabel = ["category", "total quantity", "month"]

    return (
        <div className="performance-content">
            <div className='visual-data-container'>
                <div className='bar-chart-container'>
                    <BarChart data={data} options={{responsive:true}}/>
                </div>
                <div className='pie-chart-container'>
                    <PieChart data={data} options={{responsive:true}}/>
                </div>
            </div>

            <div className='filter-container'>
              <div className='filter-by-week'>
                <Dropdown items={sortItems} value={"Sort By"} onSelect={setSort}/>
              </div>
              <div className='filter-by-month'>
                <Dropdown items={filterItems} value={"Filter By"} onSelect={setFilter}/>
              </div>
            </div>

            <div className='table-container'>
                <Table 
                tableLabel={"Results"} 
                tableElementArray={(performance.length) ? performance : []} 
                tableColumnLabelArray={columnLabel}/>
            </div>
        </div>
    )
}