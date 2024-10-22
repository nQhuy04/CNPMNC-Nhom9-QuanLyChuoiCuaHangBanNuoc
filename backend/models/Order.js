const mongoose = require('mongoose');

// Mô hình đơn hàng
const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ 
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Completed', 'Cancelled'], 
        default: 'Pending' 
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
