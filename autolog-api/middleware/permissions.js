/**
 * TODO: IMPLEMENT
 */
const {UnauthorizedError} = require("../utils/errors")
const Inventory = require("../models/inventory")


const hasEntryToInventory = (req, res, next) => {
    try {
        const { user } = res.locals
        const {inventoryId} = req.params
        const inventory = await Inventory.listInventoriesWithAccess(user)
        
        if (!inventory.some(val => val.inventoryId === inventoryId))
            throw new UnauthorizedError()

        return next()    

    } catch (error){
        return next(error)
    }
}


module.exports = {
    hasEntryToInventory
}