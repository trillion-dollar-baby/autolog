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

// endpoint to show member list
router.post("/member/list", security.requireAuthenticatedUser, async(req,res,next) => {
    try {
        const { user } = res.locals;

        const members = await Inventory.getInventoryMembers(req.body.inventoryId);

        return res.status(201).json({members});

    } catch (error) {
        next(error);
    }
})

// TODO: CHECK IF USER IS OWNER OF INVENTORY (create middleware function)
router.post("/member", security.requireAuthenticatedUser, async (req,res,next) => {
    try {
        // get user that will be the "owner" of the inventory
        const { user } = res.locals;
    
        const addResult = await Inventory.addUserToInventory(user, req.body.userEmail, req.body.inventoryId);

        return res.status(201).json({addResult});

    } catch (error) {
        next(error)
    }
})

router.get("/member/roles", security.requireAuthenticatedUser, async (req,res,next) => {
    try {
        const { inventoryId } = req.query;

        const result = await Role.getRoles(inventoryId);
        
        return res.status(200).json({result});
    } catch (error) {
        next(error);
    }
})

module.exports = router