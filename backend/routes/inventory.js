const express = require('express');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
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
        const { name, unit, imports } = req.body;

        // Lấy thông tin nguyên liệu hiện tại
        const existingInventory = await Inventory.findOne({ inventoryId: req.params.id });
        if (!existingInventory) {
            return res.status(404).json({ error: 'Không tìm thấy inventory!' });
        }

        // Kiểm tra nếu có imports và cập nhật nhập kho
        if (imports && imports.length > 0) {
            // Lặp qua từng bản ghi nhập kho để cập nhật
            for (const updatedImport of imports) {
                const { date, price, quantity } = updatedImport;

                // Tìm bản ghi nhập kho theo ngày
                const importIndex = existingInventory.imports.findIndex(item => item.date.toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]);

                // Nếu tìm thấy bản ghi nhập kho cho ngày này, cập nhật lại số lượng
                if (importIndex !== -1) {
                    const oldQuantity = existingInventory.imports[importIndex].quantity;  // Số lượng cũ

                    // Cập nhật lại số lượng và giá
                    existingInventory.imports[importIndex].quantity = quantity;
                    existingInventory.imports[importIndex].price = price;

                    // Cập nhật lại tổng số lượng tồn kho (trừ đi số lượng cũ, cộng số lượng mới)
                    existingInventory.stockQuantity += (quantity - oldQuantity);
                } else {
                    // Nếu không tìm thấy bản ghi nhập kho cho ngày này, thêm mới bản ghi nhập kho
                    existingInventory.imports.push({
                        date: new Date(date),
                        price: parseFloat(price),
                        quantity: parseInt(quantity, 10)
                    });
                    existingInventory.stockQuantity += quantity; // Thêm số lượng vào tồn kho
                }
            }
        }

        // Cập nhật các thông tin khác của nguyên liệu nếu có thay đổi
        if (name) existingInventory.name = name;
        if (unit) existingInventory.unit = unit;

        // Lưu lại thông tin đã được cập nhật
        await existingInventory.save();

        res.status(200).json(existingInventory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




// 5. Xóa Inventory theo ID
router.delete('/:id', async (req, res) => {
    try {
      // Tìm nguyên liệu cần xóa theo inventoryId
      const inventory = await Inventory.findOne({ inventoryId: req.params.id });
      if (!inventory) {
        return res.status(404).json({ error: 'Không tìm thấy nguyên liệu!' });
      }
  
      // Kiểm tra xem có sản phẩm nào sử dụng nguyên liệu này trong công thức không
      const productsUsingInventory = await Product.find({
        'ingredients.inventoryId': inventory._id,
      });
  
      if (productsUsingInventory.length > 0) {
        return res.status(400).json({
          error: 'Không thể xóa nguyên liệu vì có sản phẩm đang sử dụng nó trong công thức.',
        });
      }
  
      // Nếu không có sản phẩm nào sử dụng, tiến hành xóa nguyên liệu
      const deletedInventory = await Inventory.findOneAndDelete({ inventoryId: req.params.id });
      if (!deletedInventory) {
        return res.status(404).json({ error: 'Không tìm thấy inventory!' });
      }
  
      res.status(200).json({ message: 'Xóa thành công!' });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi khi xóa nguyên liệu!' });
    }
  });
  

module.exports = router;
