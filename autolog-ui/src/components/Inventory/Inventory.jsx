import { useState, useEffect } from "react";
import { useContext } from "react";
import { motion } from "framer-motion";
import "./Inventory.css";
import Table from "../Table/Table";
import Topbar from "../Topbar/Topbar";
import Dropdown from "../Dropdown/Dropdown";
import FormInput from "../FormInput/FormInput";
import InventoryContext from "../../contexts/inventory";
import InventoriesContext from "../../contexts/inventories";
import Loading from "../Loading/Loading";
import { ToastContext } from "../../contexts/toast";
import apiClient from "../../services/apiClient";
import ButtonAction from "../Button/ButtonAction";
import { useNavigate } from "react-router";
import ItemContext from "../../contexts/items";

export default function Inventory() {
  const navigate = useNavigate();

  const { notifyError, notifySuccess } = useContext(ToastContext);
  
  // Items Context
  const { selectedItemsContext } = useContext(ItemContext);
  const [selectedItems, setSelectedItems] = selectedItemsContext; 
  
  // Inventory Context
  const { processingContext, initializedContext, selectedInventoryContext } = useContext(InventoriesContext);
  const [isProcessing, setIsProcessing] = processingContext;
  const [initialized, setInitialized] = initializedContext;
  const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

  // Item Context
  const { inventoryItemContext, searchContext, searchTermContext } = useContext(InventoryContext);
  const [inventoryItems] = inventoryItemContext;
  const [searchOrders] = searchContext;
  const [searchTerm, setSearchTerm] = searchTermContext;

  // Categories constants
  const [isFetching, setIsFetching] = useState(false);
  const [categoryItems, setCategoryItems] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  
  const [pageNumber, setPageNumber] = useState(0);

  const settingsRoutes = [
    {
      name: "Items",
      to: "./",
    },
    {
      name: "Purchases",
      to: "/purchase/"
    },
    {
      name: "Invoices",
      to: "/invoice/",
    },
  ];

  const columnLabel = ["name", "category", "quantity", "cost", "retail price"]

  const onChangeSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  async function handleOnSearch(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      setIsProcessing(true);

      // as it is a new search, reset page number
      setPageNumber(0);

      const result = await searchOrders(searchTerm, 0);
      setIsProcessing(false);

      setInventoryItems(result?.items);
      if(result?.items){
        setInventoryItems(result?.items);
      }

      if (result.items.length === 0) {
        notifyError("No items were found!");
      }
      setIsProcessing(false);
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
      setInventoryItems(result?.items);
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

  const handleOnCreateInvoice = () => {
    if(selectedItems.length > 0) {
      navigate('/invoice/create');
    } else {
      notifyError("You need to first select items to create an invoice!")
    }
  }

  const handleOnCreatePurchase = () => {
    if(selectedItems.length > 0) {
      navigate('/purchase/create');
    } else {
      notifyError("You need to first select items to create a purchase!")
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

      <div className="button-container">
        <ButtonAction label={"Create Invoice"} color={"var(--actionGreen)"} onClick={handleOnCreateInvoice}/>
        <ButtonAction label={"Create Purchase"} color={"var(--actionBlue)"} onClick={handleOnCreatePurchase}/>
      </div>

      <div className="table-container">
        {isProcessing || !initialized ? (
          <Loading />
        ) : (
          <Table
            tableLabel={"Results"}
            tableElementArray={inventoryItems.length ? inventoryItems : []}
            tableColumnLabelArray={columnLabel}
            isItemTable={true}
            fetchMoreItems={fetchMoreItems}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        )}
      </div>
    </motion.div>
  );
}
