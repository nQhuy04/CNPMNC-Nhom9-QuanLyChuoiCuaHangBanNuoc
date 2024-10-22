const express = require('express');
const router = express.Router();
const Material = require('../models/Material');


//Lấy nguyên liệu
router.get('/', async (req, res) => {
    try {
        const nguyenLieuList = await Material.find(); // Truy vấn tất cả nguyên liệu
        res.status(200).json(nguyenLieuList);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách nguyên liệu' });
    }
});

//Thêm nguyên liệu
router.post('/', async (req, res) => {
    try {
        const newNguyenLieu = new Material({
            ten: req.body.ten,
            donViTinh: req.body.donViTinh,
            // Các trường khác nếu cần
        });

        const savedNguyenLieu = await newNguyenLieu.save();
        res.status(201).json(savedNguyenLieu);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm nguyên liệu', error: error.message});
    }
});

//Xóa nguyên liệu
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedNguyenLieu = await Material.findByIdAndDelete(id);
        if (!deletedNguyenLieu) {
            return res.status(404).json({ message: 'Nguyên liệu không tồn tại' });
        }
        res.status(200).json({ message: 'Xóa nguyên liệu thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa nguyên liệu' });
    }
});

//Sửa nguyên liệu

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        const updatedNguyenLieu = await Material.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedNguyenLieu) {
            return res.status(404).json({ message: 'Nguyên liệu không tồn tại' });
        }

        res.status(200).json(updatedNguyenLieu);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật nguyên liệu' });
    }
});

module.exports = router;