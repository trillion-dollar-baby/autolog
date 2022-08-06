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
    isFetching
}) {
    const tableRef = React.useRef();
    const onScroll = async() => {
        if(isItemTable) {
            if(tableRef.current) {
                const {scrollTop, scrollHeight, clientHeight} = tableRef.current;
                
                // check if user reached to the bottom of the div
                // check if is fetching already to prevent multiple requests
                if((Math.ceil(scrollTop+clientHeight) === Math.floor(scrollHeight))) {
                    await fetchMoreItems();
                }
            }

        }
    }

    return (
        <div  className="table">
            <div className="table-header">
                <label className="table-header-label"> {tableLabel} </label>
            </div>
            <div onScroll={onScroll} ref={tableRef} className="table-body">
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
                :<></>} 
            </div>
        </div>
    );
}
