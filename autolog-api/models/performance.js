const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Performance {
  static async getPerformanceSortedByCategory(inventoryId) {
    const query = `
      SELECT 
        items.category AS category,
        SUM(CAST(items.quantity AS int)) AS "total quantity",
        EXTRACT(MONTH FROM items.created_at) AS month
      FROM items
      WHERE items.inventory_id = $1
      GROUP BY category, month
      ORDER BY category DESC`;

    const results = await db.query(query, [
      inventoryId,
    ]);

    return results.rows;
  }

  static async getPerformanceSortedByMonth(user, inventoryId) {
    return;
  }

  static async getPerformanceFilteredByQuantityDesc(user, inventoryId) {
    return;
  }

  static async getPerformanceFilteredByQuantityAsc(user, inventoryId){
    return;
  }

}

module.exports = Performance;
