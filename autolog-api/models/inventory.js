const db = require("../db")
const { BadRequestError, NotFoundError } = require("../utils/errors")

class Inventory{

    static async createInventory({inventory, user}) {
        const requiredFields = ["name", "password"];
        requiredFields.forEach(field => {
            if (!inventory.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in request body.`);
            }
        })
        const results = await db.query(`
        INSERT INTO inventory(
            name, 
            admin_id
            )
            VALUES ($1, (SELECT id FROM users WHERE email = $2))
            RETURNING id, name, created_at, admin_id 
     `, 
     [inventory.name, user.email])

    return results.rows[0]
}


static async listInventoryForUser(user) {
    const results = await db.query(
        ` SELECT inventory.id,
                   inventory.name,
                   inventory.created_at,
                   u.email as "userEmail"
            FROM inventory
                RIGHT JOIN users AS u ON u.id = inventory.admin_id
            WHERE u.email = $1
        `, [user.email]
    )
    return results.rows

}

}


module.exports = Inventory