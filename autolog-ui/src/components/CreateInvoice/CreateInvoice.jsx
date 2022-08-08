import React, { useState } from 'react'
import { motion } from 'framer-motion';
import nhtsa from 'nhtsa';
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
      label: 'Client First Name',
      name: 'recipientFirstName',
      type: 'text',
      placeholder: 'Pollos Hermanos'
    },
    {
      label: 'Client Last Name',
      name: 'recipientLastName',
      type: 'text',
      placeholder: 'Pollos Hermanos'
    },
    {
      label: 'Client Phone',
      name: 'recipientPhone',
      type: 'text',
      placeholder: '1234567890'
    },
    {
      label: 'Date',
      name: 'date',
      type: 'text',
      placeholder: 'DD-MM-YYYY'
    },
    {
      label: 'Client Address',
      name: 'recipientAddress',
      type: 'text',
      placeholder: 'Pollos Hermanos'
    },
    {
      label: 'Total Labor Cost',
      name: 'totalLabor',
      type: 'number',
      placeholder: '1234'
    },
  ]

  const createInvoiceVehicleFormArray = [
    {
      label: 'VIN Number',
      name: 'vehicleVin',
      type: 'text',
      placeholder: 'Pollos Hermanos'
    },
    {
      label: 'Vehicle Year',
      name: 'vehicleYear',
      type: 'text',
      placeholder: 'Pollos Hermanos'
    },
    {
      label: 'Make',
      name: 'vehicleMake',
      type: 'text',
      placeholder: 'Pollos Hermanos'
    },
    {
      label: 'Model',
      name: 'vehicleModel',
      type: 'text',
      placeholder: 'Pollos Hermanos'
    },
    {
      label: 'Plate Number',
      name: 'vehiclePlateNumber',
      type: 'text',
      placeholder: 'Pollos Hermanos'
    },
    {
      label: 'Color',
      name: 'color',
      type: 'text',
      placeholder: 'Pollos Hermanos'
    },
  ]

  const columnLabel = ["name", "in stock", "quantity", "cost", "retail price"]

  const handleOnSearchVin = async () => {
    const {data} = await nhtsa.decodeVin(invoiceForm.vehicleVin);

    data?.Results.forEach((obj) => {
      if(obj.Variable == "Model") {
        setInvoiceForm((prevForm) => ({
          ...prevForm,
          ['vehicleModel']: obj.Value
        }));
      }
      if(obj.Variable == "Model Year") {
        setInvoiceForm((prevForm) => ({
          ...prevForm,
          ['vehicleYear']: obj.Value
        }));
      }
      if(obj.Variable == "Make") {
        setInvoiceForm((prevForm) => ({
          ...prevForm,
          ['vehicleMake']: obj.Value
        }));
      }
    })
  }

  // calculate table with summary of total costs
  const calculateTotals = () => {
    let accumulatorTotal = 0;
    selectedItems.forEach(obj => { 
      accumulatorTotal += parseFloat(obj['sell price']) * parseInt(obj.quantity); 
    })

    setTotal(accumulatorTotal);
    setTotalWithLabor(parseFloat(invoiceForm.totalLabor || 0) + accumulatorTotal);
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
          <label className="title"> Client Details and Labor </label>
        </div>
        <div className="content">
          <Form formState={invoiceForm} setFormState={setInvoiceForm} formArray={createInvoiceFormArray} />
        </div>
        <div className="divider">
          <label className="title"> Vehicle Details </label>
        </div>
        <div className="content">
          <Form formState={invoiceForm} setFormState={setInvoiceForm} formArray={createInvoiceVehicleFormArray} />
        </div>
        <div className="total-price-container">
          <span id='subtotal-price'>Total without labor: ${total}</span>
          <span id="subtotal-labor-price">Total with labor: ${totalWithLabor}</span>
          <span id="grandtotal-price">Grand total: $9999</span>
        </div>
        

        <div className="button-container">
          <ButtonAction label={"Create Invoice"} color={"var(--actionBlueAccent)"} onClick={handleOnSubmit} />
          <ButtonAction label={"Load VIN"} color={"var(--actionBlue)"} onClick={handleOnSearchVin} />
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