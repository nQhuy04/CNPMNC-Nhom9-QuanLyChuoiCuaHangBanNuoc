// routes/product.js

const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Lấy tất cả sản phẩm
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm sản phẩm mới
router.post('/', async (req, res) => {
    const { name, description, price, ingredients, image_url } = req.body;
    const newProduct = new Product({
        name,
        description,
        price,
        ingredients, // Sử dụng ingredients
        image_url,
    });

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Cập nhật sản phẩm
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Xóa sản phẩm
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Product.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
