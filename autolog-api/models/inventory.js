const _ = require('lodash');
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");
class Inventory {
    static async createInventory({ inventory, user }) {
        // first check for errors
		const requiredFields = ["name", "companyName", "companyPhone", "companyAddress", "companyEmail"];

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
			admin_id,
            company_name,
            company_email,
            company_address,
            company_phone
			)
			VALUES ($1, (SELECT id FROM users WHERE email = $2), $3, $4, $5, $6)
			RETURNING id AS "inventoryId",
                     name AS "inventoryName", 
                     company_name AS "companyName",
                     company_phone AS "companyPhone",
                     company_address AS "companyAddress",
                     company_email AS "companyEmail", 
                     created_at, 
                     admin_id 
		  	`,
        	[inventory.name, user.email, inventory.companyName, inventory.companyEmail, inventory.companyAddress, inventory.companyPhone]
        );

		// return inventory created
        return newInventoryResult.rows[0];
    }

    // create user_to_inventory entry in db
    static async createRelationship(user, inventoryId) {
		// add user to inventory as an admin
        const relationshipQuery = await db.query(
            `INSERT INTO user_to_inventory(
				user_id, 
				inventory_id,
				user_role_id
				)
				VALUES ((SELECT id FROM users WHERE email = $1), $2, (SELECT id FROM roles WHERE inventory_id = $2 AND role_name = 'admin'))`,
            [user.email, inventoryId]
        );
		
    }

    // fetch list of inventories user has access to
    static async listInventoriesWithAccess(user) {
		// query with many-to-many relationship
		const results = await db.query(
			`
			SELECT 
                inventory.id as "inventoryId",
				inventory.name as "inventoryName",
                inventory.admin_id as "ownerId",
                inventory.company_name AS "companyName",
                inventory.company_phone AS "companyPhone",
                inventory.company_address AS "companyAddress",
                inventory.company_email AS "companyEmail"
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
}

module.exports = Inventory;
