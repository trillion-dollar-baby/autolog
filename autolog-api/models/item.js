const db = require("../db");
const _ = require("lodash");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Item {
    // Create item function
    static async createItem({ item, user, inventoryId }) {
        const requiredFields = ["name", "category", "quantity"];

        if (parseInt(item.quantity) === NaN) {
            throw new BadRequestError("quantity is NaN");
        }

        requiredFields.forEach((field) => {
            if (!item?.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body.`);
            }
        });

        Object.keys(item).forEach((field) => {
            if (isNaN(item[field])) {
                item[field] = _.toLower(item[field]);
            }
        });

        // Insert into items and perform subquery to make sure this inventory id matches with user
        const results = await db.query(
            `
        INSERT INTO items (
            name, 
            category, 
            quantity,
            located_at,
            part_number,
            description,
			supplier,
            inventory_id
            )
            VALUES ($1, 
                    $2, 
                    $3,
                    $4,
                    $5,
                    $6,
                    $7, 
                      (SELECT 
                          inventory.id 
                      FROM 
                          inventory
                      JOIN 
                          user_to_inventory AS uti ON uti.inventory_id = inventory.id
                      WHERE 
                          uti.user_id = $8 AND uti.inventory_id = $9))
            RETURNING id, name, category, quantity, to_char(created_at,'MM-DD-YYYY') AS "createdAt"
            , inventory_id
     `,
            [
                item.name,
                item.category,
                item.quantity,
                item.locatedAt || "", // only non required fields can have empty strings
                item.partNumber || "",
                item.description || "",
                item.supplier || "",
                user.id,
                item.inventoryId,
            ]
        );

        return results.rows[0];
    }
    // listItemForUser
    static async listItemForUser(user) {
        const results = await db.query(
            ` SELECT items.id,
                   items.name,
                   items.category,
                   items.quantity,
                   to_char(items.created_at, 'MM-DD-YYYY') AS "createdAt",
                   i.id as "adminId"
            FROM items
                RIGHT JOIN inventory AS i ON i.id = items.inventory_id
            WHERE i.id = $1
        `,
            [user.id]
        );
        return results.rows;
    }

    // get inventory items by inventoryId
    //TODO: implement sort by search
    static async listInventoryItems(inventoryId, search = "", pageNumber = 0) {
        // get offset if user wants to see more items of the same search
        // if there was no pageNumber received, offset is going to be 0
        let offset;
        let limit = 30;

        // convert pageNumber to a Number in case it is going to be used in calculation
        if (pageNumber) {
            offset = (Number(pageNumber) || 0) * limit;
        }

        const query = `
			SELECT items.id AS "id",
				items.name,
				items.category AS "category",
				to_char(items.created_at, 'MM-DD-YYYY') AS "createdAt",
				to_char(items.updated_at, 'MM-DD-YYYY') AS "updatedAt",
                items.created_at,
				items.inventory_id AS "inventoryId",
				items.quantity
			FROM items
				JOIN inventory ON inventory.id = items.inventory_id
			WHERE items.inventory_id = $1 AND items.name ~ $4
			ORDER BY items.created_at DESC
			LIMIT $2 OFFSET $3`;

        const results = await db.query(query, [
            inventoryId,
            limit,
            offset,
            search.toLowerCase(),
        ]);

        return results.rows;
    }

    static async getItemById(id) {
        // convert ID to integer
        const intId = parseInt(id);

        // error handling before querying
        if (isNaN(intId)) {
            throw new BadRequestError(`id:${id} received is not a number`);
        } else if (intId < 0) {
            throw new BadRequestError(`id:${id} cant be less than zero`);
        }

        const result = await db.query(
            `
		SELECT items.id AS "id",
			items.name,
			items.category AS "category",
			items.description AS "description",
			items.part_number AS "partNumber",
			items.located_at AS "locatedAt",
			items.part_number AS "partNumber",
			items.supplier AS "supplier",
			items.created_at AS "createdAt",
			items.updated_at AS "updatedAt",
			items.inventory_id AS "inventoryId",
			items.quantity
		FROM items
			JOIN inventory ON inventory.id = items.inventory_id
		WHERE items.id = $1`,
            [intId]
        );

        // return the only entry that exists
        return result.rows[0];
    }

    /**
     * Update item
     */

    static async updateItem(itemId, newValues, item) {
        // with old credentials loop through newCredentials object and replace
        for (const key in newValues) {
            item[key] = newValues[key];
        }

        // after replacing, update
        const query = `
			UPDATE items
			SET name = $2,
				category = $3,
				quantity = $4,
				located_at = $5,
				part_number = $6,
        		description = $7,
        		supplier = $8,
				updated_at = NOW()
			WHERE id = $1
			RETURNING *;
		`;

        const result = await db.query(query, [
            itemId,
            _.toLower(item.name),
            _.toLower(item.category),
            item.quantity,
            _.toLower(item.locatedAt),
            _.toLower(item.partNumber),
            _.toLower(item.description),
            _.toLower(item.supplier),
        ]);

        return result.rows[0];
    }

    /**
     * Delete item function based by itemId provided
     */
    static async deleteItem(itemId) {
        // TODO: check if user has access to inventory in order to perform this
        if (isNaN(itemId)) {
            throw new BadRequestError(
                `deleteItem, itemId: ${itemId} is not a number`
            );
        }

        const query = `
			DELETE FROM items WHERE id = $1
		`;

        const result = await db.query(query, [itemId]);

        return result.rows[0];
    }
}

module.exports = Item;
