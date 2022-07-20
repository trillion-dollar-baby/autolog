const express = require("express")
const Item = require("../models/item")
const security = require("../middleware/security")
const router = express.Router()
//security.requireAuthenticatedUser

router.get("/",  async (req, res, next) => {
    try {
        //send json response to client with all of the user-owned nutrition instances in an array
        const { user } = res.locals
        const items = await Item.listItemForUser(user)
        return res.status(201).json({ items })
    }
    catch(err) {
        next(err)
    }
})
router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        
        const { user } = res.locals
        const items = await Item.createItem({items: req.body, user})
        return res.status(201).json({ items })
    }
    catch(err) {
        next(err)
    }
})
router.get("/id/:itemId", async (req, res, next) => {
    try {
        const { itemId } = req.params.itemId
        const items = await Item.fetchItemById(itemId)
        console.log(JSON.stringify(items))
        return res.status(200).json({ items })
    }
    catch(err) {
        next(err)
    }
})


module.exports = router