const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryId: {  
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
