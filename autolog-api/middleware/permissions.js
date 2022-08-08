const { UnauthorizedError } = require("../utils/errors");
const Inventory = require("../models/inventory");
const Role = require("../models/role");

const hasEntryToInventory = async (req, res, next) => {
    try {
        const { user } = res.locals;
        const { inventoryId } = req.params;
        const inventory = await Inventory.listInventoriesWithAccess(user);

        if (!inventory.some((val) => val.inventoryId === inventoryId))
            throw new UnauthorizedError();

        return next();
    } catch (error) {
        return next(error);
    }
};

// is user owner
const isOwnerOfInventory = async (req, res, next) => {
    const { inventoryId } = req.params;
    const { user } = res.locals;

    try {
        const queryAdminId = `SELECT admin_id AS "adminId" FROM inventory WHERE id = $1`

        const resultAdminId = await db.query(queryAdminId, [inventoryId]);

        if(resultAdminId.rows[0].adminId !== user.id) {
            throw new UnauthorizedError();
        }

    } catch (error) {
        return next(error);
    }
};
// check if user is allowed to make changes
const hasPermissions = async (req, res, next) => {
    try {
        const { user } = res.locals;
        const { inventoryId } = req.params;

        const rolePermissions = await Role.getUserRole(inventoryId, user.id);

        if(!rolePermissions.create  && req.method == "POST")    throw new UnauthorizedError();
        if(!rolePermissions.read    && req.method == "GET")     throw new UnauthorizedError();
        if(!rolePermissions.update  && req.method == "PATCH")   throw new UnauthorizedError();
        if(!rolePermissions.delete  && req.method == "DELETE")  throw new UnauthorizedError();

    } catch (error) {
        return next(error);
    }
};

module.exports = {
    hasEntryToInventory,
};
