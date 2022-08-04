import { useState, useEffect } from "react";
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
import { ToastContext } from "../../contexts/toast";
import apiClient from "../../services/apiClient";

export default function Inventory() {
  const { notifyError, notifySuccess } = useContext(ToastContext);

  // Inventory Context
  const { processingContext, initializedContext, selectedInventoryContext } = useContext(InventoryContext);
  const [isProcessing, setIsProcessing] = processingContext;
  const [initialized, setInitialized] = initializedContext;
  const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

  // Item Context
  const { itemContext, searchContext, searchTermContext } = useContext(ItemContext);
  const [items, setItems] = itemContext;
  const [searchItem] = searchContext;
  const [searchTerm, setSearchTerm] = searchTermContext;

  // Categories constants
  const [isFetching, setIsFetching] = useState(false);
  const [categoryItems, setCategoryItems] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const [sortItems, setSortItems] = useState();
  const [selectedSort, setSelectedSort] = useState('Sort by');

  const [pageNumber, setPageNumber] = useState(0);

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

  const onChangeSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  async function handleOnSearch(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      setIsProcessing(true);

      const result = await searchItem(searchTerm, 0, selectedCategory);

      // as it is a new search, reset page number
      setPageNumber(0);

      setIsProcessing(false);


      if(result?.items){
        setItems(result?.items);
      }

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
    setIsProcessing(true);
    
    // format value
    const searchCategory = category.toLowerCase() === 'all' ? '' : category.toLowerCase();
    
    // save for infinite scrolling
    setSelectedCategory(searchCategory);  
    setPageNumber(0);

    const result = await searchItem(searchTerm, 0, searchCategory);

    if (result?.items) {
      setItems(result?.items);
    }

    if (result.items.length === 0) {
      notifyError("No items were found!");
    }
    setIsProcessing(false);
  }

  // Function triggered after reaching the bottom of table
  const fetchMoreItems = async () => {
    const searchCategory = selectedCategory?.toLowerCase() === 'all' ? '' : selectedCategory?.toLowerCase();

    const result = await searchItem(searchTerm || '', (pageNumber + 1) || 1, searchCategory || '');

    // append into array and increase page number for next request if user wants to keep scrolling
    if (result?.items) {
      setItems((prevItems) => ([...prevItems, ...result?.items]));
      setPageNumber((prevNum) => prevNum+1);
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

          <Dropdown value={"Search by"} items={categoryItems} onSelect={fetchItemsByCategory} />
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
            isItemTable={true}
            fetchMoreItems={fetchMoreItems}
          />
        )}
      </div>
    </motion.div>
  );
}
