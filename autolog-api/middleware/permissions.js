const { UnauthorizedError } = require("../utils/errors");
const Inventory = require("../models/inventory");
const Role = require("../models/role");

const hasEntryToInventory = async (req, res, next) => {
    try {
        const { user } = res.locals;
        const { inventoryId } = req.query;
        const inventory = await Inventory.listInventoriesWithAccess(user);

        if (!inventory.some((val) => val.inventoryId === inventoryId))
            throw new UnauthorizedError("You are not listed as a member of this inventory");

        return next();
    } catch (error) {
        return next(error);
    }
};

// is user owner
const isOwnerOfInventory = async (req, res, next) => {
    const { inventoryId } = req.query;
    const { user } = res.locals;

    try {
        const queryAdminId = `SELECT admin_id AS "adminId" FROM inventory WHERE id = $1`

        const resultAdminId = await db.query(queryAdminId, [inventoryId]);

        if(resultAdminId.rows[0].adminId !== user.id) {
            throw new UnauthorizedError("Only the owner of the inventory is allowed to perform this action!");
        }

    } catch (error) {
        return next(error);
    }
};

// is user admin
const isAdminOfInventory = async (req,res,next) => {
    const { user } = res.locals;
    const { inventoryId } = req.query;

    try {
        console.log(user.id, inventoryId);
        const rolePermissions = await Role.getUserRole(inventoryId, user.id);
        
        if(rolePermissions.roleName !== 'admin') {
            throw new UnauthorizedError("Only admins are authorized to perform this action!");
        }

    } catch (error) {
        return next(error);
    }
}

// check if user is allowed to make changes
const hasPermissions = async (req, res, next) => {
    try {
        const { user } = res.locals;
        const { inventoryId } = req.query;

        const rolePermissions = await Role.getUserRole(inventoryId, user.id);

        if(!rolePermissions.create  && req.method == "POST")    throw new UnauthorizedError("You don't have creation powers for this action!");
        if(!rolePermissions.read    && req.method == "GET")     throw new UnauthorizedError("You don't have reading powers for this action!");
        if(!rolePermissions.update  && req.method == "PATCH")   throw new UnauthorizedError("You don't have update powers for this action!");
        if(!rolePermissions.delete  && req.method == "DELETE")  throw new UnauthorizedError("You don't have deletion powers for this action!");

    } catch (error) {
        return next(error);
    }
};

module.exports = {
    hasEntryToInventory,
    hasPermissions,
    isOwnerOfInventory,
    isAdminOfInventory
};
