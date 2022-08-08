const { parse } = require("dotenv");
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Invoice {
    static async createInvoice(inventoryId, invoice) {
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
            created_at
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
            $13
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
             invoice.date
            ])

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
            sender_id,
            recipient_first_name,
            recipient_last_name,
            recipient_address,
            created_at,
            total_labor_cost
        FROM
            invoices
        WHERE invoices.inventory_id = $1
        `

        const results = await db.query(query, inventoryId);

        return results.rows[0];
    }
}



module.exports = Invoice;
