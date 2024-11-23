const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: { 
        type: String,
        required: true,
        unique: true,
    },
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Customer", 
        required: true 
    },
    orderDate: { 
        type: Date, 
        default: Date.now 
    },
    totalAmount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Chưa xử lý', 'Đang xử lý', 'Đã giao hàng', 'Đã hủy'], 
        default: 'Chưa xử lý', 
        required: true 
    },
    items: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Product", 
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true 
            }        
        }
    ],
    paymentMethod: {  // Thêm trường phương thức thanh toán
        type: String,
        enum: ['Tiền mặt', 'Thẻ tín dụng', 'Ví điện tử', 'Chuyển khoản'],  
        required: true
    }
},
{ timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
