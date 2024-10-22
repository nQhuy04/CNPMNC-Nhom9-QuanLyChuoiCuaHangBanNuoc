import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OrderManagement.css';
import SidebarNav from '../SidebarNav/SidebarNav';

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    // Lấy danh sách đơn hàng
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/orders');
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            }
        };
        fetchOrders();
    }, []);

    // Xóa đơn hàng
    const handleDeleteOrder = async (orderId) => {
        try {
            await axios.delete(`http://localhost:8000/api/orders/${orderId}`);
            alert('Xóa đơn hàng thành công!');
            setOrders(orders.filter((order) => order._id !== orderId));
        } catch (error) {
            console.error('Lỗi khi xóa đơn hàng:', error);
        }
    };

    // Điều hướng sang trang chi tiết đơn hàng
    const handleViewDetail = (order) => {
        navigate(`/orders/${order._id}`);
    };

    return (
        <div className="order-management-wrapper">
            <SidebarNav />
            <div className="order-management-content">
                <h1 className="order-management-title">Quản Lý Đơn Hàng</h1>
                <div className="order-list-container">
                    <h2 className="order-list-title">Danh Sách Đơn Hàng</h2>
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Mã Đơn Hàng</th>
                                <th>Khách Hàng (Username)</th>
                                <th>Tổng Tiền (VND)</th>
                                <th>Trạng Thái</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>#{order._id}</td>
                                    <td>{order.customer?.username || 'Không có username'}</td>
                                    <td>{order.totalAmount.toLocaleString()}</td>
                                    <td>{order.status}</td>
                                    <td>
                                        <button
                                            className="action-btn detail-btn"
                                            onClick={() => handleViewDetail(order)}
                                        >
                                            Chi Tiết
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => handleDeleteOrder(order._id)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrderManagement;
