const mongoose = require('mongoose');

// Mô hình nguyên liệu
const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Tên nguyên liệu
    unit: { type: String, required: true }   // Đơn vị tính (vd: gram, ml)
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
