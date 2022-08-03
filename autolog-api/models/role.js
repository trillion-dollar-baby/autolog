const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const Inventory = require("./inventory")

class Role {
    // function to create default user roles on every new inventory
    static async createDefaultRoles(inventoryId) {
        if (!inventoryId)
            throw new BadRequestError(
                "Internal error: No inventory ID received"
            );

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
        const requiredFields = [
            "inventoryId",
            "name",
            "create",
            "read",
            "update",
            "delete",
        ];
        requiredFields.forEach((field) => {
            if (!role?.hasOwnProperty(field)) {
                throw new BadRequestError(
                    `Error creating role! Missing role ${field}!`
                );
            }
        });

        // check if duplicate
        this.checkDuplicateRoleName(role.inventoryId, role.name);

        const result = await db.query(
            `
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
        `,
            [
                role.inventoryId,
                role.name,
                role.create,
                role.read,
                role.update,
                role.delete,
            ]
        );

        return result.rows[0];
    }

    // function to get all roles under inventory ID
    static async getRoles(inventoryId) {
        const query = `
            SELECT 
                id AS "id",
                role_id AS "roleId",
                role_name AS "roleName",
                item_create AS "create",
                item_read AS "read",
                item_update AS "update",
                item_delete AS "delete"
            FROM 
                roles WHERE inventory_id = $1
        `;

        const result = await db.query(query, [inventoryId]);

        return result.rows;
    }

    static async getUserRole(inventoryId, userId) {
        const result = await db.query(`
            SELECT 
                users.id AS "id",
                (SELECT roles.role_name AS "roleName" FROM roles WHERE roles.id = user_to_inventory.user_role_id),
                (SELECT roles.role_id AS "roleId" FROM roles WHERE roles.id = user_to_inventory.user_role_id),
                (SELECT roles.item_create AS "create" FROM roles WHERE roles.id = user_to_inventory.user_role_id),
                (SELECT roles.item_read AS "read" FROM roles WHERE roles.id = user_to_inventory.user_role_id),
                (SELECT roles.item_update AS "update" FROM roles WHERE roles.id = user_to_inventory.user_role_id),
                (SELECT roles.item_delete AS "delete" FROM roles WHERE roles.id = user_to_inventory.user_role_id)
            FROM 
                user_to_inventory
            JOIN
                users ON users.id = user_to_inventory.user_id
            JOIN
                inventory ON inventory.id = user_to_inventory.inventory_id
            WHERE
                inventory.id = $1 AND users.id = $2
        `, [inventoryId, userId]);

        if(result.rows[0]) {
            return result.rows[0];
        } else {
            throw new BadRequestError("No user found");
        }
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

    // function to update role given all necessary fields to select and update values
    static async updateRole(inventoryId, roleObj) {
        const roleFields = ["roleName", "roleId", "create", "read", "update", "delete"];

        if (isNaN(inventoryId)) {
            throw new BadRequestError("Inventory ID is NaN");
        }

        roleFields.forEach((field) => {
            if (!roleObj[field].hasOwnProperty) {
                throw new BadRequestError(
                    `Role object received missing ${field} key`
                );
            }
        });

        const query = `
            UPDATE roles
            SET role_name = $1,
                item_create = $2,
                item_read = $3,
                item_update = $4,
                item_delete = $5
            WHERE inventory_id = $6 AND role_id = $7
            RETURNING *;
        `;

        const result = await db.query(
            query, [
            roleObj.roleName,
            roleObj.create,
            roleObj.read,
            roleObj.update,
            roleObj.delete,
            inventoryId,
            roleObj.roleId]);

        if(result.rows[0]) {
            return {message: `Success updating role ${roleObj.roleName}`}
        }
    }

    static async deleteRole(inventoryId, roleId) {
        if (isNaN(roleId) || isNaN(inventoryId)) {
            throw new BadRequestError("Parameters sent are NaN");
        }

        // admin can't be deleted
        if (roleId === 0) {
            throw new BadRequestError("Admin role can't be deleted!");
        }

        // check if there are users that still have the role
        const memberList = await Inventory.getInventoryMembers(inventoryId);
        const membersWithRequestedRole = [];
        
        memberList.forEach((member) => {
            // append into array and then tell admin all the users that contain this error
            if (member.roleId === Number(roleId)) {
                membersWithRequestedRole.push(member.userEmail);
                console.log("it happened");
            }
        });

        // if any found, throw error with detailed information of users containing the role
        if (membersWithRequestedRole.length > 0) {
            throw new BadRequestError(
                "There are still users with this role! Users: " + membersWithRequestedRole
            );
        }

        // delete desired role if no error was thrown along the way
        const query = `
            DELETE FROM roles
            WHERE roles.role_id = $1 AND roles.inventory_id = $2
        `;

        const result = await db.query(query, [roleId, inventoryId]);

        return result.rows[0];
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
