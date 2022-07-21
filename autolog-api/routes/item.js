const express = require("express")
const Item = require("../models/item")
const security = require("../middleware/security")
const router = express.Router()
//security.requireAuthenticatedUser

router.get("/",  async (req, res, next) => {
    try {
        //send json response to client with all of the user-owned item instances in an array
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
        const items = await Item.createItem({item: req.body, user: user})
        return res.status(201).json({ items })
    }
    catch(err) {
        next(err)
    }
})


module.exports = router