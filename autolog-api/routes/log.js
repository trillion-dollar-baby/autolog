const express = require("express")
const Log = require("../models/log")
const security = require("../middleware/security")
const router = express.Router()


// Endpoint to get default performance
router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        // Get the user and selected inventory
        const inventoryId = req.query.inventoryId;

        // Query for performance array sorted by category
        const logs = await Log.fetchLogs(inventoryId);
        return res.status(200).json({ logs });
    } 
    catch(err) {
        next(err)
    }
})


module.exports = router