import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineEye, AiOutlineDelete } from 'react-icons/ai';
import SidebarNav from '../SidebarNav/SidebarNav';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import ToastNotification from '../ToastNotification/ToastNotification';
import './OrderManagement.css';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [orderIdToDelete, setOrderIdToDelete] = useState(null);
    const [toast, setToast] = useState({ message: '', type: '', visible: false });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const location = useLocation();

    // Fetch orders function
    const fetchOrders = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8000/v1/order');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            showToast('Lỗi khi tải dữ liệu.', 'error');
        }
    }, []);

    useEffect(() => {
        fetchOrders();
        if (location.state && location.state.message) {
            showToast(location.state.message, 'success');
        }
    }, [location.state, fetchOrders]);

    const showToast = (message, type) => {
        setToast({ message, type, visible: true });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, visible: false }));
        }, 3000);
    };

    const handleDelete = async () => {
        if (orderIdToDelete) {
            try {
                const response = await fetch(
                    `http://localhost:8000/v1/order/${orderIdToDelete}`,
                    { method: 'DELETE' }
                );

                if (response.ok) {
                    showToast('Xóa đơn hàng thành công!', 'success');
                    fetchOrders();
                } else {
                    showToast('Lỗi khi xóa đơn hàng.', 'error');
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                showToast('Lỗi khi xóa đơn hàng.', 'error');
            } finally {
                setShowConfirmDialog(false);
                setOrderIdToDelete(null);
            }
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8000/v1/order/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                showToast('Cập nhật trạng thái thành công!', 'success');
                fetchOrders(); // Cập nhật danh sách đơn hàng sau khi thay đổi trạng thái
            } else {
                showToast('Lỗi khi cập nhật trạng thái.', 'error');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            showToast('Lỗi khi cập nhật trạng thái.', 'error');
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Chưa xử lý':
                return 'status-pending';
            case 'Đang xử lý':
                return 'status-processing';
            case 'Đã giao hàng':
                return 'status-completed';
            case 'Đã hủy':
                return 'status-canceled';
            default:
                return '';
        }
    };

    // Filter orders based on search term
    const filteredOrders = orders.filter((order) =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    return (
        <div className="container_div">
            <SidebarNav />
            <div className="order-content">
                <h1 className="order-title">Quản Lý Đơn Hàng</h1>
                <div className="order-actions">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo Order ID..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="table-wrapper">
                    <table className="order-table">
                        <thead className="order-thead">
                            <tr>
                                <th>STT</th>
                                <th>Order ID</th>
                                <th>Khách Hàng</th>
                                <th>Tổng Tiền (VND)</th>
                                <th>Trạng Thái</th>
                                <th>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="order-tbody">
                            {currentItems.map((order, index) => (
                                <tr key={order._id} className="order-row">
                                    <td>{index + 1}</td>
                                    <td>{order.orderId}</td>
                                    <td>{order.customerId?.name || 'N/A'}</td>
                                    <td>{order.totalAmount.toLocaleString()}</td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(order.orderId, e.target.value)
                                            }
                                            className={`status-select ${getStatusClass(order.status)}`}
                                        >
                                            <option value="Chưa xử lý">Chưa xử lý</option>
                                            <option value="Đang xử lý">Đang xử lý</option>
                                            <option value="Đã giao hàng">Đã giao hàng</option>
                                            <option value="Đã hủy">Đã hủy</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <Link
                                                to={`/order/detail/${order.orderId}`}
                                                className="icon-button detail-button"
                                                title="Xem Chi Tiết"
                                            >
                                                <AiOutlineEye size={20} />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setShowConfirmDialog(true);
                                                    setOrderIdToDelete(order.orderId);
                                                }}
                                                className="icon-button delete-button"
                                                title="Xóa"
                                            >
                                                <AiOutlineDelete size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {showConfirmDialog && (
                <ConfirmDialog
                    message="Bạn có chắc muốn xóa đơn hàng này?"
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirmDialog(false)}
                />
            )}

            {toast.visible && (
                <ToastNotification
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
                />
            )}
        </div>
    );
};

export default OrderManagement;
