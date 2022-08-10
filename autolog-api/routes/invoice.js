const express = require("express")
const Invoice = require("../models/invoice")
const security = require("../middleware/security")
const router = express.Router()


// Endpoint to get default performance
router.post("/create", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        // Get the selected inventory's ID
        const { inventoryId } = req.query;
        const { itemsFields, invoiceFields } = req.body;
        const { user } = res.locals;

        // Query for performance array sorted by category
        const invoice = await Invoice.createInvoice(inventoryId, invoiceFields, user);
        const soldItems = await Invoice.createSoldItemRecords(itemsFields, invoice.id);

        const results = {invoice, soldItems: [...soldItems]}
        return res.status(201).json({ results });
    } 
    catch(err) {
        next(err)
    }
})

router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const { inventoryId }= req.query;

        const invoices = await Invoice.listInvoices(inventoryId);

        return res.status(200).json({ invoices });
    }
    catch(err) {
        next(err);
    }
})


router.post("/pdf", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const { invoice, selectedInventory } = req.body;

        const pdfString = await Invoice.renderPdfInBrowser(invoice, selectedInventory);

        return res.status(200).json({ pdfString });
    }
    catch(err) {
        next(err);
    }
})



router.get("/id/:invoiceId", security.requireAuthenticatedUser, async(req,res,next) => {
    try {
        const { inventoryId } = req.query;
        const { invoiceId } = req.params;
        
        const invoice = await Invoice.getInvoice(invoiceId);

        return res.status(200).json({invoice})

    } catch (error) {
        next(error);
    }
})



module.exports = router