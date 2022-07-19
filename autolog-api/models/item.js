const db = require("../db")
const { BadRequestError, NotFoundError } = require("../utils/errors")

class Item {

    static async createItem({item, user}) {
        const requiredFields = ["name", "category", "quantity"];
        requiredFields.forEach(field => {
            if (!item.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in request body.`);
            }
        })
        //also for this, should we base this off the user's email or the inventory id?
        const results = await db.query(`
        INSERT INTO items (
            name, 
            category, 
            quantity, 
            inventory_id
            )
            VALUES ($1, $2, $3, $4, (SELECT id FROM inventory WHERE id = $5))
            RETURNING id, name, category, quantity, inventory_id, created_at
     `, 
     [item.name, item.category, item.quantity, user.email])

    return results.rows[0]
}
    static async fetchItemById (itemId) {
//continue making changes from here
    const results = await db.query(`        
                SELECT nutr.id, 
                   nutr.name,
                   nutr.category,
                   nutr.calories,
                   nutr.quantity,
                   nutr.image_url,
                   u.email AS "userEmail",
                   nutr.created_at
            FROM nutrition AS nutr
                LEFT JOIN users AS u ON u.id = nutr.user_id
            WHERE nutr.id = $1
        `, [itemId]
    )
    const nutrition = results.rows[0]
    if (!nutrition) {
        throw new NotFoundError()
    }
    return nutrition


}


static async listNutritionForUser(user) {
    const results = await db.query(
        ` SELECT nutr.id,
                   nutr.name,
                   nutr.category,
                   nutr.calories,
                   nutr.quantity,
                   nutr.image_url,
                   nutr.created_at,
                   u.email as "userEmail"
            FROM nutrition AS nutr
                RIGHT JOIN users AS u ON u.id = nutr.user_id
            WHERE u.email = $1
        `, [user.email]
    )
    return results.rows

}


}


module.exports = Item