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
  // Inventory Context
  const { processingContext, initializedContext } = useContext(InventoryContext);
  const [isProcessing, setIsProcessing] = processingContext;
  const [initialized, setInitialized] = initializedContext;

  // Item Context
  const { itemContext, searchContext, searchTermContext, searchFilterContext } = useContext(ItemContext);
  const [items, setItems] = itemContext;
  const [searchItem] = searchContext;
  const [searchTerm, setSearchTerm] = searchTermContext;
  const [searchFilter, setSearchFilter] = searchFilterContext;


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

  const searchFilters = ["name", "category", "createdAt", "updatedAt", "quantity"]
  const columnLabel = ["id", "name", "category", "createdAt", "updatedAt", "inventoryId", "quantity"]

  const onChange = (event) => {
    setSearchTerm(event.target.value);
  };

  async function handle(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      setIsProcessing(true);
      const result = await searchItem(searchTerm, 0);
      setIsProcessing(false);

      setItems(result.items);
    }
    console.error("no search currently");
  }

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
            inputValue={searchTerm}
            onChange={onChange}
            onkeypress={handle}
          />
        </div>
      </div>
      <div className="table-container">
        {isProcessing || !initialized ? (
          <Loading />
        ) : (
          <Table
            tableLabel={"Results"}
            tableElementArray={items.length ? items : []}
            tableColumnLabelArray={columnLabel}
          />
        )}
      </div>
    </div>
  );
}
