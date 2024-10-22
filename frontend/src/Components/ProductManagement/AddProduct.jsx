import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProduct.css'; // Nhập CSS
import SidebarNav from '../SidebarNav/SidebarNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const AddProduct = ({ onProductAdded }) => {
    const navigate = useNavigate();
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        image: null,
        ingredients: []
    });

    const [ingredientQuantity, setIngredientQuantity] = useState('');
    const [ingredientList, setIngredientList] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);

    // Fetching ingredients when component mounts
    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/ingredients');
                setIngredientList(response.data);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };

        fetchIngredients();
    }, []);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        // Append product details to FormData
        formData.append('name', newProduct.name);
        formData.append('description', newProduct.description);
        formData.append('price', newProduct.price);
        formData.append('image', newProduct.image);

        // Append ingredients to FormData
        newProduct.ingredients.forEach((ingredient) => {
            formData.append('ingredients[]', JSON.stringify({ 
                ingredient: ingredient.ingredient, // Sử dụng _id của nguyên liệu
                quantity: ingredient.quantity 
            }));
        });

        try {
            // Sending POST request to add product
            await axios.post('http://localhost:8000/api/products/add', formData);
            alert('Sản phẩm đã được thêm thành công.');
            if (onProductAdded) {
                onProductAdded(); // Gọi hàm nếu cần sau khi sản phẩm được thêm
            }
            navigate(-1); // Quay lại trang trước
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            handleError(error);
        }
    };

    // Handle errors
    const handleError = (error) => {
        if (error.response) {
            console.error('Error response:', error.response.data);
            alert(`Error: ${error.response.data.error || 'Có lỗi xảy ra khi thêm sản phẩm.'}`);
        } else if (error.request) {
            console.error('Error request:', error.request);
            alert('Không nhận được phản hồi từ máy chủ.');
        } else {
            console.error('Error message:', error.message);
            alert('Đã xảy ra lỗi: ' + error.message);
        }
    };

    // Handle adding ingredient to the product
    const handleAddIngredient = () => {
        if (!selectedIngredient || ingredientQuantity.trim() === '') return;

        const newIngredient = {
            ingredient: selectedIngredient._id, // Sử dụng _id để tham chiếu
            quantity: parseFloat(ingredientQuantity.trim()), // Đảm bảo đây là số
        };

        setNewProduct(prevState => ({
            ...prevState,
            ingredients: [...prevState.ingredients, newIngredient]
        }));

        setIngredientQuantity(''); // Reset input field
        setSelectedIngredient(null); // Reset selection
    };

    // Handle removing ingredient from the product
    const handleRemoveIngredient = (index) => {
        const newIngredients = newProduct.ingredients.filter((_, i) => i !== index);
        setNewProduct({ ...newProduct, ingredients: newIngredients });
    };

    return (
        <div className="container_div">
            <SidebarNav />
            <form onSubmit={handleSubmit} className="add-product-form">
                <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="back-btn_product" 
                    onClick={() => navigate(-1)}
                    title="Quay lại"
                />
                <h2>Thêm Sản Phẩm Mới</h2>
                <div className="form-group">
                    <label className="form-label">Tên Sản Phẩm</label>
                    <input 
                        type="text" 
                        className="form-input" 
                        value={newProduct.name} 
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Mô Tả</label>
                    <textarea 
                        className="form-textarea" 
                        value={newProduct.description} 
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Giá</label>
                    <input 
                        type="number" 
                        className="form-input" 
                        value={newProduct.price} 
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Chọn Ảnh</label>
                    <input 
                        type="file" 
                        className="form-input" 
                        accept="image/png, image/jpeg" 
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })} 
                        required 
                    />
                </div>
                <div className="ingredient-selection">
                    <h3>Chọn Nguyên Liệu</h3>
                    <select 
                        className="form-select" 
                        value={selectedIngredient?._id || ''} 
                        onChange={(e) => setSelectedIngredient(ingredientList.find(ing => ing._id === e.target.value))}
                    >
                        <option value="">Chọn nguyên liệu</option>
                        {ingredientList.map(ingredient => (
                            <option key={ingredient._id} value={ingredient._id}>
                                {ingredient.name}
                            </option>
                        ))}
                    </select>
                    <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Số lượng" 
                        value={ingredientQuantity} 
                        onChange={(e) => setIngredientQuantity(e.target.value)} 
                    />
                    <button type="button" className="btn-add" onClick={handleAddIngredient}>Thêm Nguyên Liệu</button>
                </div>
                <div className="added-ingredients">
                    <h3>Nguyên Liệu Đã Thêm</h3>
                    <ul>
                        {newProduct.ingredients.map((ingredient, index) => (
                            <li key={index} className="ingredient-item">
                                {ingredient.ingredient} - {ingredient.quantity} 
                                <button type="button" className="btn-remove" onClick={() => handleRemoveIngredient(index)}>Xóa</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="submit" className="btn-submit">Thêm Sản Phẩm</button>
            </form>
        </div>
    );
};

export default AddProduct;
