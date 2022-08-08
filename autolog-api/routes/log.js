const express = require("express")
const Log = require("../models/log")
const security = require("../middleware/security")
const router = express.Router()


// Endpoint to get logs
router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        // Get the user and selected inventory
        const inventoryId = req.query.inventoryId;

        // Query for logs related to given inventory
        const logs = await Log.fetchLogs(inventoryId);
        return res.status(200).json({ logs });
    } 
    catch(err) {
        next(err)
    }
})

router.get("/test", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const logs = await Log.fetchUserNameById(1);
        return res.status(200).json({ logs });
    } 
    catch(err) {
        next(err)
    }
})


module.exports = router