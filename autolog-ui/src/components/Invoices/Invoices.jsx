import { useState, useEffect } from "react";
import { useContext } from "react";
import { motion } from "framer-motion";
import "./Invoices.css";
import Table from "../Table/Table";
import Topbar from "../Topbar/Topbar";
import Dropdown from "../Dropdown/Dropdown";
import FormInput from "../FormInput/FormInput";
import InventoriesContext from "../../contexts/inventories";
import Loading from "../Loading/Loading";
import { ToastContext } from "../../contexts/toast";
import apiClient from "../../services/apiClient";

export default function Invoices() {
  const { notifyError, notifySuccess } = useContext(ToastContext);

  // Inventory Context
  const { processingContext, initializedContext, selectedInventoryContext } = useContext(InventoriesContext);
  const [isProcessing, setIsProcessing] = processingContext;
  const [initialized, setInitialized] = initializedContext;
  const [selectedInventory, setSelectedInventory] = selectedInventoryContext;
  
  const [invoicesList, setInvoicesList] = useState([]);

  const settingsRoutes = [
    {
      name: "Orders",
      to: "/inventory/orders",
    },
    {
      name: "Stock", 
      to: "/inventory/stock"
    },
    {
      name: "Invoices",
      to: "/inventory/invoice",
    },
  ];

  const columnLabel = ["id", "recipientFirstName", "recipientLastName", "totalLabor", "totalMaterial"];

  useEffect(() => {
    const fetchInvoiceList = async () => {
        const result = await apiClient.getInvoiceList(selectedInventory?.inventoryId);
        console.log(result);

        if(result?.data) {
            setInvoicesList(result?.data.invoices);
        }
    }
    
    if(selectedInventory?.inventoryId){
        fetchInvoiceList();
    }

    }, [selectedInventory?.inventoryId]);

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
          buttonName={"Create Item"}
          buttonPath={"/item/create"}
        />
      </div>

      <div className="filter-container">
        
      </div>

      <div className="table-container">
        {isProcessing || !initialized ? (
          <Loading />
        ) : (
          <Table
            tableLabel={"List of Invoices"}
            tableElementArray={invoicesList.length ? invoicesList : []}
            tableColumnLabelArray={columnLabel}
            isInvoiceTable={true}
          />
        )}
      </div>
    </motion.div>
  );
}
