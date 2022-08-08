const express = require("express")
const Invoice = require("../models/invoice")
const security = require("../middleware/security")
const router = express.Router()


// Endpoint to get default performance
router.post("/create", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        // Get the selected inventory's ID
        const inventoryId = req.query.inventoryId;
        const { itemFields, invoiceFields } = req.body;

        // Query for performance array sorted by category
        const invoice = await Invoice.createInvoice(invoiceFields, inventoryId);
        const soldItems = await Invoice.createSoldItemRecords(itemFields, invoice.id)
        const results = [invoice, ...soldItems]
        return res.status(201).json({ results });
    } 
    catch(err) {
        next(err)
    }
})

router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const inventoryId = req.query.inventoryId;

        const invoices = Invoice.listInvoices(inventoryId);

        return res.status(200).json({ invoices });
    }
    catch(err) {
        next(err);
    }
})



module.exports = router