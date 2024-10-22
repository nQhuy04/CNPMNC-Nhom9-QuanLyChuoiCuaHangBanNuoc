const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Product = require('../models/Product');
const Ingredient = require('../models/Ingredient');
const mongoose = require('mongoose');

const onProductAdded = () => {
    console.log('Sản phẩm đã được thêm thành công!');
};
// Thiết lập lưu trữ cho multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Đường dẫn nơi lưu trữ file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Thêm sản phẩm mới
router.post('/add', upload.single('image'), async (req, res) => {
    const { name, description, price } = req.body;
    const ingredients = JSON.parse(req.body['ingredients[]'] || '[]');

    // Kiểm tra dữ liệu cần thiết
    if (!name || !description || !price || !req.file) {
        return res.status(400).json({ error: 'Vui lòng cung cấp tất cả thông tin sản phẩm.' });
    }

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            imageUrl: req.file.path,
            ingredients: ingredients.map(ing => ({
                ingredient: ing.ingredient,
                quantity: ing.quantity
            }))
        });

        await newProduct.save();
        res.status(201).json({ message: 'Sản phẩm đã được thêm thành công!' });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm sản phẩm.' });
    }
});



// Lấy danh sách sản phẩm
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi lấy danh sách sản phẩm.', error });
    }
});

// Lấy chi tiết sản phẩm theo ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ message: 'Sản phẩm không tồn tại.' });
        }
        res.send(product);
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi lấy chi tiết sản phẩm.', error });
    }
});

// Cập nhật sản phẩm
router.put('/:id', upload.single('image'), async (req, res) => {
    const { name, description, price } = req.body;
    const ingredients = JSON.parse(req.body['ingredients'] || '[]');
    
    // Kiểm tra dữ liệu cần thiết
    if (!name || !description || !price) {
        return res.status(400).json({ error: 'Vui lòng cung cấp tất cả thông tin sản phẩm.' });
    }

    try {
        // Tìm sản phẩm và cập nhật
        const updatedProduct = await Product.findById(req.params.id);
        if (!updatedProduct) {
            return res.status(404).send({ message: 'Sản phẩm không tồn tại.' });
        }

        // Cập nhật thông tin
        updatedProduct.name = name;
        updatedProduct.description = description;
        updatedProduct.price = price;
        updatedProduct.ingredients = ingredients.map(ing => ({
            ingredient: ing.ingredient,
            quantity: ing.quantity
        }));
        
        // Cập nhật ảnh nếu có
        if (req.file) {
            updatedProduct.imageUrl = req.file.path;
        }

        await updatedProduct.save();
        res.send({ message: 'Sản phẩm đã được cập nhật thành công!', product: updatedProduct });
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi cập nhật sản phẩm.', error });
    }
});


// Xóa sản phẩm
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send({ message: 'Sản phẩm không tồn tại.' });
        }
        res.send({ message: 'Sản phẩm đã được xóa.', product });
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi xóa sản phẩm.', error });
    }
});

module.exports = router;
