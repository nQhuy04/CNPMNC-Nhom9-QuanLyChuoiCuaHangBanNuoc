// server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const productRoute = require('./routes/product'); 

dotenv.config();
const app = express();
const uri = process.env.MONGO_URI;
const Port = process.env.Port;

async function connectToDB() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

connectToDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/api/products", productRoute); 

app.listen(Port, () => {
    console.log(`Server is running on http://localhost:${Port}`);
});
