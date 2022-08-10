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
import easyinvoice from 'easyinvoice';

export default function Invoices() {
  const { notifyError, notifySuccess } = useContext(ToastContext);

  // Inventory Context
  const { processingContext, initializedContext, selectedInventoryContext } = useContext(InventoriesContext);
  const [isProcessing, setIsProcessing] = processingContext;
  const [initialized, setInitialized] = initializedContext;
  const [selectedInventory, setSelectedInventory] = selectedInventoryContext;
  
  const [invoicesList, setInvoicesList] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const settingsRoutes = [
    // {
    //   name: "Orders",
    //   to: "/inventory/orders",
    // },
    {
      name: "Stock", 
      to: "/inventory/"
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

  
  const handleRenderPdfInBrowser = async (invoice) => {
    setIsLoading(true);
    const { data, error } = await apiClient.getPdfString(invoice);

    if (!error) {
      // Create a div w/ id of pdf
      const pdfDiv = document.createElement('div')
      pdfDiv.setAttribute('id', 'pdf')

      // Add it to the body of index.html
      document.body.appendChild(pdfDiv)

      // Onclick to get rid of pdf after clicking
      pdfDiv.addEventListener('click', (e) => { 
        document.body.removeChild(pdfDiv);
      })

      // Render the pdf to the created div
      const id = 'pdf'
      easyinvoice.render(id, data.pdfString.pdf)

      setIsLoading(false);
    }
    else {
      console.error(error);
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
    (loading) ? <Loading /> :
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
            handleOnClick={handleRenderPdfInBrowser}
          />
        )}
      </div>
    </motion.div>
  );
}
