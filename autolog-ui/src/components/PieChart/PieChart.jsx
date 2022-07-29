import * as React from 'react';
import './PieChart.css';
import Chart from 'chart.js/auto'
import { Pie } from 'react-chartjs-2';

export default function PieChart({data, options}) {
    return (
    <div className='pie-container'>
        <Pie option={options} data={data} />
    </div>
    )
}