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
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Inventory',
          required: true,
        },
        quantity: { 
          type: Number, 
          required: true 
        }, // Lượng nguyên liệu cần dùng trong sản phẩm (ví dụ 50g, 100ml)
        unit: { 
          type: String, 
          required: true, 
          enum: ['g', 'ml'] // Đơn vị nguyên liệu trong sản phẩm (g, ml)
        }
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
