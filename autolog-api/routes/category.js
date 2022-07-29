const express = require("express");
const Category = require("../models/category");
const security = require("../middleware/security");
const router = express.Router();

// get list of categories
router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        // get query from path
        const {inventoryId} = req.query;

        const result = await Category.getItems(inventoryId);

        res.status(200).json({categories: result});

    } catch (error) {
        next(error);
    }
});

// create list of categories
router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        // get required keys to be handled in model
        const { inventoryId } = req.body;
        const { categoryName } = req.body;

        const result = await Category.createItem({inventoryId, categoryName});

        res.status(201).json({ category: result });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
