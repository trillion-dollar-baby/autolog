import * as React from 'react';
import './BarChart.css';
import Chart from 'chart.js/auto'
import { Bar } from 'react-chartjs-2';

export default function BarChart({data, options}) {
    return (
    <div className='bar-container'>
        <Bar option={options} data={data} />
    </div>
    )
}