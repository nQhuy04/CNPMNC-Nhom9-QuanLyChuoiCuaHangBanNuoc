const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Inventory = require("../models/Inventory"); // Thêm mô hình Inventory

// Hàm tự sinh OrderId theo định dạng DH001, DH002, ...
async function generateOrderId() {
    const lastOrder = await Order.findOne().sort({ createdAt: -1 });
    if (!lastOrder || !lastOrder.orderId) {
        return "DH001";
    }
    const lastOrderId = lastOrder.orderId;
    const numericPart = parseInt(lastOrderId.substring(2), 10) + 1;
    const newOrderId = `DH${String(numericPart).padStart(3, "0")}`;
    return newOrderId;
}

// 1. Tạo đơn hàng
router.post("/", async (req, res) => {
    try {
        const { customerId, items, paymentMethod } = req.body;

        // Kiểm tra phương thức thanh toán hợp lệ
        const validPaymentMethods = ['Tiền mặt', 'Thẻ tín dụng', 'Ví điện tử', 'Chuyển khoản'];
        if (!validPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({ message: "Phương thức thanh toán không hợp lệ" });
        }

        // Kiểm tra khách hàng có tồn tại
        const customer = await Customer.findOne({ idCustomer: customerId }); // Sử dụng findOne để tìm theo customerId
        if (!customer) {
            return res.status(404).json({ message: "Khách hàng không tồn tại" });
        }

        // Tính tổng tiền và chuyển đổi productId thành ObjectId
        let totalAmount = 0;
        const updatedItems = await Promise.all(
            items.map(async (item) => {
                const productObjectId = new mongoose.Types.ObjectId(item.productId);
                const product = await Product.findById(productObjectId);
                if (!product) {
                    throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
                }
                const itemTotal = product.price * item.quantity;
                totalAmount += itemTotal;
                return {
                    productId: productObjectId,
                    quantity: item.quantity,
                    ingredients: product.ingredients, // Lấy thông tin nguyên liệu từ sản phẩm
                };
            })
        );

        // Tự sinh OrderId
        const orderId = await generateOrderId();

        // Tạo đơn hàng mới và thêm phương thức thanh toán
        const newOrder = new Order({
            orderId,
            customerId,  
            items: updatedItems,
            totalAmount,
            paymentMethod,  
        });

        // Cập nhật kho sau khi tạo đơn hàng
        for (let item of updatedItems) {
            for (let ingredient of item.ingredients) {
                const inventory = await Inventory.findById(ingredient.inventoryId);
                if (!inventory) {
                    return res.status(404).json({
                        message: `Nguyên liệu ${ingredient.inventoryId} không tồn tại trong kho`,
                    });
                }

                // Kiểm tra tồn kho và tính toán lượng cần trừ
                let requiredQuantityInStockUnit;

                if (ingredient.unit === 'g' && inventory.unit === 'kg') {
                    requiredQuantityInStockUnit = ingredient.quantity / inventory.conversionFactor;
                } else if (ingredient.unit === 'ml' && inventory.unit === 'lít') {
                    requiredQuantityInStockUnit = ingredient.quantity / inventory.conversionFactor;
                } else {
                    requiredQuantityInStockUnit = ingredient.quantity;
                }

                const totalRequiredQuantity = requiredQuantityInStockUnit * item.quantity;

                if (inventory.stockQuantity < totalRequiredQuantity) {
                    return res.status(400).json({
                        message: `Kho không đủ nguyên liệu ${inventory.name} để sản xuất sản phẩm`,
                    });
                }

                inventory.stockQuantity -= totalRequiredQuantity;
                await inventory.save();
            }
        }

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// 2. Lấy danh sách tất cả đơn hàng
router.get("/", async (req, res) => {
    try {
        // Lấy danh sách đơn hàng
        const orders = await Order.find().lean(); // Sử dụng lean() để chuyển đổi Document thành Plain Object

        // Duyệt qua từng đơn hàng để thêm tên khách hàng
        const updatedOrders = await Promise.all(
            orders.map(async (order) => {
                // Tìm khách hàng theo customerId
                const customer = await Customer.findOne({ idCustomer: order.customerId }).lean();
                return {
                    ...order,
                    customerName: customer ? customer.name : 'Khách hàng không tồn tại', // Thêm tên khách hàng
                };
            })
        );

        // Trả về danh sách đơn hàng đã có thêm trường customerName
        res.status(200).json(updatedOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Lấy chi tiết đơn hàng theo orderId
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm kiếm đơn hàng bằng `orderId`
        const order = await Order.findOne({ orderId: id }).lean();

        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại" });
        }

        // Nếu customerId là chuỗi, truy vấn khách hàng thủ công
        const customer = await Customer.findOne({ idCustomer: order.customerId });

        // Thêm thông tin khách hàng vào đơn hàng
        order.customerName = customer ? customer.name : 'Khách hàng không tồn tại';

        // Truy vấn thông tin sản phẩm trong đơn hàng
        const productDetails = await Promise.all(order.items.map(async (item) => {
            const product = await Product.findById(item.productId);  // Truy vấn theo productId
            if (!product) {
                return {
                    productName: 'Sản phẩm không tồn tại',
                    price: 0,
                    quantity: item.quantity
                };
            }
            return {
                productName: product.name,
                price: product.price,
                quantity: item.quantity
            };
        }));

        // Thêm thông tin sản phẩm vào đơn hàng
        order.items = productDetails;

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Sửa items của đơn hàng theo `orderId`
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { items, paymentMethod } = req.body;

        // Kiểm tra phương thức thanh toán hợp lệ
        const validPaymentMethods = ['Tiền mặt', 'Thẻ tín dụng', 'Ví điện tử', 'Chuyển khoản'];
        if (paymentMethod && !validPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({ message: "Phương thức thanh toán không hợp lệ" });
        }

        // Tìm kiếm đơn hàng
        const existingOrder = await Order.findOne({ orderId: id });
        if (!existingOrder) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại" });
        }

        // Tính lại tổng tiền và cập nhật items
        let totalAmount = 0;
        const updatedItems = await Promise.all(
            items.map(async (item) => {
                const productObjectId = new mongoose.Types.ObjectId(item.productId);
                const product = await Product.findById(productObjectId);
                if (!product) {
                    throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
                }
                const itemTotal = product.price * item.quantity;
                totalAmount += itemTotal;
                return {
                    productId: productObjectId,
                    quantity: item.quantity,
                };
            })
        );

        // Cập nhật đơn hàng với các thông tin mới
        existingOrder.items = updatedItems;
        existingOrder.totalAmount = totalAmount;

        // Cập nhật phương thức thanh toán nếu có
        if (paymentMethod) {
            existingOrder.paymentMethod = paymentMethod;
        }

        const updatedOrder = await existingOrder.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. Cập nhật trạng thái đơn hàng
router.put("/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Kiểm tra trạng thái hợp lệ
        const validStatuses = ['Chưa xử lý', 'Đang xử lý', 'Đã giao hàng', 'Đã hủy'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }

        // Tìm và cập nhật trạng thái đơn hàng
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: id },  // Tìm theo orderId
            { status },
            { new: true }  // Trả về đối tượng đã cập nhật
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại" });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: error.message });
    }
});

// 5. Xóa đơn hàng theo orderID, chỉ xóa khi trạng thái là "Đã hủy"
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm đơn hàng theo orderId
        const order = await Order.findOne({ orderId: id });

        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại" });
        }

        // Kiểm tra trạng thái đơn hàng
        if (order.status !== 'Đã hủy') {
            return res.status(400).json({ message: "Không thể xóa đơn hàng khi trạng thái không phải là 'Đã hủy'" });
        }

        // Xóa đơn hàng
        const deletedOrder = await Order.findOneAndDelete({ orderId: id });

        if (!deletedOrder) {
            return res.status(404).json({ message: "Không thể xóa đơn hàng" });
        }

        res.status(200).json({ message: "Đơn hàng đã được xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
