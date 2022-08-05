import { useState, useEffect } from "react";
import { useContext } from "react";
import { motion } from "framer-motion";
import "./Orders.css";
import Table from "../Table/Table";
import Topbar from "../Topbar/Topbar";
import Dropdown from "../Dropdown/Dropdown";
import FormInput from "../FormInput/FormInput";
import OrdersContext from "../../contexts/orders";
import InventoriesContext from "../../contexts/inventories";
import Loading from "../Loading/Loading";
import { ToastContext } from "../../contexts/toast";
import apiClient from "../../services/apiClient";

export default function Orders() {
  const { notifyError, notifySuccess } = useContext(ToastContext);

  // Inventory Context
  const { processingContext, initializedContext, selectedInventoryContext } = useContext(InventoriesContext);
  const [isProcessing, setIsProcessing] = processingContext;
  const [initialized, setInitialized] = initializedContext;
  const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

  // Item Context
  const { ordersContext, searchContext, searchTermContext } = useContext(OrdersContext);
  const [orders] = ordersContext;
  const [searchOrders] = searchContext;
  const [searchTerm, setSearchTerm] = searchTermContext;

  // Categories constants
  const [isFetching, setIsFetching] = useState(false);
  const [categoryItems, setCategoryItems] = useState();
  const [selectedCategory, setSelectedCategory] = useState('Search by');

  const [sortItems, setSortItems] = useState();
  const [selectedSort, setSelectedSort] = useState('Sort by');

  const settingsRoutes = [
    {
      name: "Inventory",
      to: "/inventory",
    },
    {
      name: "Orders",
      to: "/inventory/orders",
    },
  ];

  const searchFilters = ["name", "category", "createdAt", "updatedAt", "quantity"]
  const columnLabel = ["id", "name", "category", "createdAt", "updatedAt", "inventoryId", "quantity"]

  const onChangeSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  async function handleOnSearch(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      setIsProcessing(true);
      const result = await searchOrders(searchTerm, 0);
      setIsProcessing(false);

      setOrders(result?.items);

      if (result.items.length === 0) {
        notifyError("No items were found!");
      }
    }
  }

  // On mount get categories
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await apiClient.getCategories(selectedInventory?.inventoryId);

      if (result?.data) {
        // Get only the name per object in array received 
        setCategoryItems(['all', ...result?.data?.categories.flatMap(i => i.categoryName)]);
      }
    }

    if (selectedInventory?.inventoryId) {
      fetchCategories();
    }
  }, [selectedInventory?.inventoryId]);

  // Fetch list by category if user selects one in dropdown
  const fetchItemsByCategory = async (category) => {
    const searchCategory = category.toLowerCase() === 'all' ? '' : category.toLowerCase();
    
    const result = await searchItem(searchTerm, 0, searchCategory);

    if (result?.items) {
      setOrders(result?.items);
    }

    if (result.items.length === 0) {
      notifyError("No items were found!");
    }
  }

  // framer-motion properties
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
            onChange={onChangeSearch}
            onkeypress={handleOnSearch}
          />

          <Dropdown value={selectedCategory} items={categoryItems} onSelect={fetchItemsByCategory} />
        </div>
      </div>
      <div className="table-container">
        {isProcessing || !initialized ? (
          <Loading />
        ) : (
          <Table
            tableLabel={"Results"}
            tableElementArray={orders.length ? orders : []}
            tableColumnLabelArray={columnLabel}
            isItemTable={true}
          />
        )}
      </div>
    </motion.div>
  );
}