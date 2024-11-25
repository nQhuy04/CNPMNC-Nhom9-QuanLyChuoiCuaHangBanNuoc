const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  inventoryId: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  unit: { type: String, required: true },  // 'kg', 'lít', ...
  stockQuantity: { type: Number, default: 0 },  // Lượng còn lại trong kho theo đơn vị gốc (kg, lít, ...)
  conversionFactor: { 
    type: Number, 
    default: 1000, // Tỷ lệ chuyển từ kg sang g (1 kg = 1000 g), từ lít sang ml (1 lít = 1000 ml)
    required: true 
  },
  imports: [
    {
      date: { type: Date, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
