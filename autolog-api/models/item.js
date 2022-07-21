const db = require("../db")
const { BadRequestError, NotFoundError } = require("../utils/errors")

class Item {

    static async createItem({ item, user }) {
        const requiredFields = ["category", "quantity"];
        requiredFields.forEach((field)=> {
            console.log(item)
            if (!item?.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in request body.`);
            }
           
        });
        //also for this, should we base this off the user's email or the inventory id?
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
//     static async fetchItemById (itemId) {
// //continue making changes from here
//     const results = await db.query(`        
//                 SELECT items.id, 
//                    items.name,
//                    items.category,
//                    items.quantity,
//                    u.email AS "userEmail",
//                    items.created_at
//             FROM items
//                 LEFT JOIN users AS u ON u.id = items.user_id
//             WHERE items.id = $1
//         `, [itemId]
//     )
//     const items = results.rows[0]
//     if (!items) {
//         throw new NotFoundError()
//     }
//     return items


// }
//if the user doesn't work we have to change it to inventory but for testing purposes lets set this up to have it with user's email

static async listItemForUser(user) {
    const results = await db.query(
        ` SELECT items.id,
                   items.name,
                   items.category,
                   items.quantity,
                   items.created_at,
                   i.admin_id as "adminId"
            FROM items
                RIGHT JOIN inventory AS i ON i.admin_id = items.inventory_id
            WHERE i.admin_id = $1
        `, [user.admin_id]
    );
    return results.rows;

}


}


module.exports = Item;