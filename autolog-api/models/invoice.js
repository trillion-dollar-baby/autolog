const { parse } = require("dotenv");
const db = require("../db");
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

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
}



module.exports = Invoice;
