const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Log {
    static async createLog(inventoryId, itemId, userId, action) {
        const query = `
            INSERT INTO logs (
                inventory_id,
                item_id,
                user_id,
                action
            )
            VALUES (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING id, user_id, inventory_id, action, to_char(created_at,'MM-DD-YYYY') AS "createdAt"
        `;

        try {
            const results = await db.query(query, [
                inventoryId,
                itemId,
                userId,
                action,
            ]);

            return results.rows;
        } catch (error) {
            throw new BadRequestError("Logging query failed. Error is:", error);
        }
    }

    static async fetchLogs(inventoryId) {
        const query = `
        SELECT 
            id AS "LOG ID",
            user_id AS "USER",
            item_id AS "ITEM ID",
            inventory_id AS "INVENTORY ID",
            to_char(logs.created_at, 'MM-DD-YYYY HH:MI:SS') AS "CREATEDAT",
            logs.created_at,
            action
        FROM
            logs
        WHERE
            inventory_id = $1
        ORDER BY
            "LOG ID" DESC
        `;

        const results = await db.query(query, [inventoryId]);

        return results.rows;
    }
}

module.exports = Log;
