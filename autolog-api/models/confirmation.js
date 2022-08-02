const db = require("../db");
const { BadRequestError } = require("../utils/errors");
const tokens = require('../utils/tokens');

class Confirmation {
    static verifyConfirmationToken(token, secret) {
        const { user: { id } } = tokens.verifyConfirmationToken(token, secret)

        if (!id) {
            throw new BadRequestError("Invalid confirmation token")
        }
        else {
            return id
        }
    }

    static async updateConfirmationStatus(id) {
        if (isNaN(id)) {
            throw new BadRequestError("Provided ID is not a number. Cannot update confirmation status")
        }

        const query = `
        UPDATE users
        SET email_confirmed = TRUE
        WHERE id = $1
        RETURNING id, email_confirmed, email
        `

        const results = await db.query(query, [id]);

        return results.rows[0];
    }
}

module.exports = Confirmation