import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarNav from '../SidebarNav/SidebarNav';
import './EditProduct.css';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        ingredients: [{ ingredient: '', quantity: '' }],
    });
    const [image, setImage] = useState(null); // Để lưu ảnh mới

    // Sử dụng useCallback để giữ hàm fetchProduct
    const fetchProduct = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error.response?.data || error.message);
        }
    }, [id]); // Chỉ phụ thuộc vào id

    // Gọi fetchProduct khi component được mount
    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleIngredientChange = (index, e) => {
        const updatedIngredients = [...product.ingredients];
        updatedIngredients[index][e.target.name] = e.target.value;
        setProduct({ ...product, ingredients: updatedIngredients });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Lưu ảnh đã chọn vào state
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('ingredients', JSON.stringify(product.ingredients)); 
        if (image) formData.append('image', image); // Gửi ảnh mới nếu có
    
        try {
            const response = await axios.put(`http://localhost:8000/api/products/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert(response.data.message); // Hiển thị thông báo thành công từ server
            navigate('/ProductManagement'); // Điều hướng sau khi cập nhật thành công
        } catch (error) {
            console.error('Error updating product:', error.response?.data || error.message);
            alert('Failed to update product.');
        }
    };
    

    const addIngredient = () => {
        setProduct({
            ...product,
            ingredients: [...product.ingredients, { ingredient: '', quantity: '' }],
        });
    };

    const removeIngredient = (index) => {
        const updatedIngredients = product.ingredients.filter((_, i) => i !== index);
        setProduct({ ...product, ingredients: updatedIngredients });
    };

    return (
        <div className="container_div">
            <SidebarNav />
            <div className="product-container">
                <h1 className="title">Edit Product</h1>
                <form onSubmit={handleSubmit} className="edit-form">
                    <label>
                        Tên:
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <label>
                        Mô tả:
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <label>
                        Giá:
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <label>Hình ảnh:</label>
                    <input type="file" onChange={handleImageChange} />
                    <button className='btn_addIngredient' type="button" onClick={addIngredient}>
                        Thêm nguyên liệu
                    </button>
                    {product.ingredients.map((item, index) => (
                        <div key={index} className="ingredient-item">
                            <input
                                className='input_ingredient_edit'
                                type="text"
                                name="ingredient"
                                value={item.ingredient}
                                onChange={(e) => handleIngredientChange(index, e)}
                                placeholder="Ingredient"
                                required
                            />
                            <input
                                className='input_ingredient_edit'
                                type="text"
                                name="quantity"
                                value={item.quantity}
                                onChange={(e) => handleIngredientChange(index, e)}
                                placeholder="Quantity"
                                required
                            />
                            <button className='Remove_ingredients_btn' type="button" onClick={() => removeIngredient(index)}>
                                Xóa
                            </button>
                        </div>
                    ))}

                    <button className='btn_EditSubmit' type="submit">Cập nhật sản phẩm</button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
