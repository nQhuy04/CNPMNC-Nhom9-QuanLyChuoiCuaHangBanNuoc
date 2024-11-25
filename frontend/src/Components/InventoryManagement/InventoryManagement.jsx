import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import SidebarNav from '../SidebarNav/SidebarNav';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import ToastNotification from '../ToastNotification/ToastNotification';
import './InventoryManagement.css';

const InventoryManagement = () => {
    const [inventories, setInventories] = useState([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [inventoryIdToDelete, setInventoryIdToDelete] = useState(null);
    const [toast, setToast] = useState({ message: '', type: '', visible: false });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Số lượng nguyên liệu trên mỗi trang
    const location = useLocation();

    const fetchInventories = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8000/v1/inventory');
            const data = await response.json();
            setInventories(data);
        } catch (error) {
            console.error('Error fetching inventories:', error);
            showToast('Lỗi khi tải dữ liệu.', 'error');
        }
    }, []);

    useEffect(() => {
        fetchInventories();
        if (location.state && location.state.message) {
            showToast(location.state.message, 'success');
        }
    }, [location.state, fetchInventories]);

    const showToast = (message, type) => {
        setToast({ message, type, visible: true });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, visible: false }));
        }, 3000);
    };

    const handleDelete = async () => {
        if (inventoryIdToDelete) {
            try {
                const response = await fetch(
                    `http://localhost:8000/v1/inventory/${inventoryIdToDelete}`,
                    { method: 'DELETE' }
                );
    
                // Kiểm tra nếu server trả về lỗi (ví dụ: không thể xóa vì nguyên liệu đang được sử dụng trong công thức)
                if (response.ok) {
                    showToast('Xóa thành công!', 'success');
                    fetchInventories(); // Cập nhật lại danh sách sau khi xóa thành công
                } else {
                    const data = await response.json();
                    if (data.error && data.error.includes('sản phẩm')) {
                        // Nếu lỗi là do có sản phẩm sử dụng nguyên liệu
                        showToast('Không thể xóa nguyên liệu vì có sản phẩm đang sử dụng nó.', 'error');
                    } else {
                        // Các lỗi khác
                        showToast('Lỗi khi xóa nguyên liệu.', 'error');
                    }
                }
            } catch (error) {
                console.error('Error deleting inventory:', error);
                showToast('Lỗi khi xóa nguyên liệu.', 'error');
            } finally {
                setShowConfirmDialog(false);
                setInventoryIdToDelete(null);
            }
        }
    };
    

    const filteredInventories = inventories.filter((inventory) =>
        inventory.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInventories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredInventories.length / itemsPerPage);

    return (
        <div className="container_div">
            <SidebarNav />
            <div className="inventory-content">
                <h1 className="inventory-title">Quản Lý Kho</h1>
                <div className="inventory-actions">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link to="/inventory/add" className="add-inventory-button">
                        Nhập Kho
                    </Link>
                </div>

                <div className="table-wrapper">
                    <table className="inventory-table">
                        <thead className="inventory-thead">
                            <tr>
                                <th>Mã Nguyên Liệu</th>
                                <th>Tên</th>
                                <th>Đơn Vị</th>
                                <th>Số Lượng</th>
                                <th>Giá (VND)</th>
                                <th>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="inventory-tbody">
                            {currentItems.map((inventory) => (
                                <tr key={inventory.inventoryId} className="inventory-row">
                                    <td>{inventory.inventoryId}</td>
                                    <td>{inventory.name}</td>
                                    <td>{inventory.unit}</td>
                                    <td>{inventory.stockQuantity.toFixed(2)}</td>
                                    <td>
                                        {calculateTotalPrice(inventory.imports).toLocaleString()}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <Link
                                                to={`/inventory/detail/${inventory.inventoryId}`}
                                                className="icon-button detail-button"
                                                title="Xem Chi Tiết"
                                            >
                                                <AiOutlineEye size={20} />
                                            </Link>
                                            <Link
                                                to={`/inventory/edit/${inventory.inventoryId}`}
                                                className="icon-button edit-button"
                                                title="Sửa"
                                            >
                                                <AiOutlineEdit size={20} />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setShowConfirmDialog(true);
                                                    setInventoryIdToDelete(inventory.inventoryId);
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
                            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''
                                }`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {showConfirmDialog && (
                <ConfirmDialog
                    message="Bạn có chắc muốn xóa nguyên liệu này?"
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

const calculateTotalPrice = (imports) =>
    imports.reduce((total, item) => total + item.price * item.quantity, 0);

export default InventoryManagement;
