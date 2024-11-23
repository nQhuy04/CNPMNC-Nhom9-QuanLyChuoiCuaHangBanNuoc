const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const mongoose = require("mongoose");

// Hàm tạo idCustomer tự động theo định dạng KH001, KH002, ...
async function generateCustomerId() {
    let customerId;
    let duplicateFound = true;
    let numericPart = 1; // Số bắt đầu

    // Keep generating a new ID until we find a unique one
    while (duplicateFound) {
        // Tạo ID theo định dạng KH001, KH002, KH003, ...
        customerId = `KH${numericPart.toString().padStart(3, '0')}`;

        // Kiểm tra xem customerId mới đã tồn tại trong cơ sở dữ liệu chưa
        const existingCustomer = await Customer.findOne({ idCustomer: customerId });

        if (!existingCustomer) {
            // Nếu không trùng, thoát khỏi vòng lặp
            duplicateFound = false;
        } else {
            // Nếu trùng, tăng numericPart lên và thử lại
            numericPart++;
            console.log(`Duplicate found for ${customerId}, generating a new one.`);
        }
    }

    console.log(`Generated unique customerId: ${customerId}`);
    return customerId;
}


// 1. Tạo khách hàng mới
router.post("/", async (req, res) => {
    try {
        const { name, phone, email, address } = req.body;

        // Kiểm tra trùng lặp email hoặc số điện thoại
        const existingCustomer = await Customer.findOne({
            $or: [{ phone }, { email }]
        });
        if (existingCustomer) {
            console.log("Customer with this email or phone already exists.");
            return res.status(400).json({ message: "Email hoặc số điện thoại đã tồn tại" });
        }

        // Tạo idCustomer tự động
        const idCustomer = await generateCustomerId();
        console.log("Generated idCustomer:", idCustomer);  // Log idCustomer

        // Tạo khách hàng mới
        const newCustomer = new Customer({
            idCustomer,
            name,
            phone,
            email,
            address
        });

        // Log thông tin khách hàng trước khi lưu
        console.log("New customer data:", newCustomer);

        // Lưu khách hàng vào cơ sở dữ liệu
        const savedCustomer = await newCustomer.save();
        console.log("Customer saved successfully:", savedCustomer);  // Log khi lưu thành công

        res.status(201).json(savedCustomer);
    } catch (error) {
        console.error("Error creating customer:", error);  // Log lỗi khi tạo khách hàng
        res.status(500).json({ message: error.message });
    }
});


// 2. Lấy danh sách tất cả khách hàng
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. Lấy thông tin chi tiết khách hàng theo ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findOne({ idCustomer: id });
        if (!customer) {
            return res.status(404).json({ message: "Khách hàng không tồn tại" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. Cập nhật thông tin khách hàng
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, email, address } = req.body;

        const updatedCustomer = await Customer.findOneAndUpdate(
            { idCustomer: id },
            { name, phone, email, address },
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Khách hàng không tồn tại" });
        }

        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 5. Xóa khách hàng
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCustomer = await Customer.findOneAndDelete({ idCustomer: id });
        
        if (!deletedCustomer) {
            return res.status(404).json({ message: "Khách hàng không tồn tại" });
        }

        res.status(200).json({ message: "Khách hàng đã được xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
