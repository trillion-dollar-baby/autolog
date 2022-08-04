const db = require("../db");
const { BadRequestError } = require("../utils/errors");
const tokens = require("../utils/tokens");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

class Confirmation {
    // Send email confirmation to user
    static sendConfirmationEmail(userId, receiverEmail) {
        // Initialize the transporter with email (and password) used to send the confirmation email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        jwt.sign(
            {
                user: userId,
            },
            process.env.EMAIL_SECRET_KEY,
            {
                expiresIn: "1d",
            },
            (err, emailToken) => {
                const url = `http://localhost:3001/confirmation/${emailToken}`;

                transporter.sendMail({
                    to: receiverEmail,
                    subject: "Confirm Autolog Email",
                    html: `Please click this link to confirm your email: <a href=${url}>${url}</a>`,
                });
            }
        );
        console.log("reached", receiverEmail)
    }

    static verifyConfirmationToken(token, secret) {
        // Calls the verifyConfirmationToken in ../utils/tokens
        const {
            user // User = user id
        } = tokens.verifyConfirmationToken(token, secret);

        // If the verification fails or is invalid, then throw an error
        if (isNaN(user)) {
            throw new BadRequestError("Invalid confirmation token");
        }
        // Else, return the id so the correct user confirmed_email status can be updated
        else {
            return user;
        }
    }

    static async updateConfirmationStatus(id) {
        // Make sure the ID is a number
        if (isNaN(id)) {
            throw new BadRequestError(
                "Provided ID is not a number. Cannot update confirmation status"
            );
        }

        // Query to update the email_confirmed field of the user with the given ID
        const query = `
        UPDATE users
        SET email_confirmed = TRUE
        WHERE id = $1
        RETURNING id, email_confirmed, email
        `;

        const results = await db.query(query, [id]);

        // Return id, email_confirmed, and email
        return results.rows[0];
    }
}

module.exports = Confirmation;
