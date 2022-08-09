import * as React from "react";
import "./Table.css";
import { Link } from "react-router-dom";

/**
 * Reusable Component for creating forms throughout the application
 *
 * @param {Array} tableElementArray array of objects that hold the row values (matches {column label: values})
 * @param {Array} tableColumnLabelArray array of string that holds the column labels
 * @param {String} tableLabel a string for the table label
 */

export default function InvoiceTable({
    tableElementArray,
    tableColumnLabelArray,
    tableLabel,
    isItemTable = false,
    fetchMoreItems,
    setSelectedItems,
    selectedItems,
    isFetching,
    calculateTotals
}) {
    const tableRef = React.useRef();
    const [isSelected, setSelected] = React.useState(false);

    const onScroll = async () => {
        if (isItemTable) {
            // check if is fetching already to prevent multiple requests
            if (tableRef.current && !isFetching) {
                const { scrollTop, scrollHeight, clientHeight } = tableRef.current;

                // check if user reached to the bottom of the div
                if ((Math.ceil(scrollTop + clientHeight) >= Math.floor(scrollHeight) - 1)) {
                    await fetchMoreItems();
                }
            }
        }
    }

    // with provided useState setter, add/remove itself's only instance
    const addItemToSelected = (item) => {
        setSelectedItems((prevSelectedItems) => ([
            ...prevSelectedItems,
            { ...item }
        ]));
    }

    const removeItemFromSelected = (item) => {
        setSelectedItems((prevSelectedItems) => (prevSelectedItems.filter(prevItem => prevItem.id !== item.id)));
    }

    // for sell price we want to change its value manually when creating invoice
    const handleOnTableInputChange = (event, name) => {
        for (const item of selectedItems) {
            if(item.name === name) {
                item[event.target.name] = event.target.value
            }
        }
        calculateTotals();
    }

    // handle on select
    const onCheckboxClick = (event, item) => {
        // if (event.target.checked) {
        // addItemToSelected(item);
        // } else {
        removeItemFromSelected(item);
        // }
    }
    return (
        <div className="table">
            <div className="table-header">
                <label className="table-header-label"> {tableLabel} </label>
            </div>
            <div onScroll={onScroll} ref={tableRef} className="table-body">
                {/* if it is a item table, create checkbox to select item */}
                {isItemTable ?
                    <div key={`column-selected`} className={`table-column`}>
                        <p className="column-label">
                            {" "}{"SELECT"}{" "}
                        </p>
                        {tableElementArray?.map((rowItems, index) => (
                            <li className="row-item" key={`row-item-detail-${index}`}>
                                {" "}
                                <span
                                    onClick={(event) => { onCheckboxClick(event, rowItems) }}
                                    key={`row-item-checkbox-${index}`}
                                    name={`selected-${rowItems['id']}`}
                                    className="row-remove-button">Remove</span>
                                {" "}
                                {/* <input type={"checkbox"} checked={true} onChange={(event) => { onCheckboxClick(event, rowItems) }} key={`row-item-checkbox-${index}`} name={`selected-${rowItems['id']}`} /> {" "} */}
                            </li>
                        ))}{" "}
                    </div>
                    : <></>}
                {tableColumnLabelArray?.map((columnName, index) => (
                    <div key={`column-${index}`} className={`table-column`}>
                        <p className="column-label">
                            {" "}
                            {columnName.toUpperCase()}{" "}
                        </p>
                        {tableElementArray?.map((rowItems, index) => {
                            // all quantity columns will be an input element instead
                            if (columnName === "quantity") {
                                return (
                                    <>
                                        <li className="row-item" key={`row-item-${index}`}>
                                            {" "}
                                            <input className={"row-item-input"} 
                                                   type={"text"} 
                                                   name={"quantity"} 
                                                   defaultValue={1}
                                                   onChange={(e) => handleOnTableInputChange(e,rowItems.name)} />
                                            {" "}
                                        </li>
                                    </>)
                            } else {
                                return (
                                    <>
                                        <li className="row-item" key={`row-item-${index}`}>
                                            {" "}
                                            {rowItems[columnName]}{" "}
                                        </li>
                                    </>)
                            }
                        })
                        }
                        {" "}
                    </div>
                ))}
                {/* if it is a item table, leave a ItemDetail link for every item by their ID*/}
                {isItemTable ?
                    <div key={`column-detail`} className={`table-column`}>
                        <p className="column-label">
                            {" "}{"SELL PRICE"}{" "}
                        </p>
                        {tableElementArray?.map((rowItems, index) => (
                            <li className="row-item" key={`row-item-detail-${index}`}>
                                {" "}
                                <input className="row-item-input" 
                                       type={'text'} 
                                       name={"sell price"}
                                       defaultValue={rowItems['sell price']} 
                                       onChange={(e) => handleOnTableInputChange(e,rowItems.name)}
                                       placeholder={"Input price"}></input>
                                {" "}
                            </li>
                        ))}{" "}
                    </div>
                    : <></>}
            </div>
        </div >
    );
}
