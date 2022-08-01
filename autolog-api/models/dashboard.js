const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Dashboard {
  //Create a new checklist
  static async createChecklist({ item, user, inventoryId }) {
    const results = await db.query(
      `
        INSERT INTO checklist (item, user_id, inventory_id)
        VALUES ($1, $2, $3)
        RETURNING id, item, user_id, inventory_id, is_checked
    `,
      [item.item, user.id, item.inventoryId]
    );
    return results.rows[0];
  }

  //fetch checklist item by id
  // listItemForUser
  static async listItemForUser(user) {
    const results = await db.query(
      ` SELECT checklist.id,
               checklist.item,
               i.id as "userId"
        FROM checklist
            RIGHT JOIN inventory AS i ON i.id = checklist.inventory_id
        WHERE i.id = $1
    `,
      [user.id]
    );
    return results.rows;
  }

  static async fetchCheckItemById(id) {
    //
    const idId = parseInt(id);

    // error handling before querying
    if (isNaN(idId)) {
      throw new BadRequestError(`id:${id} received is not a number`);
    } else if (idId < 0) {
      throw new BadRequestError(`id:${id} cant be less than zero`);
    }
    const result = await db.query(
      `
		SELECT checklist.id AS "id",
			checklist.item AS "item",
            checklist.is_checked AS "isChecked",
			checklist.inventory_id AS "inventoryId"
		FROM checklist
			JOIN inventory ON inventory.id = checklist.inventory_id
		WHERE checklist.id = $1`,
      [idId]
    );

    // return the only entry that exists
    return result.rows[0];
  }

  //update checklist item
  static async updateCheckItem (itemId, itemUpdate) {
    const results = await db.query(
      `SELECT item, is_checked FROM checklist WHERE id = $1 `,
      [itemId]
    );
    const item = results.rows[0].item
    
    const is_checked = results.rows[0].is_checked

    let isChecked = false;
    if (itemUpdate.is_checked == null) {
      isChecked = is_checked;
    } else {
      isChecked = itemUpdate.is_checked;
    }

    const result = await db.query(
      `
        UPDATE checklist
        SET item = $1, is_checked = $2
        WHERE id = $3 
        RETURNING id,
                  item,
                  is_checked

    `,
      [itemUpdate.item || item, isChecked, itemId]
    );

    return result.rows[0];
  }
  //delete checklist item

  static async deleteCheckItem(itemId) {
    //holdover case
    if (isNaN(itemId)) {
      throw new BadRequestError(
        `deleteItem, itemId: ${itemId} is not a number`
      );
    }

    const query = `
			DELETE FROM checklist WHERE id = $1
		`;
    const result = await db.query(query, [itemId]);
    return result.rows[0];
    
  }

  //create announcements
  static async createAnnouncements({ announcement, user }) {
    const results = await db.query(
      `
        INSERT INTO annoucements (announcement, user_id, inventory_id)
        VALUES ($1, $2, $3)
        RETURNING id, item, user_id, inventory_id, created_at
    `,
      [announcement.announcement, user.id, announcement.inventoryId]
    );
    return results.rows[0];
  }

  //delete announcements


  //edit announcments
}
module.exports = Dashboard;
