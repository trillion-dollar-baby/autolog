const express = require("express")
const Inventory = require("../models/inventory")
const security = require("../middleware/security")
const permissions = require("../middleware/permissions");
const User = require("../models/user")
const Role = require("../models/role")
const router = express.Router()


// endpoint to show what inventories the user has access to
router.get("/",  async (req, res, next) => {
    try {
        //send json response to client 
        const { user } = res.locals
        const inventory = await Inventory.listInventoriesWithAccess(user);
        return res.status(200).json({ inventory })
    } catch(err) {
        next(err)
    }
})

// create inventory
router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const { user } = res.locals
        const inventory = await Inventory.createInventory({inventory: req.body, user})
        
        // create default roles for every new inventory using the inventoryId provided
		await Role.createDefaultRoles(inventory.inventoryId);

        // create relationship in user to inventory appending the owner as an admin
        await Inventory.createRelationship(user, inventory.inventoryId);
        
        return res.status(201).json({ inventory })
    }
    catch(err) {
        next(err)
    }
})

// endpoint to show what inventories does the user created
router.get("/me",  async (req, res, next) => {
    try {
        //send json response to client 
        const { user } = res.locals
        const inventory = await Inventory.listOwnedInventories(user);
        return res.status(200).json({ inventory })
    } catch(err) {
        next(err)
    }
})

module.exports = router