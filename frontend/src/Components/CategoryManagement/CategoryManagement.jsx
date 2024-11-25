// Components/CategoryManagement/CategoryManagement.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CategoryManagement.css';
import SidebarNav from '../SidebarNav/SidebarNav';
import ToastNotification from '../ToastNotification/ToastNotification';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';  // Import icon

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // Thêm biến loại thông báo
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchCategories();
    // Reset trạng thái toast mỗi khi component được hiển thị
    setShowToast(false);
    setToastMessage('');
    setToastType(''); // Reset loại thông báo

    if (location.state && location.state.message) {
      setToastMessage(location.state.message);
      setToastType(location.state.type || 'success'); // Thêm loại thông báo nếu có
      setShowToast(true);
    }
  }, [location.state]); // Chạy lại effect khi location.state thay đổi

  const fetchCategories = async () => {
    const response = await fetch('http://localhost:8000/v1/categories');
    const data = await response.json();
    setCategories(data);
  };

  const handleDeleteCategory = (id) => {
    setCategoryToDelete(id);
    setConfirmDialogVisible(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/v1/categories/${categoryToDelete}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) { // Kiểm tra nếu phản hồi không thành công
        const errorData = await response.json();
        setToastMessage(errorData.error || 'Có lỗi xảy ra khi xóa danh mục.');
        setToastType('error'); // Loại thông báo là lỗi
      } else {
        setToastMessage('Danh mục đã được xóa thành công!');
        setToastType('success'); // Loại thông báo thành công
        fetchCategories(); // Cập nhật lại danh sách danh mục
      }
    } catch (error) {
      console.error(error);
      setToastMessage('Có lỗi xảy ra khi kết nối với máy chủ.');
      setToastType('error'); // Loại thông báo lỗi
    } finally {
      setShowToast(true); // Hiển thị thông báo
      setConfirmDialogVisible(false); // Ẩn hộp thoại xác nhận
    }
  };
  

  const cancelDelete = () => {
    setConfirmDialogVisible(false);
  };

  return (
    <div className="container_div">
      <SidebarNav />
      <div className="category-management">
        <h1 className="category-title">Quản Lý Danh Mục</h1>
        <Link to="/category/add" className="add-category-button">Thêm Danh Mục</Link>
        <table className="category-table">
          <thead>
            <tr className="table-header">
              <th className="table-header-item">Số Thứ Tự</th>
              <th className="table-header-item">ID Danh Mục</th>
              <th className="table-header-item">Tên Danh Mục</th>
              <th className="table-header-item">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category._id} className="table-row">
                <td className="table-cell table-cell_idCat">{index + 1}</td>
                <td className="table-cell">{category.categoryId}</td>
                <td className="table-cell">{category.name}</td>
                <td className="table-cell actions-cell">
                  <Link
                    to={`/category/edit/${category._id}`}
                    className="icon-button edit-button"
                    title="Sửa"
                  >
                    <AiOutlineEdit size={20} />
                  </Link>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="icon-button delete-button"
                    title="Xóa"
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showToast && (
        <ToastNotification 
          message={toastMessage} 
          onClose={() => setShowToast(false)} 
          type={toastType} // Truyền loại thông báo vào đây
        />
      )}
      {confirmDialogVisible && (
        <ConfirmDialog
          message="Bạn có chắc chắn muốn xóa danh mục này không?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default CategoryManagement;
