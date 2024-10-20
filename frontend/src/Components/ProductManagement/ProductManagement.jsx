// src/components/ProductManagement.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    return (
        <div>
            <h1>Quản Lý Sản Phẩm</h1>
            <h2>Danh sách sản phẩm</h2>
            <ul>
                {products.map(product => (
                    <li key={product._id}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Giá: {product.price} VND</p>
                        <img src={product.image_url} alt={product.name} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductManagement;
