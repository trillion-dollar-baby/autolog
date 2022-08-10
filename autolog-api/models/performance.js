const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Performance {
  static async getPerformanceSortedByCategory(inventoryId) {
    // InventoryId is required for the querty
    if (!inventoryId) {
        throw new BadRequestError("Missing inventory ID for performance")
    }

    // Grab all items within the selected inventory and group by category while summing up the quantities
      const query = `
      SELECT 
        sold_items.name AS name,
        sold_items.category AS category,
        SUM(sold_items.quantity) AS "total quantity",
        CAST(SUM(sold_items.cost) as money) AS "total cost",
        CAST(SUM(sold_items.sell_price) as money) AS "total sell price",
        CAST((SUM(sold_items.sell_price) - SUM(sold_items.cost)) as money) as "total profit",
        TO_CHAR(sold_items.created_at, 'Month YYYY') as month
      FROM sold_items
      JOIN invoices ON sold_items.invoice_id = invoices.id
      WHERE invoices.inventory_id = $1
      GROUP BY name, category, month
      ORDER BY month ASC`;

      const results = await db.query(query, [
        inventoryId,
      ]);
    
    return results.rows;
  }

  static async getPerformanceFilteredByMonth(inventoryId, month) {
    // Both inventoryId and month is required for the query
    if (!inventoryId) {
      throw new BadRequestError("Missing inventory ID for performance")
    }

    if (!month) {
      throw new BadRequestError("Missing month for performance")
    }

    // Do a query for every item within the selected inventory and sum the quantities
      const query = `
        SELECT 
          items.category AS category,
          SUM(items.quantity) AS "total quantity",
          TO_CHAR(items.created_at, 'Month YYYY') as month
        FROM items
        WHERE items.inventory_id = $1
        GROUP BY category, month
        ORDER BY month ASC`;

      const results = await db.query(query, [
        inventoryId,
      ]);

      // Filter the results to those that have a month of whatever month the user selected
      const filteredResults = results.rows.filter(object => object.month.includes(month));
    
    return filteredResults;
  }


  static async getPerformanceSortedByQuantityDesc(inventoryId, month) {
    if (!inventoryId) {
      throw new BadRequestError("Missing inventory ID for performance")
    }

    // Query for every item within a selected inventory and sum the quantities
    const query = `
      SELECT *
      FROM (
        SELECT 
          items.category AS category,
          SUM(items.quantity) AS "total quantity",
          TO_CHAR(items.created_at, 'Month YYYY') as month
        FROM items
        WHERE items.inventory_id = $1
        GROUP BY category, month
        ORDER BY month ASC
      ) AS sorted
      ORDER BY "total quantity" DESC`;

      const results = await db.query(query, [
        inventoryId
      ]);
      
      // If a month is provided, filter for the given month and return the results (desending quantity)
      if (month) {
        const filteredResults = results.rows.filter(object => object.month.includes(month));

        return filteredResults
      }
      // If a month is not provided, then return the regular results (desending quantity)
      else {
        return results.rows;
      }
  }


  static async getPerformanceSortedByQuantityAsc(inventoryId, month){
    if (!inventoryId) {
      throw new BadRequestError("Missing inventory ID for performance")
    }

    // Query for every item within a selected inventory and sum the quantities
    const query = `
      SELECT *
      FROM (
        SELECT 
          items.category AS category,
          SUM(items.quantity) AS "total quantity",
          TO_CHAR(items.created_at, 'Month YYYY') as month
        FROM items
        WHERE items.inventory_id = $1
        GROUP BY category, month
        ORDER BY month ASC
      ) AS sorted
      ORDER BY "total quantity" ASC`;

      const results = await db.query(query, [
        inventoryId
      ]);
      
      // If a month is provided, filter for the given month and return the results (ascending quantity)
      if (month) {
        const filteredResults = results.rows.filter(object => object.month.includes(month));

        return filteredResults
      }
      // If a month is not provided, then return the regular results (ascending quantity)
      else {
        return results.rows;
      }
    }
}

module.exports = Performance;
