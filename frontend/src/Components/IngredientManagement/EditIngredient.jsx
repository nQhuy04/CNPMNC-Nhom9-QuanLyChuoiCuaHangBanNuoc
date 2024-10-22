// EditIngredient.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditIngredient.css'; // Nhập tệp CSS riêng cho trang này
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SidebarNav from '../SidebarNav/SidebarNav';

const EditIngredient = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIngredient = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/ingredients/${id}`);
                setName(response.data.name);
                setUnit(response.data.unit);
            } catch (error) {
                console.error('Error fetching ingredient:', error);
            }
        };

        fetchIngredient();
    }, [id]);

    const handleUpdateIngredient = async () => {
        if (!name || !unit) {
            setError('Tên và đơn vị là bắt buộc.');
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/ingredients/${id}`, { name, unit });
            navigate('/IngredientManagement');
        } catch (error) {
            console.error('Error updating ingredient:', error);
            setError('Có lỗi xảy ra khi cập nhật nguyên liệu.');
        }
    };

    return (
        <div className="container_div">
            <SidebarNav/>
        <div className="edit-ingredient-container">
            <FontAwesomeIcon 
                icon={faArrowLeft} 
                className="back-button" 
                onClick={() => navigate(-1)}
                title="Quay lại"
            />
            <h1 className="edit-title">Chỉnh Sửa Nguyên Liệu</h1>
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
                <button className="update-button" onClick={handleUpdateIngredient}>Cập nhật nguyên liệu</button>
            </div>
        </div>
        </div>
    );
};

export default EditIngredient;
