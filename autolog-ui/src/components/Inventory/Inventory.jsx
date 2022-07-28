import * as React from "react";
import { useState } from "react";
import { useContext } from "react";
import "./Inventory.css";
import Table from "../Table/Table";
import Topbar from "../Topbar/Topbar";
import Dropdown from "../Dropdown/Dropdown";
import FormInput from "../FormInput/FormInput";
import ItemContext from "../../contexts/items";
import InventoryContext from "../../contexts/inventory";
import Loading from "../Loading/Loading";

export default function Inventory() {
  const { processingContext, initializedContext } =
    useContext(InventoryContext);
  const [isProcessing, setIsProcessing] = processingContext;
  const [initialized, setInitialized] = initializedContext;
  const { itemContext } = useContext(ItemContext);
  const [items, setItems] = itemContext;
  const [value, setValue] = useState("");
  const { searchContext } = useContext(ItemContext);
  const [searchItem] = searchContext;

  const settingsRoutes = [
    {
      name: "Inventory",
      to: "./",
    },
    {
      name: "Orders",
      to: "/item/create",
    },
  ];

  const nameFilters = ["A", "B", "C"];
  const categoryFilter = ["Tools", "Parts", "Cars"];

  const onChange = (event) => {
    setValue(event.target.value);
  };
  async function handle(e, searchTerm) {
    // setValue(searchTerm);
    if (e.key === "Enter") {
      e.preventDefault();
      searchTerm = value;
      setIsProcessing(true);
      const result = await searchItem(searchTerm, 0);
      setIsProcessing(false);
      //reset page number
      // setPageNumber(page)

      console.log("search", searchItem);

      setItems(result.items);
      console.log(result.items);
    }
    console.log("no search currently");
  }

  // function search(rows){
  //   const columns = rows[0] && Object.keys(rows[0]);
  //   return rows.filter((row)=>
  //   columns.some(
  //     (column) => row[column].toString().toLowerCase().indexOf(value.toLowerCase()) > -1
  //   )
  //   );
  // }

  return (
    <div className="inventory-content">
      <div className="topbar-container">
        <Topbar
          routes={settingsRoutes}
          buttonName={"Create"}
          buttonPath={"/item/create"}
        />
      </div>
      <div className="filter-container">
        <div className="search-bar">
          <FormInput
            data={{
              name: "search",
              type: "text",
              placeholder: "Search for items...",
            }}
            inputValue={value}
            onChange={onChange}
            onkeypress={handle}
          />
        </div>
        <div className="filter-by-name">
          <Dropdown items={nameFilters} value={"Sort by name"} />
        </div>
        <div className="filter-by-category">
          <Dropdown items={categoryFilter} value={"Sort by category"} />
        </div>
      </div>
      <div className="table-container">
        {isProcessing || !initialized ? (
          <Loading />
        ) : (
          <Table
            tableLabel={"Results"}
            tableElementArray={items.length ? items : []}
            tableColumnLabelArray={items.length ? Object.keys(items[0]) : []}
          />
        )}
      </div>
    </div>
  );
}
