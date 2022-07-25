import * as React from 'react';
import './Table.css'

/**
 * Reusable Component for creating forms throughout the application
 * 
 * @param {useState} tableState useState value
 * @param {useState} setTableState useState setter
 * @param {Array} tableElementArray array of objects that hold the row values (matches {column label: values})
 * @param {Array} tableColumnArray array of string that holds the column labels
 */
export default function Table({ tableState, setTableState, tableElementArray, tableColumnLabelArray, onSubmit }) {
  return (
        <div className="table">
                {tableColumnLabelArray?.map((columnName, index) => (
                    <div key={`column-${index}`} className={`table-column`}> 
                            <p className='column-label'> {columnName.toUpperCase()} </p>
                        {tableElementArray?.map((rowItems, index) => (
                            <li className="row-item" key={`row-item-${index}`}> {rowItems[columnName]} </li>
                    ))} </div>
                ))}
        </div>
  )

}