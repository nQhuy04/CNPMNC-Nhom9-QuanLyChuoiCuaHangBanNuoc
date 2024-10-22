// AddIngredient.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddIngredient.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SidebarNav from '../SidebarNav/SidebarNav';

const AddIngredient = () => {
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAddIngredient = async () => {
        if (!name || !unit) {
            setError('Tên và đơn vị là bắt buộc.');
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/ingredients', { name, unit });
            navigate('/IngredientManagement');
        } catch (error) {
            console.error('Error adding ingredient:', error);
            setError('Có lỗi xảy ra khi thêm nguyên liệu.');
        }
    };

    return (
        <div className="container_div">
            <SidebarNav/>
        <div className="add-ingredient-container">
            <FontAwesomeIcon 
                icon={faArrowLeft} 
                className="back-button" 
                onClick={() => navigate(-1)}
                title="Quay lại"
            />
            <h1 className="add-title">Thêm Nguyên Liệu</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <input
                    type="text"
                    className="ingredient-input"
                    placeholder="Tên nguyên liệu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    className="ingredient-input"
                    placeholder="Đơn vị"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                />
                <button className="add-button" onClick={handleAddIngredient}>Thêm nguyên liệu</button>
            </div>
        </div>
        </div>
    );
};

export default AddIngredient;
