const express = require("express")
const Performance = require("../models/performance")
const security = require("../middleware/security")
const router = express.Router()


// endpoint to get default performance
router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        // Get the user and selected inventory
        const inventoryId  = req.query.inventoryId;

        // Query for performance array sorted by category
        const performance = await Performance.getPerformanceSortedByCategory(inventoryId);
        return res.status(200).json({ performance });
    } 
    catch(err) {
        next(err)
    }
})



module.exports = router