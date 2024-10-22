const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    ingredient: {
        type: mongoose.Schema.Types.ObjectId, // ID nguyên liệu
        ref: 'Ingredient', // Tham chiếu đến mô hình nguyên liệu
        required: true // Bắt buộc
    },
    quantity: {
        type: Number, // Số lượng nguyên liệu
        required: true // Bắt buộc
    }
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Bắt buộc
    },
    description: {
        type: String,
        required: true // Bắt buộc
    },
    price: {
        type: Number,
        required: true // Bắt buộc
    },
    imageUrl: {
        type: String, // Đường dẫn đến hình ảnh
        required: true // Bắt buộc
    },
    ingredients: [ingredientSchema] // Danh sách nguyên liệu
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
