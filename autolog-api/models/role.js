const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Role {

    // function to create default user roles on every new inventory
    static async createDefaultRoles(inventoryId) {
        if (!inventoryId) throw new BadRequestError("Internal error: No inventory ID received");

        const adminRoleResult = await this.createRole({
                inventoryId: inventoryId,
                name: "admin",
                create: true,
                read: true,
                update: true,
                delete: true,
        });

        const employeeRoleResult = await this.createRole({
                inventoryId: inventoryId,
                name: "employee",
                create: false,
                read: true,
                update: true,
                delete: false,
        });
    }

    // function to create roles
    static async createRole(role) {
        // check for required fields
        const requiredFields = ["inventoryId", "name", "create", "read", "update", "delete"];
        requiredFields.forEach((field) => {
            if(!role?.hasOwnProperty(field)) {
                throw new BadRequestError(`Error creating role! Missing role ${field}!`);
            }
        })

        // check if duplicate
        this.checkDuplicateRoleName(role.inventoryId, role.name);

        const result = await db.query(`
            INSERT INTO roles(
            inventory_id,
            role_id,
            role_name,
            item_create,
            item_read,
            item_update,
            item_delete
        )
        VALUES($1, (SELECT COUNT(*) FROM roles WHERE inventory_id = $1), $2, $3, $4, $5, $6)
        RETURNING *
        `,[role.inventoryId, role.name, role.create, role.read, role.update, role.delete]);

        return result.rows[0];
    }

    // function to get all roles under inventory ID
    static async getRoles(inventoryId) {
        const query = `
            SELECT 
                role_id AS "roleId",
                role_name AS "role_name" 
            FROM 
                roles WHERE inventory_id = $1
        `;

        const result = await db.query(query, [inventoryId]);

        return result.rows;
    }

    // function to get assigned roles to users
    static async getUserRoles(inventoryId) {
        // query to get list of users within inventoryId with their assigned role
        const query = `
            SELECT 
                user_to_inventory.user_id AS "userId",
                user_to_inventory.inventory_id AS "inventoryId",
                user_to_inventory.user_role_id AS "roleId",
                (SELECT roles.role_name FROM roles WHERE roles.id = user_to_inventory.user_role_id)
            FROM 
                user_to_inventory
            WHERE 
                user_to_inventory.inventory_id = $1
        `;

        const result = db.query(query, [inventoryId]);

        return result.rows;
    }

    static async updateRole(inventoryId, { role }) {
        //TODO: implement
    }

    static async deleteRole(inventoryId, roleId) {
        //TODO: implement
    }

    // function to check if there is a duplicate role name in the inventories' roles list
    static async checkDuplicateRoleName(inventoryId, roleName) {
        const query = `
            SELECT role_name FROM roles WHERE inventory_id = $1 AND role_name = $2
        `;

        const result = await db.query(query, [inventoryId, roleName]);

        if (result.rows[0]) {
            throw new BadRequestError("Role name already exists in inventory!");
        }
    }
}

module.exports = Role;
