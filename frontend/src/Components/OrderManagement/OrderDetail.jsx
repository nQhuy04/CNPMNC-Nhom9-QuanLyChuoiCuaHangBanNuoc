// OrderDetail.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './OrderDetail.css';
import SidebarNav from '../SidebarNav/SidebarNav';

function OrderDetail() {
    const { orderId } = useParams(); // Lấy ID đơn hàng từ URL
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState(''); // Trạng thái đơn hàng hiện tại
    const navigate = useNavigate(); // Khai báo để điều hướng

    // Lấy thông tin chi tiết đơn hàng
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/orders/${orderId}`);
                setOrder(response.data);
                setStatus(response.data.status); // Lưu trạng thái hiện tại
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    // Xử lý khi thay đổi trạng thái
    const handleStatusChange = async (newStatus) => {
        try {
            await axios.put(`http://localhost:8000/api/orders/${orderId}`, { status: newStatus });
            setStatus(newStatus); // Cập nhật trạng thái trong giao diện
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
        }
    };

    return (
        <div className="container_div">
            <SidebarNav/>
        <div className="order-detail-container">
            <FontAwesomeIcon 
                icon={faArrowLeft} 
                className="back-icon" 
                onClick={() => navigate(-1)}
                title="Quay lại"
            />
            {order ? (
                <>
                    <h1>Chi Tiết Đơn Hàng</h1>
                    <h2>Khách Hàng: {order.customer?.username || 'Không có'}</h2>
                    <h3>Tổng Tiền: {order.totalAmount.toLocaleString()} VND</h3>
                    
                    {/* Trạng thái đơn hàng */}
                    <div className="order-status">
                        <label htmlFor="status">Trạng Thái: </label>
                        <select 
                            id="status" 
                            value={status} 
                            onChange={(e) => handleStatusChange(e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <h4>Danh Sách Sản Phẩm:</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Tên Sản Phẩm</th>
                                <th>Giá (VND)</th>
                                <th>Số Lượng</th>
                                <th>Thành Tiền (VND)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.products.map((item) => (
                                <tr key={item.product._id}>
                                    <td>{item.product.name}</td>
                                    <td>{item.product.price.toLocaleString()}</td>
                                    <td>{item.quantity}</td>
                                    <td>{(item.product.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>Đang tải thông tin chi tiết...</p>
            )}
        </div>
        </div>
    );
}

export default OrderDetail;
