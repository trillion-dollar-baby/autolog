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
    const { performanceContext } = useContext(PerformanceContext)
    const [ performance, setPerformance ] = performanceContext

    const testCol = ["Category", "Month", "Total Quantity"]
    const testArr = [{Category: "Paint", Month: "Janurary", "Total Spent": 900, "Total Quantity": 5}, 
                    {Category: "Tools", Month: "Feburary", "Total Spent": 700, "Total Quantity": 15},
                    {Category: "Materials", Month: "March", "Total Spent": 600, "Total Quantity": 5},
                    {Category: "Parts", Month: "April", "Total Spent": 700, "Total Quantity": 3},
                    {Category: "Other", Month: "May", "Total Spent": 7100, "Total Quantity": 8}] 

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

    const data = {
        labels: [2017, 2018], datasets: [{
            label: "Users Gained",
            data: [200, 300],
            backgroundColor: "lightblue"
        }]
    }

    const weekFilters = ["Week 1", "Week 2", "Week 3", "Week 4"]
    const monthFilter = ["Jan", "Feb", "March"]

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
                    <BarChart data={data} options={{responsive:true}}/>
                </div>
                <div className='pie-chart-container'>
                    <PieChart data={data} options={{responsive:true}}/>
                </div>
            </div>

            <div className='filter-container'>
              <div className='filter-by-week'>
                <Dropdown items={weekFilters} value={"Sort by week"}/>
              </div>
              <div className='filter-by-month'>
                <Dropdown items={monthFilter} value={"Sort by month"}/>
              </div>
            </div>

            <div className='table-container'>
                <Table tableLabel={"Results"} tableElementArray={(performance.length) ? performance : []} tableColumnLabelArray={(performance.length) ? Object.keys(performance[0]) : []}/>
            </div>
        </motion.div>
    )
}