// routes/category.js
const express = require('express');
const Category = require('../models/Category');
const Product = require('../models/Product');
const router = express.Router();

/* ====== CRUD CATEGORIES ====== */

// 1. Tạo mới Category
router.post('/', async (req, res) => {
  try {
      // Tìm categoryId lớn nhất hiện có
      const latestCategory = await Category.findOne({}, {}, { sort: { categoryId: -1 } });
      const categoryId = latestCategory ? 
          `CAT${(parseInt(latestCategory.categoryId.slice(3)) + 1).toString().padStart(3, '0')}` : 
          'CAT001'; // Bắt đầu từ CAT001 nếu không có category nào

      const category = new Category({ categoryId, name: req.body.name });
      await category.save();
      res.status(201).json(category);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// 2. Lấy danh sách tất cả Category
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Không thể lấy danh sách các category!' });
  }
});

// 3. Lấy thông tin Category theo ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Không tìm thấy category!' });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi tìm category!' });
  }
});

// 4. Cập nhật Category theo ID
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!updatedCategory) return res.status(404).json({ error: 'Không tìm thấy category!' });
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Xóa Category theo ID
router.delete('/:id', async (req, res) => {
  try {
    const linkedProducts = await Product.find({ categoryId: req.params.id });

    if (linkedProducts.length > 0) {
      return res.status(400).json({ 
        error: 'Không thể xóa danh mục vì vẫn còn sản phẩm thuộc danh mục này!' 
      });
    }

    // Xóa danh mục nếu không có sản phẩm liên kết
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Không tìm thấy danh mục!' });
    }

    res.status(200).json({ message: 'Xóa danh mục thành công!' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xóa danh mục!' });
  }
});


module.exports = router;
