const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {  
      type: String,
      required: true, 
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category',
      required: true,
    },
    ingredients: [
      {
        inventoryId: {
          type: mongoose.Schema.Types.ObjectId, // Sử dụng ObjectId cho inventoryId
          ref: 'Inventory',
          required: true,
        },
        quantity: { type: Number, required: true }, // Chỉ lưu số lượng
      },
    ],
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
