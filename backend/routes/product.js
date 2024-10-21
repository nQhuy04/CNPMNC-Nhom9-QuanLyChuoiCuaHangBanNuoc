const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');


// Cấu hình multer để lưu trữ hình ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Lấy danh sách sản phẩm
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// GET chi tiết sản phẩm
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    // Kiểm tra tính hợp lệ của ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        res.json(product);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra' });
    }
});


// Thêm sản phẩm mới
router.post('/', upload.single('image'), async (req, res) => {
    const { name, description, price, ingredients } = req.body;

    if (!name || !description || !price || !req.file) {
        return res.status(400).json({ message: 'Tất cả các trường đều là bắt buộc.' });
    }

    const newProduct = new Product({
        name,
        description,
        price,
        image_url: req.file.path,
        ingredients: JSON.parse(ingredients)
    });

    try {
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ message: 'Error saving product' });
    }
});

// Cập nhật sản phẩm theo ID
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, description, price, ingredients } = req.body;

    try {
        const updateData = {
            name,
            description,
            price,
            ingredients: ingredients ? JSON.parse(ingredients) : undefined,
        };

        if (req.file) {
            updateData.image_url = req.file.path;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
});

// Xóa sản phẩm theo ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

module.exports = router;
