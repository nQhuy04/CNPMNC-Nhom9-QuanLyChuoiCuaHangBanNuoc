const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

// Kết nối đến MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Kết nối đến MongoDB thành công!"))
    .catch(err => console.error("Kết nối đến MongoDB thất bại:", err));

// Tạo ứng dụng Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mô hình sản phẩm
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image_url: String,
    ingredients: [{ ingredient: String, quantity: String }]
});

const Product = mongoose.model('Product', productSchema);

// Route để lấy danh sách sản phẩm
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Route để thêm sản phẩm
app.post('/api/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
});

// Route cho đường dẫn gốc
app.get('/', (req, res) => {
    res.send('Chào mừng bạn đến với API của tôi!');
});

// Bắt đầu server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
