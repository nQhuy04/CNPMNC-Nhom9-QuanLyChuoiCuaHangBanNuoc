const express = require('express');
const mongoose = require('mongoose');
const Ingredient = require('../models/Ingredient'); 
const router = express.Router();

// Lấy danh sách tất cả nguyên liệu
router.get('/', async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.json(ingredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).json({ message: 'Error fetching ingredients' });
    }
});

// Lấy chi tiết một nguyên liệu theo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    // Kiểm tra tính hợp lệ của ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    try {
        const ingredient = await Ingredient.findById(id);
        if (!ingredient) {
            return res.status(404).json({ message: 'Nguyên liệu không tồn tại' });
        }
        res.json(ingredient);
    } catch (error) {
        console.error('Error fetching ingredient:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra' });
    }
});

// Thêm nguyên liệu mới
router.post('/', async (req, res) => {
    const { name, unit } = req.body;

    if (!name || !unit) {
        return res.status(400).json({ message: 'Tất cả các trường đều là bắt buộc.' });
    }

    const newIngredient = new Ingredient({
        name,
        unit,
    });

    try {
        await newIngredient.save();
        res.status(201).json({ message: 'Nguyên liệu đã được thêm thành công', ingredient: newIngredient });
    } catch (error) {
        console.error('Error saving ingredient:', error);
        res.status(500).json({ message: 'Error saving ingredient' });
    }
});

// Cập nhật nguyên liệu theo ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, unit } = req.body;

    // Kiểm tra tính hợp lệ của ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    try {
        const updateData = { name, unit };
        const updatedIngredient = await Ingredient.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedIngredient) {
            return res.status(404).json({ message: 'Nguyên liệu không tồn tại' });
        }

        res.status(200).json({ message: 'Cập nhật nguyên liệu thành công', updatedIngredient });
    } catch (error) {
        console.error('Error updating ingredient:', error);
        res.status(500).json({ message: 'Error updating ingredient' });
    }
});

// Xóa nguyên liệu theo ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    // Kiểm tra tính hợp lệ của ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    try {
        const deletedIngredient = await Ingredient.findByIdAndDelete(id);
        if (!deletedIngredient) {
            return res.status(404).json({ message: 'Nguyên liệu không tồn tại' });
        }
        res.status(200).json({ message: 'Xóa nguyên liệu thành công', deletedIngredient });
    } catch (error) {
        console.error('Error deleting ingredient:', error);
        res.status(500).json({ message: 'Error deleting ingredient' });
    }
});

module.exports = router;
