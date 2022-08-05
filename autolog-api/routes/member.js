const express = require("express")
const Inventory = require("../models/inventory")
const security = require("../middleware/security")
const permissions = require("../middleware/permissions");
const User = require("../models/user")
const Role = require("../models/role");
const Member = require("../models/member");
const router = express.Router()

// endpoint to show member list
router.get("/list", security.requireAuthenticatedUser, async(req,res,next) => {
    permissions.isAdminOfInventory(req,res,next);
    try {
        const { inventoryId } = req.query;
        const { user } = res.locals;

        

        const members = await Member.getInventoryMembers(inventoryId);

        return res.status(201).json({members});

    } catch (error) {
        next(error);
    }
})

// add member to inventory
router.post("/", security.requireAuthenticatedUser, async (req,res,next) => {
    try {
        // get user that will be the "owner" of the inventory
        const { user } = res.locals;
        const { inventoryId } = req.query;
    
        const addResult = await Member.addUserToInventory(inventoryId, req.body.userEmail, req.body.roleName);

        return res.status(201).json({addResult});

    } catch (error) {
        next(error)
    }
})

// endpoint to update member role within inventory specified in query param
router.patch("/", security.requireAuthenticatedUser, async(req,res,next) => {
    try {
        const { inventoryId } = req.query;

        const updateResult = await Member.updateMember(inventoryId, req.body.userEmail, req.body.roleName);
        
        res.status(200).json({message: "success!"})
    } catch (error) {
        next(error);
    }
})

// endpoint to remove member from inventory
router.delete("/", security.requireAuthenticatedUser, async(req,res,next) => {
    try {
        const { inventoryId } = req.query;

        const deleteResult = await Member.removeMember(inventoryId, req.body.userEmail);

        res.status(200).json({message: "success!"});
    } catch (error) {
        next(error);
    }
})

module.exports = router