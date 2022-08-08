import React, { useState } from 'react'
import { motion } from 'framer-motion';
import Form from '../Form/Form'

import './CreateInvoice.css';
import Table from '../Table/Table';
import ItemContext from '../../contexts/items';
import { useContext } from 'react';
import InvoiceTable from '../Table/InvoiceTable';
import ButtonAction from '../Button/ButtonAction';
import { useEffect } from 'react';

function CreateInvoice() {
  // Items Context
  const { itemContext, searchContext, searchTermContext, selectedItemsContext } = useContext(ItemContext);
  const [items, setItems] = itemContext;
  const [searchItem] = searchContext;
  const [searchTerm, setSearchTerm] = searchTermContext;
  const [selectedItems, setSelectedItems] = selectedItemsContext;

  const [invoiceForm, setInvoiceForm] = useState({});
  const [total, setTotal] = useState(0);
  const [totalWithLabor, setTotalWithLabor] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // form array for "item information" section
  const createInvoiceFormArray = [
    {
      label: 'Client Name',
      name: 'clientName',
      type: 'text',
      placeholder: 'Pollos Hermanos'
    },
    {
      label: 'Date',
      name: 'date',
      type: 'date',
      placeholder: 'DD-MM-YYYY'
    },
    {
      label: 'Total Labor Cost',
      name: 'labor',
      type: 'number',
      placeholder: '1234'
    }
  ]

  const columnLabel = ["name", "in stock", "quantity", "cost", "retail price"]

  // calculate table with summary of total costs
  const calculateTotals = () => {
    let accumulatorTotal = 0;
    selectedItems.forEach(obj => { 
      accumulatorTotal += parseFloat(obj['sell price']) * parseInt(obj.quantity); 
    })

    setTotal(accumulatorTotal);
    setTotalWithLabor(parseFloat(invoiceForm.labor || 0) + accumulatorTotal);
  }

  // on mount calculate prices
  useEffect(() => {
    calculateTotals();
  }, [selectedItems, invoiceForm])

  const handleOnSubmit = () => {

  }
  console.log(selectedItems);
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
      className={"create-invoice"}>
      <div className="header">
        <div className="header-title-wrapper">
          <label className="header-title"> Create a new invoice </label>
          {/* <label className='error-message'>{errorMessage}</label> */}
          {/* <label className='processing-message'>{isProcessing ? 'Processing...' : ''}</label> */}
        </div>
      </div>
      <div className="content">
        <div className="divider">
          <label className="title"> Details </label>
        </div>
        <div className="content">
          <Form formState={invoiceForm} setFormState={setInvoiceForm} formArray={createInvoiceFormArray} />
        </div>
        <div className="total-price-container">
          <span id='subtotal-price'>Total without labor: ${total}</span>
          <span id="subtotal-labor-price">Total with labor: ${totalWithLabor}</span>
          <span id="grandtotal-price">Grand total: $9999</span>
        </div>
        <div className="button-container">
          <ButtonAction label={"Create Invoice"} color={"var(--actionBlueAccent)"} onClick={handleOnSubmit} />
        </div>
      </div>

      <InvoiceTable
        tableElementArray={selectedItems}
        tableColumnLabelArray={columnLabel}
        tableLabel={"Items in invoice"}
        isItemTable={true}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
        calculateTotals={calculateTotals} />
    </motion.div>
  )
}

export default CreateInvoice