const db = require("../db");
const { BadRequestError } = require("../utils/errors");
const tokens = require("../utils/tokens");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const { CLIENT_BASE_URL, API_BASE_URL } = require("../constants");
var easyinvoice = require('easyinvoice');
const { create } = require("lodash");

class Confirmation {
    // Send email confirmation to user
    static async sendConfirmationEmail(userId, receiverEmail) {
        // Initialize the transporter with email (and password) used to send the confirmation email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const res = await this.createInvoice();

        jwt.sign(
            {
                user: userId,
            },
            process.env.EMAIL_SECRET_KEY,
            {
                expiresIn: "1d",
            },
            (err, emailToken) => {
                const url = `${API_BASE_URL}confirmation/${emailToken}`;

                transporter.sendMail({
                    from: process.env.GMAIL_USER,
                    to: receiverEmail,
                    subject: "Confirm Autolog Email",
                    html: `Please click this link to confirm your email: <a href=${url}>${url}</a>`,
                    attachments: [
                        { filename: 'invoice.pdf', encoding: 'base64', content: res.pdf}
                    ]
                });
            }
        );
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

    static async createInvoice() {
        var data = {
            // Customize enables you to provide your own templates
            // Please review the documentation for instructions and examples
            "customize": {
                //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
            },
            "images": {
                // The logo on top of your invoice
                "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
                // The invoice background
                "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg"
            },
            // Your own data
            "sender": {
                "company": "Sample Corp",
                "address": "Sample Street 123",
                "zip": "1234 AB",
                "city": "Sampletown",
                "country": "Samplecountry"
                //"custom1": "custom value 1",
                //"custom2": "custom value 2",
                //"custom3": "custom value 3"
            },
            // Your recipient
            "client": {
                "company": "Client Corp",
                "address": "Clientstreet 456",
                "zip": "4567 CD",
                "city": "Clientcity",
                "country": "Clientcountry"
                // "custom1": "custom value 1",
                // "custom2": "custom value 2",
                // "custom3": "custom value 3"
            },
            "information": {
                // Invoice number
                "number": "2021.0001",
                // Invoice data
                "date": "12-12-2021",
                // Invoice due date
                "due-date": "31-12-2021"
            },
            // The products you would like to see on your invoice
            // Total values are being calculated automatically
            "products": [
                {
                    "quantity": 2,
                    "description": "Product 1",
                    "tax-rate": 6,
                    "price": 33.87
                },
                {
                    "quantity": 4.1,
                    "description": "Product 2",
                    "tax-rate": 6,
                    "price": 12.34
                },
                {
                    "quantity": 4.5678,
                    "description": "Product 3",
                    "tax-rate": 21,
                    "price": 6324.453456
                }
            ],
            // The message you would like to display on the bottom of your invoice
            "bottom-notice": "Kindly pay your invoice within 15 days.",
            // Settings to customize your invoice
            "settings": {
                "currency": "USD", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
                // "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')
                // "tax-notation": "gst", // Defaults to 'vat'
                // "margin-top": 25, // Defaults to '25'
                // "margin-right": 25, // Defaults to '25'
                // "margin-left": 25, // Defaults to '25'
                // "margin-bottom": 25, // Defaults to '25'
                // "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
                // "height": "1000px", // allowed units: mm, cm, in, px
                // "width": "500px", // allowed units: mm, cm, in, px
                // "orientation": "landscape", // portrait or landscape, defaults to portrait
            },
            // Translate your invoice to your preferred language
            "translate": {
                // "invoice": "FACTUUR",  // Default to 'INVOICE'
                // "number": "Nummer", // Defaults to 'Number'
                // "date": "Datum", // Default to 'Date'
                // "due-date": "Verloopdatum", // Defaults to 'Due Date'
                // "subtotal": "Subtotaal", // Defaults to 'Subtotal'
                // "products": "Producten", // Defaults to 'Products'
                // "quantity": "Aantal", // Default to 'Quantity'
                // "price": "Prijs", // Defaults to 'Price'
                // "product-total": "Totaal", // Defaults to 'Total'
                // "total": "Totaal" // Defaults to 'Total'
            },
        };

        return await easyinvoice.createInvoice(data)
    }
}

module.exports = Confirmation;
