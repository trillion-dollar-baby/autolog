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
export default function Table({
    tableElementArray,
    tableColumnLabelArray,
    tableLabel,
    isItemTable = false,
    fetchMoreItems,
    setSelectedItems,
    selectedItems
}) {
    const tableRef = React.useRef();
    const [isSelected, setSelected] = React.useState(false);

    const onScroll = async () => {
        if (isItemTable) {
            if (tableRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = tableRef.current;

                // check if user reached to the bottom of the div
                // check if is fetching already to prevent multiple requests
                if ((Math.ceil(scrollTop + clientHeight) >= Math.floor(scrollHeight) - 2)) {
                    await fetchMoreItems();
                }
            }
        }
    }

    // with provided useState, add/remove itself's only instance
    const addItemToSelected = (item) => {
        setSelectedItems((prevSelectedItems) => ([
            ...prevSelectedItems,
            { ...item }
        ]));
    }

    const removeItemFromSelected = (item) => {
        setSelectedItems((prevSelectedItems) => (prevSelectedItems.filter(prevItem => prevItem.id !== item.id)));
    }

    // handle on select
    const onCheckboxClick = (event, item) => {
        if (event.target.checked) {
            addItemToSelected(item);
        } else {
            removeItemFromSelected(item);
        }
    }
    console.log(selectedItems);
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
                                <input type={"checkbox"} onChange={(event) => { onCheckboxClick(event, rowItems) }} key={`row-item-checkbox-${index}`} name={`selected-${rowItems['id']}`} /> {" "}
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
                        {tableElementArray?.map((rowItems, index) => (
                            <>
                                <li className="row-item" key={`row-item-${index}`}>
                                    {" "}
                                    {rowItems[columnName]}{" "}
                                </li>

                            </>
                        ))}{" "}
                    </div>
                ))}
                {/* if it is a item table, leave a ItemDetail link for every item by their ID*/}
                {isItemTable ?
                    <div key={`column-detail`} className={`table-column`}>
                        <p className="column-label">
                            {" "}{"DETAIL"}{" "}
                        </p>
                        {tableElementArray?.map((rowItems, index) => (
                            <li className="row-item" key={`row-item-detail-${index}`}>
                                {" "}
                                <Link to={`/item/id/${rowItems["id"]}`} key={index} >Detail</Link>{" "}
                            </li>
                        ))}{" "}
                    </div>
                    : <></>}
            </div>
        </div>
    );
}
