const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Performance {
  static async getPerformanceSortedByCategory(inventoryId) {
    if (!inventoryId) {
        throw new BadRequestError("Missing inventory ID for performance")
    }

      const query = `
      SELECT 
        items.category AS category,
        SUM(items.quantity) AS "total quantity",
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

  static async getPerformanceSortedByMonth(inventoryId) {
    return;
  }

  static async getPerformanceFilteredByQuantityDesc(inventoryId) {
    return;
  }

  static async getPerformanceFilteredByQuantityAsc(inventoryId){
    return;
  }

}

module.exports = Performance;
