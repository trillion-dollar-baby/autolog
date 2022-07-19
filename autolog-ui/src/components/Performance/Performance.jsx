import * as React from 'react';
import './Performance.css'
import Table from '../Table/Table'

export default function Performance() {
    const testCol = ["ID", "PART", "Quantity"]
    const testArr = [{ID: 5, PART: "hammer", Quantity: 5}, {ID: 6, PART: "screw", Quantity: 10}, {ID: 15, PART: "table", Quantity: 3}]
    return (
        <div className='performance-content'>
            <Table tableElementArray={testArr} tableColumnLabelArray={testCol} />
        </div>
    )
}