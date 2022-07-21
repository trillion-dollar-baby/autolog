const db = require("../db")
const { BadRequestError, NotFoundError } = require("../utils/errors")

class Item {

    static async createItem({ item, user }) {
        const requiredFields = ["category", "quantity"];
        requiredFields.forEach((field)=> {
            if (!item?.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in request body.`);
            }
           
        });
        
        console.log(user.id)
        const results = await db.query(`
        INSERT INTO items (
            name, 
            category, 
            quantity, 
            inventory_id
            )
            VALUES ($1, $2, $3, (SELECT id FROM inventory WHERE admin_id = $4))
            RETURNING id, name, category, quantity, created_at, inventory_id
     `, 
     [item.name, item.category, item.quantity, user.id])

    return results.rows[0]
};

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
        `, [user.id]
    );
    return results.rows;

}


}


module.exports = Item;