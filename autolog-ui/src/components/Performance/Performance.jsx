import * as React from 'react';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import './Performance.css'
import Table from '../Table/Table'
import BarChart from '../BarChart/BarChart'
import PieChart from '../PieChart/PieChart';
import Dropdown from '../Dropdown/Dropdown'
import PerformanceContext from '../../contexts/performance';


export default function Performance() {
    const { performanceContext, filterContext, sortContext, visualPerformanceContext } = useContext(PerformanceContext)
    
    const [ performance, setPerformance ] = performanceContext
    const [ visualPerformance ] = visualPerformanceContext
    const [ filter, setFilter ] = filterContext
    const [ sort, setSort ] = sortContext

    let graphData = {};

    if (visualPerformance?.length) {
        const labels = [];
        const data = [];

        visualPerformance.forEach((item) => {
            labels.push(item.month);
            data.push(parseInt(item["total profit"]))
        })

        graphData = {
            labels: [...labels], datasets: [{
                label: "Monthly Profit",
                data: [...data],
                backgroundColor: "lightblue"
            }]
        }
    }

    // Labels to render for the dropdown
    const sortItems = ["Quantity ↑", "Quantity ↓"]
    const filterItems = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "December"]
    const columnLabel = ["name", "category", "total quantity", "total cost", "total sell price", "total profit", "month"]

    const containerVariants = {
      hidden: {
          opacity: 0,
      },
      visible: {
          opacity: 1,
          transition: { delay: 0.3, duration: 0.3 }
      },
      exit: {
          opacity: 0,
          transition: { ease: 'easeInOut' }
      }
  	}
    
    return (
        <motion.div
			      variants={containerVariants}
            initial={"hidden"}
            animate={"visible"}
            exit={"exit"}
            className="performance-content">
            <div className='visual-data-container'>
                <div className='bar-chart-container'>
                    {graphData.datasets ?
                    <BarChart data={graphData} options={{responsive:true}}/>
                    : <></> }
                </div>
                {/* <div className='pie-chart-container'>
                    <PieChart data={data} options={{responsive:true}}/>
                </div> */}
            </div>

            <div className='filter-container'>
              <div className='filter-by-week' data-tooltip="Sort inventory performance by quantity ascending or descending order">
                <Dropdown items={sortItems} value={"Sort By"} onSelect={setSort}/>
              </div>
              <div className='filter-by-month' data-tooltip="Sort inventory performance by month">
                <Dropdown items={filterItems} value={"Filter By"} onSelect={setFilter}/>
              </div>
            </div>

            <div className='table-container'>
                <Table 
                tableLabel={"Results"} 
                tableElementArray={(performance.length) ? performance : ['No results...']} 
                tableColumnLabelArray={columnLabel}/>
            </div>
        </motion.div>
    )
}