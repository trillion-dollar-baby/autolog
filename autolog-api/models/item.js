const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Item {
  constructor() {
    // limit for tables to show per query
    this.limit = 10;
  }

  static async createItem({ item, user }) {
    const requiredFields = ["name", "category", "quantity"];

	if(parseInt(item.quantity) === NaN) {
		throw new BadRequestError("quantity is NaN");
	}

    requiredFields.forEach((field) => {
      if (!item?.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing ${field} in request body.`);
      }
    });

    console.log(user.id);
    const results = await db.query(
      `
        INSERT INTO items (
            name, 
            category, 
            quantity, 
            inventory_id
            )
            VALUES ($1, $2, $3, (SELECT id FROM inventory WHERE admin_id = $4))
            RETURNING id, name, category, quantity, created_at, inventory_id
     `,
      [
        item.name.toLowerCase(),
        item.category.toLowerCase(),
        item.quantity,
        user.id,
      ]
    );

    return results.rows[0];
  }

  static async listItemForUser(user) {
    const results = await db.query(
      ` SELECT items.id,
                   items.name,
                   items.category,
                   items.quantity,
                   items.created_at,
                   i.id as "adminId"
            FROM items
                RIGHT JOIN inventory AS i ON i.id = items.inventory_id
            WHERE i.id = $1
        `,
      [user.id]
    );
    return results.rows;
  }

  static async listInventoryItems(inventoryId, pageNumber) {
    // get offset if user wants to see more items of the same search
    // if there was no pageNumber received, offset is going to be 0
    const offset = (Number(pageNumber) || 0) * this.limit;

    const results = await db.query(
      `
		SELECT items.id AS "id",
			   items.name,
			   items.category AS "category",
			   items.created_at AS "createdAt",
			   items.updated_at AS "updatedAt",
			   items.inventory_id AS "inventoryId",
			   items.quantity
		FROM items
			JOIN inventory ON inventory.id = items.inventory_id
		WHERE items.inventory_id = $1
		LIMIT 10`,
      [inventoryId]
    );

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
}

module.exports = Item;
