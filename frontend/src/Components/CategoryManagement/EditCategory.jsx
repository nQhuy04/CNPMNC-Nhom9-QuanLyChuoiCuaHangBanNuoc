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
    
        // Lấy accessToken từ localStorage
        const persistData = JSON.parse(localStorage.getItem('persist:root'));
        const currentUser = JSON.parse(persistData.auth).login.currentUser;
        let accessToken = currentUser ? currentUser.accessToken : null;
    
        if (!accessToken) {
            console.error('Không tìm thấy accessToken');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8000/v1/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, // Gửi token
                },
                body: JSON.stringify(category),
            });
    
            if (response.status === 401) {
                // Token hết hạn, yêu cầu lấy lại access token bằng refresh token
                const refreshToken = currentUser ? currentUser.refreshToken : null;
    
                if (!refreshToken) {
                    alert('Refresh token không có. Vui lòng đăng nhập lại.');
                    navigate('/login');
                    return;
                }
    
                const refreshResponse = await fetch('http://localhost:8000/refresh', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });
    
                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    accessToken = data.accessToken;
    
                    // Lưu access token mới vào localStorage
                    currentUser.accessToken = accessToken;
                    localStorage.setItem('persist:root', JSON.stringify(persistData));
    
                    // Tiếp tục gửi lại yêu cầu với access token mới
                    const retryResponse = await fetch(`http://localhost:8000/v1/categories/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify(category),
                    });
    
                    if (retryResponse.ok) {
                        const data = await retryResponse.json();
                        console.log('Category updated:', data);
                        navigate('/category', { state: { message: 'Danh mục đã được sửa thành công!' } });
                    } else {
                        alert('Có lỗi khi sửa danh mục.');
                    }
                } else {
                    alert('Token hết hạn. Vui lòng đăng nhập lại.');
                    navigate('/login');
                }
            } else if (response.ok) {
                const data = await response.json();
                console.log('Category updated:', data);
                navigate('/category', { state: { message: 'Danh mục đã được sửa thành công!' } });
            } else {
                throw new Error('Không thể sửa danh mục');
            }
        } catch (error) {
            console.error('Error updating category:', error);
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
