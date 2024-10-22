const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  donViTinh: { type: String, required: true },
  // Các trường khác nếu cần
});

const Material = mongoose.model('Material', materialSchema);
module.exports = Material;