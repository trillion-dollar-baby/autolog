const express = require("express")
const security = require("../middleware/security")
const permissions = require("../middleware/permissions");
const User = require("../models/user")
const Role = require("../models/role")
const router = express.Router()

// endpoint to get roles in inventory
router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const { inventoryId } = req.query;

        const result = await Role.getRoles(inventoryId);
        
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
})

// endpoint to create a role in inventory
router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const {inventoryId} = req.query;

        const { role } = req.body;

        const result = await Role.createRole(inventoryId, role);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
})

// endpoint to delete a role based on query
router.delete("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const { inventoryId, roleId } = req.query;

        const result = await Role.deleteRole(inventoryId, roleId);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
})

// endpoint to get user role of the user that is performing the request
router.get("/me", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const { user } = res.locals;
        const { inventoryId } = req.query;

        const result = await Role.getUserRole(inventoryId, user.id);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
})

module.exports = router;