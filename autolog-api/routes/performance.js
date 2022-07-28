const express = require("express")
const Performance = require("../models/performance")
const security = require("../middleware/security")
const router = express.Router()


// Endpoint to get default performance
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

// Endpoint to get performance filtered by month
router.get("/filter", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        // Get the user and selected inventory
        const inventoryId = req.query.inventoryId;
        const month = req.query.month

        // Query for performance array sorted by category
        const performance = await Performance.getPerformanceFilteredByMonth(inventoryId, month);
        return res.status(200).json({ performance });
    } 
    catch(err) {
        next(err)
    }
})

// Endpoint to get performance sorted by ascending quantity
router.get("/sort/descending", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        // Get the user and selected inventory
        const inventoryId = req.query.inventoryId;
        const month = req.query.month

        // Query for performance array sorted by category
        const performance = await Performance.getPerformanceSortedByQuantityDesc(inventoryId, month);
        return res.status(200).json({ performance });
    } 
    catch(err) {
        next(err)
    }
})

// Endpoint to get performance sorted by ascending quantity
router.get("/sort/ascending", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        // Get the user and selected inventory
        const inventoryId = req.query.inventoryId;
        const month = req.query.month

        // Query for performance array sorted by category
        const performance = await Performance.getPerformanceSortedByQuantityAsc(inventoryId, month);
        return res.status(200).json({ performance });
    } 
    catch(err) {
        next(err)
    }
})


module.exports = router