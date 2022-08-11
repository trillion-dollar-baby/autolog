import React, { useState } from 'react'
import { motion } from 'framer-motion';
import Form from '../Form/Form'

import './CreateInvoice.css';

function CreateInvoice() {

  const [invoiceForm, setInvoiceForm] = useState({});

  // form array for "item information" section
  const createInvoiceFormArray = [
    {
      label: 'Sold to',
      name: 'soldTo',
      type: 'text',
      placeholder: 'Pollos hermanos'
    },
    {
      label: 'Date',
      name: 'date',
      type: 'text',
      placeholder: '1234'
    },
  ]

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
        <Form formState={invoiceForm} setFormState={setInvoiceForm} formArray={createInvoiceFormArray} />
      </div>
    </motion.div>
  )
}

export default CreateInvoice