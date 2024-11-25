// Components/AddCategory/AddCategory.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNav from '../SidebarNav/SidebarNav';
import './AddCategory.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AddCategory = () => {
    const [name, setName] = useState(''); 
    const [error, setError] = useState(''); 
    const navigate = useNavigate(); 

    const handleSubmit = async (event) => {
        event.preventDefault(); 

        const category = { name }; 

        try {
            const response = await fetch('http://localhost:8000/v1/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(category),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Category added:', data);
            // Chuyển hướng về trang quản lý danh mục và truyền thông báo
            navigate('/category', { state: { message: 'Danh mục đã được thêm thành công!' } });
        } catch (error) {
            console.error('Error adding category:', error);
            // Chuyển hướng về trang quản lý danh mục và truyền thông báo lỗi
            navigate('/category', { state: { message: 'Có lỗi xảy ra khi thêm danh mục.' } });
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
    
        // Biểu thức chính quy kiểm tra xem giá trị có chứa ký tự đặc biệt (ngoài dấu cách) không
        const specialCharRegex = /[<>?./~!@$%^&*()_+|\\=\[\]{};:'",<>]/;
    
        // Kiểm tra xem giá trị có chứa số hay ký tự đặc biệt không
        if (/\d/.test(value)) {
            setError('Tên danh mục không được chứa số.'); // Cập nhật thông báo lỗi
        } else if (specialCharRegex.test(value)) {
            setError('Tên danh mục không được chứa ký tự đặc biệt.'); // Cập nhật thông báo lỗi
        } else {
            setError(''); // Xóa thông báo lỗi nếu không có số và ký tự đặc biệt
            setName(value); // Cập nhật state với giá trị hợp lệ
        }
    };
    
    
    return (
        <div className="container_div">
            <SidebarNav />
            <div className="add-category-content">
                <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="back-btn_category" 
                    onClick={() => navigate(-1)}
                    title="Quay lại"
                />
                <h1 className="add-category-title">Thêm Danh Mục Mới</h1>
                <form className="add-category-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Tên Danh Mục</label>
                        <input
                            type="text"
                            className="form-input"
                            value={name}
                            onChange={handleInputChange}
                            required
                        />
                        {error && <span className="error-message">{error}</span>}
                    </div>
                    <button type="submit" className="submit-button">Thêm Danh Mục</button>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;
