const { parse } = require("dotenv");
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const nodemailer = require('nodemailer');
var easyinvoice = require('easyinvoice');
const _ = require("lodash");

class Invoice {
    static convertNamingConvention(items) {
        const updatedNames = [];

        items.forEach((item) => {
            updatedNames.push(
                {
                    description: item.name,
                    price: item.sell_price,
                    quantity: item.quantity,
                    "tax-rate": 8.75
                }
            )
        })

        return updatedNames;
    }

    static async createInvoice(inventoryId, invoice, user) {
        // Required fields for a successful query
        const requiredFields = [
            "recipientFirstName",
            "recipientLastName",
            "recipientPhone",
            "recipientAddress",
            "date",
            "totalLabor",
            "vehicleVin",
            "vehicleYear",
            "vehicleMake",
            "vehicleModel",
            "vehiclePlateNumber",
            "vehicleColor",
            "totalMaterial"
        ];

        // Check if inputs for INTEGER fields are correct
        if (parseInt(invoice.totalLabor) === NaN) {
            throw new BadRequestError("Quantity is not a number");
        }

        // if (parseInt(item.totalMaterialCost) === NaN) {
        //     throw new BadRequestError("Quantity is not a number");
        // }

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
            recipient_first_name,
            recipient_last_name,
            recipient_phone,
            recipient_address,
            vehicle_vin,
            vehicle_year,
            vehicle_make,
            vehicle_model,
            vehicle_plate_number,
            total_labor_cost,
            created_at,
            total_material_cost
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
            $10,
            $11,
            $12,
            $13,
            $14
        )
        RETURNING *
        `
        
        const results = await db.query(query, 
            [inventoryId,
             user.id,
             invoice.recipientFirstName,
             invoice.recipientLastName,
             invoice.recipientPhone,
             invoice.recipientAddress,
             invoice.vehicleVin,
             invoice.vehicleYear,
             invoice.vehicleMake,
             invoice.vehicleModel,
             invoice.vehiclePlateNumber,
             invoice.totalLabor,
             invoice.date,
             invoice.totalMaterial
            ])

        return results.rows[0];
    }

    static async createSoldItemRecords(items, invoiceId) {
        const queryResults = [];
        
        items.forEach((item) => {
            if(item.quantity > item['in stock']) {
                throw new BadRequestError(`${item.name} would fall into negative!`)
            }
        })

        // Loop through each item selected for the invoice
        items.forEach(async (item) => {
            let query = `
            INSERT INTO sold_items (
                invoice_id,
                name,
                category,
                quantity,
                cost,
                sell_price
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
            )
            RETURNING id, name, category, quantity, sold_date
            `
            
            let result = await db.query(query, [invoiceId, item.name, item.category, item.quantity, parseInt(item.cost), parseInt(item['sell price'])])
            
            const queryUpdate = `
                UPDATE items
                SET quantity = $2
                WHERE id = $1
                RETURNING *;
            `
            const newQuantity = item['in stock'] - item.quantity;

            const resultUpdate = await db.query(queryUpdate, [item.id, newQuantity]);

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
            to_char(created_at, 'MM-DD-YYYY') AS "createdAt",
            id,
            inventory_id AS "inventoryId",
            recipient_address AS "recipientAddress",
            recipient_first_name AS "recipientFirstName",
            recipient_last_name AS "recipientLastName",
            recipient_phone AS "recipientPhone",
            sender_id AS "senderId",
            CAST(total_labor_cost as money) AS "totalLabor",
            CAST(total_material_cost as money) AS "totalMaterial",
            CAST((total_labor_cost + total_material_cost) as money) AS "totalProfit",
            vehicle_make AS "vehicleMake",
            vehicle_model AS "vehicleModel",
            vehicle_plate_number AS "vehiclePlateNumber",
            vehicle_vin AS "vehicleVin",
            vehicle_year AS "vehicleYear",
            invoices.created_at
        FROM
            invoices
        WHERE invoices.inventory_id = $1
        ORDER BY invoices.id DESC;
        `

        const results = await db.query(query, [inventoryId]);
        
        return results.rows;
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


    static async renderPdfInBrowser(invoice, selectedInventory) {
        const purchases = await this.getSoldItems(invoice.id)
        console.log("get purchases:", purchases)

        return await this.createInvoicePdf({ invoice, purchases, selectedInventory});
    }


    static async getSoldItems(invoiceId) {
        const query = `
            SELECT *
        FROM sold_items
        WHERE invoice_id = $1
        `

        const result = await db.query(query, [invoiceId]);

        return result.rows;
    }

    static async createInvoicePdf({ invoice, purchases, selectedInventory }) {
        console.log("invoice:", invoice);
        console.log("selected:", selectedInventory);


        const updatedNames = this.convertNamingConvention(purchases);

        let data = {
            // Customize enables you to provide your own templates
            // Please review the documentation for instructions and examples
            "customize": {
                //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
            },
            "images": {
                // The logo on top of your invoice
                // "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
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
                "number": invoice.id,
                // Invoice data
                "date": invoice.createdAt,
                // Invoice due date
                "due-date": invoice?.due_date
            },
            // The products you would like to see on your invoice
            // Total values are being calculated automatically
            "products": [
                ...updatedNames,
                {
                    "quantity": 1,
                    "description": "labor",
                    "tax-rate": 0,
                    "price": invoice.totalLabor.substring(1)
                }
                //  {
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
