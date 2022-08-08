const _ = require('lodash');
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Member {
    // function to update member role in specified inventoryId
    static async updateMember(inventoryId, userEmail, roleName) {
        const query = `
        UPDATE user_to_inventory
        SET user_role_id = (SELECT roles.id FROM roles WHERE roles.inventory_id = $1 AND roles.role_name = $2)
        WHERE user_to_inventory.user_id = (SELECT id FROM users WHERE email = $3)
        RETURNING *
    `;
        const result = await db.query(query, [
            inventoryId,
            _.toLower(roleName),
            _.toLower(userEmail),
        ]);

        if (result.rows[0]) {
            return { message: "success updating member" };
        }
    }

    // function to remove member from inventory
    static async removeMember(inventoryId, userEmail) {
        const isOwner = await this.isUserInventoryOwner(inventoryId, userEmail);

        if (isOwner)
            throw new BadRequestError("Owner of inventory can't be removed!");

        const query = `
        DELETE FROM user_to_inventory
        WHERE inventory_id = $1 AND user_id = (SELECT id FROM users WHERE email = $2)
    `;

        const result = await db.query(query, [inventoryId, userEmail]);

        if (result.rows[0]) {
            return { message: "success removing user" };
        }
    }

    // return inventory members based on inventory Id
    static async getInventoryMembers(inventoryId) {
        const result = await db.query(
            `
            SELECT 
                users.id AS "id",
                users.first_name AS "firstName",
                users.last_name AS "lastName",
                users.username AS "username",
                users.email AS "userEmail",
                (SELECT roles.role_name AS "roleName" FROM roles WHERE roles.id = user_to_inventory.user_role_id)
            FROM 
                user_to_inventory
            JOIN
                users ON users.id = user_to_inventory.user_id
            JOIN
                inventory ON inventory.id = user_to_inventory.inventory_id
            WHERE
                inventory.id = $1`
            , [inventoryId]);
        
        return result.rows;
    }

    // add user to inventory by using his email
    static async addUserToInventory(inventoryId, userEmail, roleName) {
        // check if user exists
        const existingUser = await db.query(`
            SELECT id
            FROM users
            WHERE email = $1
        `, [userEmail]);

        if(!existingUser.rows[0]) {
            throw new BadRequestError(`${userEmail} is not a valid email!`)
        }
        
        // check if user was already added to inventory
        const userInInventoryResult = await db.query(`
            SELECT user_id
            FROM user_to_inventory
            WHERE user_id = (SELECT id FROM users WHERE email = $1) AND inventory_id = $2
            `, [userEmail, inventoryId]);

        // if something was returned, throw error so users can't be added twice into the same inventory
        if (userInInventoryResult.rows[0]) {
            throw new BadRequestError(
                `${userEmail} is already in inventory ID ${inventoryId}!`
            );
        }

        const results = await db.query(`
            INSERT INTO user_to_inventory(
                user_id,
                inventory_id,
                user_role_id
            ) VALUES ((SELECT id FROM users WHERE email = $1), $2, (SELECT id FROM roles WHERE roles.inventory_id = $2 AND roles.role_name = $3))
            RETURNING user_id, (inventory_id)`
            , [_.toLower(userEmail), inventoryId, _.toLower(roleName)]);

        return results.rows[0];
    }
    
    // function to check if user is inventory owner
    static async isUserInventoryOwner(inventoryId, userEmail) {
        const queryAdminId = `SELECT admin_id AS "adminId" FROM inventory WHERE id = $1`
        const queryUserId = `SELECT id FROM users WHERE email = $1`

        const resultAdminId = await db.query(queryAdminId, [inventoryId]);
        const resultUserId = await db.query(queryUserId, [userEmail]);

        return resultAdminId.rows[0].adminId === resultUserId?.rows[0].id;
    }
}

module.exports = Member;
