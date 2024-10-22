const express = require('express');
const Order = require('../models/Order'); 
const Product = require('../models/Product'); 


const router = express.Router();

// Hàm thêm đơn hàng
router.post('/orders', async (req, res) => {
    const { customer, products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Products must be a non-empty array' });
    }

    // Tính tổng tiền
    let totalAmount = 0;
    
    // Sử dụng Promise.all để lấy giá cho tất cả sản phẩm
    try {
        const productPromises = products.map(async (item) => {
            const product = await Product.findById(item.product); // Lấy sản phẩm theo ID
            if (!product) {
                throw new Error(`Product not found for ID: ${item.product}`);
            }
            // Tính tổng tiền cho từng sản phẩm
            const price = product.price;
            const quantity = item.quantity;
            totalAmount += price * quantity; // Cộng vào tổng tiền
        });

        // Chờ tất cả Promise hoàn thành
        await Promise.all(productPromises);

        // Kiểm tra xem tổng tiền có hợp lệ không
        if (totalAmount <= 0) {
            return res.status(400).json({ message: 'Total amount must be greater than zero' });
        }

        const newOrder = new Order({
            customer,
            products,
            totalAmount,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Hàm lấy danh sách đơn hàng
router.get('/orders', async (req, res) => {
    const { page = 1, limit = 10, customerName } = req.query;

    // Tạo query tìm kiếm
    const query = customerName ? { 'customer.name': { $regex: customerName, $options: 'i' } } : {};

    try {
        const orders = await Order.find(query)
            .populate('customer', 'username email')
            .populate('products.product', 'name price')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Order.countDocuments(query);

        res.status(200).json({
            orders,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Hàm xóa đơn hàng
router.delete('/orders/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:orderId', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái đơn hàng' });
    }
});

// Hàm lấy đơn hàng theo ID
router.get('/orders/:id', async (req, res) => {
    const { id } = req.params; // Lấy ID từ URL

    try {
        const order = await Order.findById(id)
            .populate('customer', 'username email') // Nếu bạn có thông tin người dùng cần hiển thị
            .populate('products.product', 'name price'); // Nếu bạn có thông tin sản phẩm cần hiển thị

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
