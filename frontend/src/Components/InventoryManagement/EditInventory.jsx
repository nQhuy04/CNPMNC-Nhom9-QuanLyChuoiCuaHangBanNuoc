import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarNav from '../SidebarNav/SidebarNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ToastNotification from '../ToastNotification/ToastNotification';
import './EditInventory.css';

const EditInventory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inventory, setInventory] = useState(null);
    const [editData, setEditData] = useState([]);
    const [toast, setToast] = useState({ message: '', type: '', isVisible: false });

    useEffect(() => {
        let isMounted = true;

        const fetchInventoryDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8000/v1/inventory/${id}`);
                if (!response.ok) {
                    throw new Error('Không thể lấy thông tin nguyên liệu.');
                }
                const data = await response.json();
                if (isMounted) {
                    setInventory(data);
                    setEditData(data.imports);
                }
            } catch (error) {
                console.error('Error fetching inventory detail:', error);
                setToast({ message: error.message, type: 'error', isVisible: true });
            }
        };

        fetchInventoryDetail();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleChange = (index, name, value) => {
        const newEditData = [...editData];

        if (name === 'quantity' || name === 'price') {
            const numericValue = parseFloat(value);
            if (isNaN(numericValue) || numericValue < 0) {
                setToast({ message: 'Số lượng và giá phải là số dương!', type: 'error', isVisible: true });
                return;
            }
        }

        newEditData[index] = { ...newEditData[index], [name]: value };
        setEditData(newEditData);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:8000/v1/inventory/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...inventory, imports: editData }),
            });

            if (!response.ok) {
                throw new Error('Không thể cập nhật thông tin nguyên liệu.');
            }

            navigate('/inventory', { state: { message: 'Cập nhật kho thành công!' } });
        } catch (error) {
            console.error('Lỗi cập nhật kho:', error);
            navigate('/category', { state: { message: 'Cập nhật kho thất bại' } });
        }
    };

    const handleToastClose = () => {
        setToast({ ...toast, isVisible: false });
    };

    if (!inventory) return <p className="loading-text">Loading...</p>;

    return (
        <div className="container_div">
            <SidebarNav />
            <div className="edit-inventory-content">
                <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="back_btn_inventory" 
                    onClick={() => navigate(-1)}
                    title="Quay lại"
                />
                <h1 className="edit-inventory-title">Sửa Thông Tin Nguyên Liệu: {inventory.name}</h1>
                
                <div className="edit-inventory-info">
                    <div className="edit-inventory-item">
                        <label>Tên Nguyên Liệu:</label>
                        <input
                            type="text"
                            name="name"
                            value={inventory.name}
                            onChange={(e) => setInventory({ ...inventory, name: e.target.value })}
                        />
                    </div>
                    <div className="edit-inventory-item">
                        <label>Đơn Vị:</label>
                        <input
                            type="text"
                            name="unit"
                            value={inventory.unit}
                            onChange={(e) => setInventory({ ...inventory, unit: e.target.value })}
                        />
                    </div>
                </div>

                <h3 className="edit-inventory-subtitle">Danh Sách Ngày Nhập Hàng:</h3>

                <div className="edit-inventory-save-button">
                    <button className="save-button" onClick={handleSave}>Lưu Thay Đổi</button>
                </div>

                <table className="edit-inventory-table">
                    <thead>
                        <tr>
                            <th>Số Thứ Tự</th>
                            <th>Ngày Nhập</th>
                            <th>Số Lượng Nhập</th>
                            <th>Giá Nhập (VND)</th>
                            <th>Thay Đổi Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {editData.map((entry, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <input
                                        type="date"
                                        value={entry.date.split('T')[0]}
                                        onChange={(e) => handleChange(index, 'date', e.target.value)}
                                        className="edit-inventory-date-input"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={entry.quantity}
                                        onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                                        placeholder="Nhập số lượng"
                                        className="edit-inventory-quantity-input"
                                    />
                                </td>
                                <td>{entry.price.toLocaleString()} VND</td>
                                <td>
                                    <input
                                        type="number"
                                        name="price"
                                        value={entry.price}
                                        onChange={(e) => handleChange(index, 'price', e.target.value)}
                                        placeholder="Nhập giá mới"
                                        className="edit-inventory-price-input"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {toast.isVisible && (
                <ToastNotification 
                    message={toast.message} 
                    onClose={handleToastClose} 
                    type={toast.type} 
                />
            )}
        </div>
    );
};

export default EditInventory;
