import * as React from "react";
import { useState } from "react";
import { useContext } from "react";
import { motion } from "framer-motion";
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
  const { itemContext, searchContext, searchTermContext} = useContext(ItemContext);
  const [items, setItems] = itemContext;
  const [searchItem] = searchContext;
  const [searchTerm, setSearchTerm] = searchTermContext;


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
<<<<<<< HEAD
      setItems(result.items);
      console.log(result.items)
      if(result.items.length == 0){
        setItems(items);
        alert("no such item exists");
      }
    } 
=======

      setItems(result?.items);
    }
>>>>>>> 22d0b91c5ea1eceacbeccb99c9f7912648d3929e
  }

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
			className="inventory-content">
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
    </motion.div>
  );
}
