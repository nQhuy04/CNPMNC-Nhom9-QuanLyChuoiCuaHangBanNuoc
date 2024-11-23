const express = require('express');
const Inventory = require('../models/Inventory');
const router = express.Router();

/* ====== CRUD INVENTORY ====== */

// POST: Nhập kho mới hoặc cập nhật nguyên liệu đã tồn tại

router.post("/", async (req, res) => {
    try {
        const ingredientList = req.body;

        // Kiểm tra nếu body không phải là mảng hoặc rỗng
        if (!Array.isArray(ingredientList) || ingredientList.length === 0) {
            return res.status(400).json({ error: "Danh sách nguyên liệu không hợp lệ hoặc rỗng." });
        }

        const processedIngredients = [];

        // Duyệt từng nguyên liệu trong danh sách
        for (const ingredient of ingredientList) {
            const { name, unit, imports = [] } = ingredient;

            // Kiểm tra thông tin bắt buộc
            if (!name?.trim() || !unit?.trim()) {
                return res.status(400).json({ error: `Thiếu tên hoặc đơn vị cho nguyên liệu: ${name || 'unknown'}` });
            }

            // Lọc và ép kiểu dữ liệu nhập kho hợp lệ
            const validImports = imports
                .filter(({ date, price, quantity }) => date && price > 0 && quantity > 0)
                .map(({ date, price, quantity }) => ({
                    date: new Date(date),
                    price: parseFloat(price),
                    quantity: parseInt(quantity, 10),
                }));

            if (validImports.length === 0) {
                return res.status(400).json({ error: `Dữ liệu nhập không hợp lệ cho nguyên liệu: ${name}` });
            }

            // Tổng số lượng nhập kho
            const totalQuantity = validImports.reduce((sum, item) => sum + item.quantity, 0);

            // Tìm kiếm nguyên liệu đã tồn tại theo `name`
            let inventory = await Inventory.findOne({ name });

            if (inventory) {
                // Cập nhật số lượng và thêm thông tin nhập kho mới
                inventory.stockQuantity += totalQuantity;
                inventory.imports.push(...validImports);
                await inventory.save();
            } else {
                // Tạo ID mới cho nguyên liệu nếu chưa tồn tại
                const lastInventory = await Inventory.findOne().sort({ inventoryId: -1 });
                const newInventoryId = lastInventory
                    ? `INT${(parseInt(lastInventory.inventoryId.slice(3)) + 1).toString().padStart(3, '0')}`
                    : 'INT001';

                // Tạo nguyên liệu mới
                inventory = new Inventory({
                    inventoryId: newInventoryId,
                    name: name.trim(),
                    unit: unit.trim(),
                    stockQuantity: totalQuantity,
                    imports: validImports,
                });
                await inventory.save();
            }

            // Lưu lại thông tin nguyên liệu đã xử lý
            processedIngredients.push(inventory);
        }

        res.status(201).json(processedIngredients); // Trả về danh sách nguyên liệu đã xử lý
    } catch (error) {
        console.error("Lỗi nhập nguyên liệu:", error);
        res.status(500).json({ error: "Có lỗi xảy ra.", details: error.message });
    }
});



  

// 2. Lấy danh sách tất cả Inventory
router.get('/', async (req, res) => {
    try {
        const inventories = await Inventory.find();
        res.status(200).json(inventories);
    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy danh sách các inventory!' });
    }
});

// 3. Lấy thông tin Inventory theo ID
router.get('/:id', async (req, res) => {
    try {
        const inventory = await Inventory.findOne({ inventoryId: req.params.id });
        if (!inventory) return res.status(404).json({ error: 'Không tìm thấy inventory!' });
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi tìm inventory!' });
    }
});

// 4. Cập nhật Inventory theo ID
router.put('/:id', async (req, res) => {
    try {
        const { name, unit, stockQuantity, imports } = req.body; // Destructure imports from the request body

        const updatedInventory = await Inventory.findOneAndUpdate(
            { inventoryId: req.params.id },
            { name, unit, stockQuantity, imports }, // Cập nhật cả imports
            { new: true }
        );

        if (!updatedInventory) return res.status(404).json({ error: 'Không tìm thấy inventory!' });
        res.status(200).json(updatedInventory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// 5. Xóa Inventory theo ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedInventory = await Inventory.findOneAndDelete({ inventoryId: req.params.id });
        if (!deletedInventory) return res.status(404).json({ error: 'Không tìm thấy inventory!' });
        res.status(200).json({ message: 'Xóa thành công!' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa inventory!' });
    }
});

module.exports = router;
