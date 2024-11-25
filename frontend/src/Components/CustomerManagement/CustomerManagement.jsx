import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CustomerManagement.css';
import SidebarNav from '../SidebarNav/SidebarNav';
import ToastNotification from '../ToastNotification/ToastNotification';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');  // success or error
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchCustomers();
    setShowToast(false);
    setToastMessage('');
    setToastType('');

    if (location.state && location.state.message) {
      setToastMessage(location.state.message);
      setToastType(location.state.type || 'success');
      setShowToast(true);
    }
  }, [location.state]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8000/v1/customer');
      if (!response.ok) {
        throw new Error('Không thể tải danh sách khách hàng.');
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      setToastMessage(error.message || 'Có lỗi xảy ra khi tải danh sách khách hàng.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleDeleteCustomer = (idCustomer) => {
    setCustomerToDelete(idCustomer);
    setConfirmDialogVisible(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/v1/customer/${customerToDelete}`, { 
        method: 'DELETE' 
      });

      if (!response.ok) {
        const errorData = await response.json();
        setToastMessage(errorData.message || 'Có lỗi xảy ra khi xóa khách hàng.');
        setToastType('error');
      } else {
        setToastMessage('Khách hàng đã được xóa thành công!');
        setToastType('success');
        fetchCustomers();
      }
    } catch (error) {
      setToastMessage(error.message || 'Có lỗi xảy ra khi kết nối với máy chủ.');
      setToastType('error');
    } finally {
      setShowToast(true);
      setConfirmDialogVisible(false);
    }
  };

  const cancelDelete = () => {
    setConfirmDialogVisible(false);
  };

  return (
    <div className="container_div">
      <SidebarNav />
      <div className="customer-management-content">
        <h1 className="customer-management-title">Quản Lý Khách Hàng</h1>
        <Link to="/customer/add" className="customer-add-button">Thêm Khách Hàng</Link>
        <table className="customer-management-table">
          <thead>
            <tr className="table-header">
              <th className="table-header-item">STT</th>
              <th className="table-header-item">ID Khách Hàng</th>
              <th className="table-header-item">Tên Khách Hàng</th>
              <th className="table-header-item">Số Điện Thoại</th>
              <th className="table-header-item">Email</th>
              <th className="table-header-item">Địa Chỉ</th>
              <th className="table-header-item">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer.idCustomer} className="table-row">
                <td className="table-cell table-cell-index">{index + 1}</td>
                <td className="table-cell">{customer.idCustomer}</td>
                <td className="table-cell">{customer.name}</td>
                <td className="table-cell">{customer.phone}</td>
                <td className="table-cell">{customer.email}</td>
                <td className="table-cell">{customer.address}</td>
                <td className="table-cell actions-cell">
                  <Link
                    to={`/customer/edit/${customer.idCustomer}`}
                    className="action-button edit-button"
                    title="Sửa"
                  >
                    <AiOutlineEdit size={20} />
                  </Link>
                  <button
                    onClick={() => handleDeleteCustomer(customer.idCustomer)}
                    className="action-button delete-button"
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
          type={toastType}
        />
      )}
      {confirmDialogVisible && (
        <ConfirmDialog
          message="Bạn có chắc chắn muốn xóa khách hàng này không?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default CustomerManagement;
