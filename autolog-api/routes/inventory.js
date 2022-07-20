const express = require("express")
const Inventory = require("../models/inventory")
const security = require("../middleware/security")
const router = express.Router()
//security.requireAuthenticatedUser

router.get("/",  async (req, res, next) => {
    try {
        //send json response to client 
        const { user } = res.locals
        const inventory = await Inventory.listInventoryForUser(user)
        return res.status(201).json({ inventory })
    }
    catch(err) {
        next(err)
    }
})
router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        
        const { user } = res.locals
        const inventory = await Inventory.createInventory({inventory: req.body, user})
        return res.status(201).json({ inventory })
    }
    catch(err) {
        next(err)
    }
})

module.exports = router