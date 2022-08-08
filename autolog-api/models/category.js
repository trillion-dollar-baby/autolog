const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Category {
    // return list of items based on inventoryId
    static async getItems(inventoryId) {
        // null check
        if (!inventoryId.hasOwnProperty || isNaN(inventoryId)) {
            throw new BadRequestError(
                `Category getItems: invalid inventoryId: ${inventoryId}`
            );
        }

        const query = `
			SELECT  id AS "categoryId",
					category_name AS "categoryName",
					inventory_id AS "inventoryId"

			FROM categories
			WHERE inventory_id = $1
		`;

        const result = await db.query(query, [inventoryId]);

        if (!result.rows[0]) {
            throw new BadRequestError(
                "There are no categories in this inventory!"
            );
        }

        return result.rows;
    }

    // function to create a new category
    static async createItem(data) {
        // check for null values/existing parameters before querying
        const requiredFields = ["inventoryId", "categoryName"];

        requiredFields.forEach((key) => {
            if (!data[key].hasOwnProperty) {
                throw new BadRequestError(
                    `Category createItem: missing ${key}`
                );
            }
        });

        // normalize data before inserting into database
        const normalizedCategoryName = data.categoryName.toLowerCase();

        const query = `
            INSERT INTO categories (
                inventory_id,
                category_name
            )
            VALUES ($1, $2)
            RETURNING 
				inventory_id AS "inventoryId",
				category_name AS "categoryName"
        `;

        const result = await db.query(query, [
            data.inventoryId,
            normalizedCategoryName,
        ]);
        // return new category item
        return result.rows[0];
    }
}

module.exports = Category;
