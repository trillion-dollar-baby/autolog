const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Log {
    static async createLog(inventoryId, itemName, itemId, userId, action) {
        const query = `
            INSERT INTO logs (
                inventory_id,
                item_name,
                item_id,
                username,
                user_id,
                action
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
            )
            RETURNING id, item_name, user_id, inventory_id, action, to_char(created_at,'MM-DD-YYYY') AS "createdAt"
        `;

        const username = await this.fetchUserNameById(userId)

        try {
            const results = await db.query(query, [
                inventoryId,
                itemName,
                itemId,
                username,
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
            item_name AS "ITEM NAME",
            username AS "USERNAME",
            action as "ACTION",
            to_char(logs.created_at, 'MM-DD-YYYY HH:MI:SS') AS "CREATEDAT",
            logs.created_at
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

    static async fetchUserNameById(id) {
        const query = `
        SELECT 
            username
        FROM 
            users
        WHERE
            id = $1
        `;

        const results = await db.query(query, [id])

        return results.rows[0].username;
    }
}

module.exports = Log;
