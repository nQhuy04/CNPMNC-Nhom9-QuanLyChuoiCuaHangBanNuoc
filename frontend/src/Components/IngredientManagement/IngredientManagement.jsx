// IngredientManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './IngredientManagement.css'; // Nhập tệp CSS riêng cho trang này
import SidebarNav from '../SidebarNav/SidebarNav';

const IngredientManagement = () => {
    const [ingredients, setIngredients] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Khởi tạo useNavigate để điều hướng

    const fetchIngredients = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/ingredients');
            setIngredients(response.data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    useEffect(() => {
        fetchIngredients();
    }, []);

    const handleDeleteIngredient = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/ingredients/${id}`);
            setIngredients(ingredients.filter(ingredient => ingredient._id !== id));
        } catch (error) {
            console.error('Error deleting ingredient:', error);
        }
    };

    const handleEdit = (ingredient) => {
        navigate(`/ingredients-edit/${ingredient._id}`);
    };

    return (
        <div className="container_div">
            <SidebarNav/>
        <div className="ingredient-management-container">
            <h1 className="ingredient-title">Quản Lý Nguyên Liệu</h1>
            <Link to="/ingredients-add">
                <button className="add-ingredient-button">Thêm Nguyên Liệu</button>
            </Link>
            {error && <p className="error-message">{error}</p>}
            <div className="ingredient-table-container">
                <table className="ingredient-table">
                    <thead>
                        <tr>
                            <th className="ingredient-header">Tên Nguyên Liệu</th>
                            <th className="ingredient-header">Đơn Vị</th>
                            <th className="ingredient-header">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredients.map((ingredient) => (
                            <tr key={ingredient._id}>
                                <td className="ingredient-cell">{ingredient.name}</td>
                                <td className="ingredient-cell">{ingredient.unit}</td>
                                <td className="ingredient-cell">
                                    <button className="edit-button" onClick={() => handleEdit(ingredient)}>Sửa</button>
                                    <button className="delete-button" onClick={() => handleDeleteIngredient(ingredient._id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};

export default IngredientManagement;
