// Components/EditCategory/EditCategory.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarNav from '../SidebarNav/SidebarNav';
import './EditCategory.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const EditCategory = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const [name, setName] = useState('');
    const [error, setError] = useState(''); // Trạng thái để lưu thông báo lỗi
    const navigate = useNavigate(); 

    useEffect(() => {
        // Lấy thông tin danh mục hiện tại
        const fetchCategory = async () => {
            const response = await fetch(`http://localhost:8000/v1/categories/${id}`);
            const data = await response.json();
            setName(data.name); // Cập nhật state với tên danh mục hiện tại
        };

        fetchCategory();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault(); 

        const category = { name }; 

        try {
            const response = await fetch(`http://localhost:8000/v1/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(category),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Category updated:', data);
            // Chuyển hướng về trang quản lý danh mục và truyền thông báo
            navigate('/category', { state: { message: 'Danh mục đã được sửa thành công!' } });
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;

        // Kiểm tra xem giá trị nhập vào có chứa số hay không
        if (/[\d]/.test(value)) {
            setError('Tên danh mục không được chứa số.'); // Cập nhật thông báo lỗi
        } else {
            setError(''); // Xóa thông báo lỗi nếu không có số
            setName(value); // Cập nhật state với giá trị hợp lệ
        }
    };

    return (
        <div className="container_div">
            <SidebarNav />
            <div className="edit-category-content">
                <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="back-btn_edtCat" 
                    onClick={() => navigate(-1)}
                    title="Quay lại"
                />
                <h1 className="edit-category-title">Sửa Danh Mục</h1>
                <form className="edit-category-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Tên Danh Mục</label>
                        <input
                            type="text"
                            className="form-input"
                            value={name}
                            onChange={handleInputChange} 
                            required
                        />
                        {error && <span className="error-message">{error}</span>} {/* Hiển thị thông báo lỗi */}
                    </div>
                    <button type="submit" className="submit-button">Cập Nhật Danh Mục</button>
                </form>
            </div>
        </div>
    );
};

export default EditCategory;
