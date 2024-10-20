const mongoose = require('mongoose');

// Mô hình sản phẩm
const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên sản phẩm
    description: { type: String, required: true }, // Mô tả sản phẩm
    price: { type: Number, required: true }, // Giá sản phẩm
    image_url: { type: String }, // URL hình ảnh
    ingredients: [{ ingredient: String, quantity: String }] // Nguyên liệu
});

// Hàm pre-save để tự động gán giá trị cho sản phẩm nếu cần
productSchema.pre('save', function(next) {
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product; // Xuất mô hình
