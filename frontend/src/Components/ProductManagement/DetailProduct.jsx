import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarNav from '../SidebarNav/SidebarNav';
import axios from 'axios';
import './DetailProduct.css';

const DetailProduct = () => {
    const { id } = useParams(); // Lấy id từ URL
    const [product, setProduct] = useState(null);
    const navigate = useNavigate(); // Điều hướng quay lại danh sách sản phẩm

    const fetchProductDetail = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        }
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            try {
                await axios.delete(`http://localhost:8000/api/products/${id}`);
                alert('Sản phẩm đã được xóa thành công.');
                navigate('/ProductManagement'); 
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
                alert('Có lỗi xảy ra khi xóa sản phẩm.');
            }
        }
    };

    useEffect(() => {
        fetchProductDetail();
    }, [fetchProductDetail]);

    if (!product) return <p>Đang tải thông tin sản phẩm...</p>;

    return (
        <div className="container_div">
            <SidebarNav />
            <div className="product-detail-container">
                <h1 className="product-title">Chi Tiết Sản Phẩm</h1>
                <div className="product-image-container">
                    <img
                        className="product-image"
                        src={`http://localhost:8000/${product.imageUrl}`} 
                        alt={product.name}
                    />
                </div>
                <div className="product-info">
                    <h2 className="product-name">{product.name}</h2>
                    <p className="product-description"><strong>Mô tả:</strong> {product.description}</p>
                    <p className="product-price"><strong>Giá:</strong> {new Intl.NumberFormat().format(product.price)} VND</p>
    
                    <h3 className="ingredients-title">Nguyên liệu:</h3>
                    {product.ingredients && product.ingredients.length > 0 ? (
                        <ul className="ingredients-list">
                            {product.ingredients.map((ingredient, index) => (
                                <li key={index} className="ingredient-item">
                                    {ingredient.ingredient}: <strong>{ingredient.quantity}</strong>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-ingredients">Không có nguyên liệu.</p>
                    )}
    
                    <div className="button-group">
                        <button className="back-button_details" onClick={() => navigate(-1)}>
                            Quay lại
                        </button>
                        <button className="edit-button" onClick={() => navigate(`/edit-product/${id}`)}>
                            Sửa
                        </button>
                        <button className="delete-button" onClick={handleDelete}>
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
    

export default DetailProduct;
