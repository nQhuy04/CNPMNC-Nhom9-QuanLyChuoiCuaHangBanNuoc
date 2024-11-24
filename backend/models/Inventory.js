const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    inventoryId: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    unit: { type: String, required: true },
    stockQuantity: { type: Number, default: 0 },
    imports: [  
        {
            date: { type: Date, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);
