import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css'; // Nhập CSS
import { useNavigate } from 'react-router-dom';
const AddProduct = ({ onProductAdded }) => {
    const navigate = useNavigate();
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        image: null,
        ingredients: [] // Bắt đầu với một mảng rỗng
    });


   
    const [ingredientName, setIngredientName] = useState(''); // Tên nguyên liệu
    const [ingredientQuantity, setIngredientQuantity] = useState(''); // Số lượng nguyên liệu

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('description', newProduct.description);
        formData.append('price', newProduct.price);
        formData.append('image', newProduct.image);
        formData.append('ingredients', JSON.stringify(newProduct.ingredients)); // Chuyển mảng thành chuỗi JSON
        
        

        try {
            await axios.post('http://localhost:8000/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'

                }
            });
            alert("Thêm sản phẩm thành công")
            navigate('/ProductManagement');  
            onProductAdded('/ProductManagement'); 
            
        } catch (error) {
            console.error('Error adding product:', error);
           
        }
    };

    const handleAddIngredient = () => {
        if (ingredientName.trim() === '' || ingredientQuantity.trim() === '') return; // Không thêm nguyên liệu rỗng

        const newIngredient = {
            ingredient: ingredientName.trim(),
            quantity: ingredientQuantity.trim()
        };

        // Thêm nguyên liệu vào danh sách
        setNewProduct(prevState => ({
            ...prevState,
            ingredients: [...prevState.ingredients, newIngredient] // Thêm nguyên liệu mới
        }));

        setIngredientName('');
        setIngredientQuantity('');
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = newProduct.ingredients.filter((_, i) => i !== index); // Xóa nguyên liệu tại vị trí index
        setNewProduct({ ...newProduct, ingredients: newIngredients });
    };

    return (
        <form onSubmit={handleSubmit} className="add-product">
            <h2>Thêm Sản Phẩm Mới</h2>
            <div className="form-group">
                <label>Tên Sản Phẩm</label>
                <input 
                    type="text" 
                    value={newProduct.name} 
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} 
                    required 
                    className="input-field"
                />
            </div>
            <div className="form-group">
                <label>Mô Tả Sản Phẩm</label>
                <textarea 
                    value={newProduct.description} 
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} 
                    required 
                    className="input-field"
                />
            </div>
            <div className="form-group">
                <label>Giá Sản Phẩm (VND)</label>
                <input 
                    type="number" 
                    value={newProduct.price} 
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} 
                    required 
                    className="input-field"
                />
            </div>
            <div className="form-group">
                <label>Hình Ảnh</label>
                <input 
                    type="file" 
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })} 
                    required 
                    className="input-field"
                />
            </div>
            <div className="form-group">
                <label>Nguyên Liệu</label>
                <div className="ingredient-inputs">
                    <input 
                        type="text" 
                        value={ingredientName} 
                        onChange={(e) => setIngredientName(e.target.value)} 
                        placeholder="Tên Nguyên Liệu" 
                        className="input-field"
                    />
                    <input 
                        type="text" 
                        value={ingredientQuantity} 
                        onChange={(e) => setIngredientQuantity(e.target.value)} 
                        placeholder="Số Lượng" 
                        className="input-field"
                    />
                    <button type="button" onClick={handleAddIngredient} className="btn-add-ingredient">Thêm</button>
                </div>
                <ul className="ingredient-list">
                    {newProduct.ingredients.map((ingredient, index) => (
                        <li key={index} className="ingredient-item">
                            {ingredient.ingredient} - {ingredient.quantity} 
                            <button type="button" onClick={() => handleRemoveIngredient(index)} className="btn-remove-ingredient">Xóa</button>
                        </li>
                    ))}
                </ul>
            </div>
            <button type="submit" className="btn-submit">Thêm Sản Phẩm</button>
        </form>
    );
};

export default AddProduct;