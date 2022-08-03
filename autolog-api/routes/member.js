const express = require("express")
const Inventory = require("../models/inventory")
const security = require("../middleware/security")
const permissions = require("../middleware/permissions");
const User = require("../models/user")
const Role = require("../models/role")
const router = express.Router()

// endpoint to show member list
router.get("/list", security.requireAuthenticatedUser, async(req,res,next) => {
    try {
        const { inventoryId } = req.query;

        const members = await Inventory.getInventoryMembers(inventoryId);

        return res.status(201).json({members});

    } catch (error) {
        next(error);
    }
})

// TODO: CHECK IF USER IS OWNER OF INVENTORY (create middleware function)
router.post("/", security.requireAuthenticatedUser, async (req,res,next) => {
    try {
        // get user that will be the "owner" of the inventory
        const { user } = res.locals;
        const { inventoryId } = req.query;
    
        const addResult = await Inventory.addUserToInventory(inventoryId, req.body.userEmail, req.body.roleName);

        return res.status(201).json({addResult});

    } catch (error) {
        next(error)
    }
})

// endpoint to update member role within inventory specified in query param
router.patch("/", security.requireAuthenticatedUser, async(req,res,next) => {
    try {
        const { inventoryId } = req.query;

        const updateResult = await Inventory.updateMember(inventoryId, req.body.userEmail, req.body.roleName);
        
        res.status(200).json({message: "success!"})
    } catch (error) {
        next(error);
    }
})

// endpoint to remove member from inventory
router.delete("/", security.requireAuthenticatedUser, async(req,res,next) => {
    try {
        const { inventoryId } = req.query;

        const deleteResult = await Inventory.removeMember(inventoryId, req.body.userEmail);

        res.status(200).json({message: "success!"});
    } catch (error) {
        next(error);
    }
})

module.exports = router