const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const Role = require("./role");

class Inventory {
    static async createInventory({ inventory, user }) {
        // first check for errors
		const requiredFields = ["name", "password"];

        requiredFields.forEach((field) => {
            if (!inventory.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body.`);
            }
        });
		
		// create inventory
        const newInventoryResult = await db.query(
            `
			INSERT INTO inventory(
			name, 
			admin_id
			)
			VALUES ($1, (SELECT id FROM users WHERE email = $2))
			RETURNING id AS "inventoryId", name AS "inventoryName", created_at, admin_id 
		  	`,
        	[inventory.name, user.email]
        );

		// create default roles for every new inventory using the inventoryId provided
		await Role.createDefaultRoles(newInventoryResult.rows[0].inventoryId);

		// add user to inventory as an admin
        const relationshipQuery = await db.query(
            `INSERT INTO user_to_inventory(
				user_id, 
				inventory_id,
				user_role_id
				)
				VALUES ((SELECT id FROM users WHERE email = $1), $2, (SELECT id FROM roles WHERE inventory_id = $2 AND role_name = 'admin'))`,
            [user.email, newInventoryResult.rows[0].inventoryId]
        );
		
		// return inventory created
        return newInventoryResult.rows[0];
    }

    // fetch list of inventories user has access to
    static async listInventoriesWithAccess(user) {
		// query with many-to-many relationship
		const results = await db.query(
			`
			SELECT inventory.id as "inventoryId",
				inventory.name as "inventoryName"
			FROM user_to_inventory
			JOIN
				users ON users.id = user_to_inventory.user_id
			JOIN
				inventory ON inventory.id = user_to_inventory.inventory_id
			WHERE
				users.id = $1`,
		[user.id]
		);

        return results.rows;
    }

    // fetch list of inventories that the user has created
    static async listOwnedInventories(user) {
        const results = await db.query(
            ` SELECT inventory.id,
                   inventory.name,
                   inventory.created_at,
                   u.email as "userEmail"
            FROM inventory
                RIGHT JOIN users AS u ON u.id = inventory.admin_id
            WHERE u.email = $1
        `,
            [user.email]
        );
        return results.rows;
    }

    // add user to inventory by using his email
    static async addUserToInventory(owner, userEmail, inventoryId) {
        // check if user was already added to inventory
        const existingResult = await db.query(
            `
        SELECT user_id
        FROM user_to_inventory
        WHERE user_id = (SELECT id FROM users WHERE email = $1) AND inventory_id = $2
        `,
            [userEmail, inventoryId]
        );

        // if something was returned, throw error so users can't be added twice into the same inventory
        if (existingResult.rows[0]) {
            throw new BadRequestError(
                `${userEmail} is already in inventory id:${inventoryId}!`
            );
        }

        const results = await db.query(
            `
        INSERT INTO user_to_inventory(
            user_id,
            inventory_id,
			user_role_id
        ) VALUES ((SELECT id FROM users WHERE email = $1), $2, (SELECT id FROM roles WHERE roles.inventory_id = $2 AND roles.role_name = 'admin'))
        RETURNING user_id, (inventory_id)`,
            [userEmail, inventoryId]
        );

        return results.rows[0];
    }

    // return inventory members based on inventory Id
    static async getInventoryMembers(inventoryId) {
        const result = await db.query(
            `
        SELECT users.id AS "id",
               users.first_name AS "firstName",
               users.last_name AS "lastName",
               users.username AS "username",
               users.email AS "userEmail",
			   (SELECT roles.role_name AS "roleName" FROM roles WHERE roles.id = user_to_inventory.user_role_id),
			   (SELECT roles.role_id AS "roleId" FROM roles WHERE roles.id = user_to_inventory.user_role_id)
        FROM 
            user_to_inventory
        JOIN
            users ON users.id = user_to_inventory.user_id
        JOIN
            inventory ON inventory.id = user_to_inventory.inventory_id
        WHERE
            inventory.id = $1
    `,
            [inventoryId]
        );

        return result.rows;
    }
}

module.exports = Inventory;
