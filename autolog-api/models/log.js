const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Log {
  static async createRecord(inventoryId, itemId, userId) {
    if (!isNumeric(inventoryId) || !isNumeric(itemId) || !isNumeric(userId)) {
      throw new BadRequestError(
        "Logging failed. ID is the wrong data type for log creation"
      );
    }

    const query = `
            INSERT INTO logs (
                user_id,
                item_id,
                message
            )
            VALUES (
                $1,
                $2,
                $3
            )
            RETURNING id, message, to_char(created_at,'MM-DD-YYYY') AS "createdAt"
        `;

    try {
      const results = db.query(query, [inventoryId, itemId, userId]);

      return results.rows;
    } catch (error) {
      throw new BadRequestError("Logging query failed. Error is:", error);
    }
  }
}

module.exports = Log;
