const { parse } = require("dotenv");
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const nodemailer = require('nodemailer');


class Invoice {
    static async createInvoice(invoice, inventoryId) {
        // Required fields for a successful query
        const requiredFields = [
            "inventoryId",
            "senderId",
            "senderName",
            "senderEmail",
            "receiverFirstName",
            "receiverLastName",
            "receiver_email",
            "reeciver_address",
            "totalLaborCost",
            "totalMaterialCost",
        ];

        // Check if inputs for INTEGER fields are correct
        if (parseInt(item.totalLaborCost) === NaN) {
            throw new BadRequestError("Quantity is not a number");
        }

        if (parseInt(item.totalMaterialCost) === NaN) {
            throw new BadRequestError("Quantity is not a number");
        }

        // Check if input values fulfills all required fields
        requiredFields.forEach((field) => {
            if (!invoice?.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in form.`);
            }
        });

        // Normalize invoice values
        Object.keys(invoice).forEach((field) => {
            if (isNaN(invoice[field])) {
                invoice[field] = _.toLower(invoice[field]);
            }
        });


        const query = `
        INSERT INTO invoices (
            inventory_id,
            sender_id,
            sender_name,
            sender_email,
            receiver_first_name,
            receiver_last_name,
            receiver_email,
            receiver_address,
            total_labor_cost,
            total_material_cost,
        ) 
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10
        )
        RETURNING id, inventory_id, sender_email, receiver_first_name, receiver_last_name, 
        receiver_email, created_at, total_labor_cost, total_material_cost
        `
        
        const results = await db.query(query, [inventoryId, invoice.senderId, invoice.senderName, invoice.senderEmail,
        invoice.receiverFirstName, invoice.receiverLastName, invoice.receiverEmail, invoice.receiverAddress, invoice.totalLaborCost, invoice.totalMaterialCost])

        return results.rows[0];
    }

    static async createSoldItemRecords(items, invoiceId) {
        const queryResults = [];

        // Loop through each item selected for the invoice
        items.forEach(async (item) => {
            let query = `
            INSERT INTO sold_items (
                invoice_id,
                name,
                category,
                quantity
            )
            VALUES (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING id, name, category, quantity, sold_date
            `

            let result = await db.query(query, [invoiceId, item.name, item.category, item.quantity])

            queryResults.push(result.rows[0]);
        })

        return queryResults;
    }


    static async listInvoices(inventoryId) {
        if (parseInt(inventoryId) == NaN) {
            throw new BadRequestError("Inventory ID is not a number")
        }

        const query = `
        SELECT
            sender_name,
            sender_email,
            recipient_first_name,
            recipient_last_name,
            recipient_email,
            recipient_address,
            created_at,
            total_labor_cost,
            total_material_cost
        FROM
            invoices
        WHERE invoices.inventory_id = $1
        `

        const results = await db.query(query, inventoryId);

        return results.rows[0];
    }

    static async sendInvoicePdf({userId, receiverEmail, invoiceValues, purchases}) {
        // Initialize the transporter with email (and password) used to send the invoice
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const invoice = await this.createInvoicePdf({ invoiceValues, purchases });

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
                    subject: "Autolog Invoice",
                    html: `Attatched to this email is the invoice from your recent autoshop job`,
                    attachments: [
                        { filename: 'invoice.pdf', encoding: 'base64', content: invoice.pdf}
                    ]
                });
            }
        );
    }

    static async createInvoicePdf({ invoice, purchases }) {
        let data = {
            // Customize enables you to provide your own templates
            // Please review the documentation for instructions and examples
            "customize": {
                //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
            },
            "images": {
                // The logo on top of your invoice
                "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
                // The invoice background
                // "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg"
            },
            // Your own data
            "sender": {
                "company": "Sample Corp",
                "address": "Sample Street 123",
                "zip": "1234 AB",
                "city": "Sampletown",
                "country": "Samplecountry"
                //"custom1": "custom value 1",
            },
            // Your recipient
            "client": {
                "name": `${invoice.recipient_first_name} ${invoice.recipient_last_name}`,
                "address": "Clientstreet 456",
                "zip": "4567 CD",
                "city": "Clientcity",
                "country": "Clientcountry"
                // "custom1": "custom value 1",
            },
            "information": {
                // Invoice number
                "number": invoice.id,
                // Invoice data
                "date": invoice.created_at,
                // Invoice due date
                "due-date": invoice.due_date
            },
            // The products you would like to see on your invoice
            // Total values are being calculated automatically
            "products": [
                ...purchases 
                // {
                //     "quantity": 2,
                //     "description": "Product 1",
                //     "tax-rate": 6,
                //     "price": 33.87
                // },   
            ],
            // The message you would like to display on the bottom of your invoice
            "bottom-notice": "Please pay your invoice within 15 days. Thank you for your support!",
            // Settings to customize your invoice
            "settings": {
                "currency": "USD"
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



module.exports = Invoice;
