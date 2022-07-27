const express = require("express")
const Performance = require("../models/performance")
const security = require("../middleware/security")
const User = require("../models/user")
const router = express.Router()
//security.requireAuthenticatedUser


// endpoint to get default performance
router.get("/:inventoryId", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        // Get the user and selected inventory
        const { inventoryId } = req.params;

        // Query for performance array sorted by category
        const performance = await Performance.getPerformanceSortedByCategory(inventoryId);
        return res.status(201).json({ performance });
    } 
    catch(err) {
        next(err)
    }
})



module.exports = router