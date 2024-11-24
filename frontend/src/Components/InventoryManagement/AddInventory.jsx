import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddInventory.css';
import SidebarNav from '../SidebarNav/SidebarNav';
import ToastNotification from '../ToastNotification/ToastNotification'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AddInventory = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        inventoryId: '',
        name: '',
        unit: '',
        date: new Date().toISOString().split('T')[0],
        price: '',
        quantity: '',
    });
    const [inventories, setInventories] = useState([]);
    const [isNewInventory, setIsNewInventory] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState(''); // success or error
    const [loading, setLoading] = useState(false);
    const [showToastNotification, setShowToastNotification] = useState(false); // State to control toast visibility

    // Lấy danh sách nguyên liệu từ API
    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const response = await fetch('http://localhost:8000/v1/inventory');
                if (!response.ok) throw new Error('Lỗi khi tải danh sách nguyên liệu.');
                const data = await response.json();
                setInventories(data);
            } catch (error) {
                displayToast(error.message, 'error');
            }
        };
        fetchInventories();
    }, []);

    // Xử lý thay đổi trên form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'inventoryId') {
            setIsNewInventory(value === 'new');
        }
    };

    // Hiển thị thông báo toast
    const displayToast = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToastNotification(true);
        setTimeout(() => setShowToastNotification(false), 3000); // Tự động ẩn sau 3 giây
    };

    const handleValidation = () => {
        const today = new Date();
        const minDate = new Date('2020-01-01');
        const selectedDate = new Date(formData.date);
    
        if (isNewInventory) {
            if (formData.unit.trim() === '' || !isNaN(formData.unit)) {
                displayToast('Đơn vị không được nhập số.', 'error');
                return false;
            }
        }
    
        if (selectedDate > today) {
            displayToast('Ngày nhập không được lớn hơn ngày hôm nay.', 'error');
            return false;
        }
        if (selectedDate < minDate) {
            displayToast('Ngày nhập không được nhỏ hơn 1/1/2020.', 'error');
            return false;
        }
        if (formData.price <= 1000 || formData.price > 5000000) {
            displayToast('Giá nhập phải từ 1,000 đến 5,000,000 VND.', 'error');
            return false;
        }
        if (formData.quantity <= 0 || formData.quantity > 1000) {
            displayToast('Số lượng nhập phải từ 1 đến 1,000.', 'error');
            return false;
        }
        return true;
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setToastMessage('');
    
        if (!handleValidation()) {
            setLoading(false);
            return;
        }
    
        const { inventoryId, name: inputName, unit: inputUnit, date, price, quantity } = formData;
        const numericPrice = parseFloat(price);
        const numericQuantity = parseInt(quantity, 10);
    
        console.log('Dữ liệu form trước khi gửi:', formData);
        console.log('Danh sách nguyên liệu:', inventories);
    
        let name, unit;
    
        // Lấy dữ liệu `name` và `unit` dựa vào trạng thái nguyên liệu
        if (isNewInventory) {
            name = inputName.trim();
            unit = inputUnit.trim();
            console.log('Thêm nguyên liệu mới với name:', name, 'unit:', unit);
    
            if (!name || !unit) {
                displayToast('Tên và đơn vị không được để trống.', 'error');
                setLoading(false);
                return;
            }
        } else {
            const existingInventory = inventories.find((inv) => inv.inventoryId === inventoryId);
            if (!existingInventory) {
                displayToast('Nguyên liệu không tồn tại.', 'error');
                setLoading(false);
                return;
            }
            name = existingInventory.name;
            unit = existingInventory.unit;
            console.log('Nhập kho nguyên liệu hiện có với name:', name, 'unit:', unit);
        }
    
        // Tạo mảng `imports`
        const importsArray = [{ date, price: numericPrice, quantity: numericQuantity }];
        console.log('Dữ liệu imports:', importsArray);
    
        // Tạo payload dưới dạng mảng chứa object
        const payload = [
            {
                inventoryId,
                name,
                unit,
                imports: importsArray,
            }
        ];
    
        console.log('Gửi yêu cầu nhập kho với payload:', JSON.stringify(payload));
    
        try {
            const response = await fetch('http://localhost:8000/v1/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
            console.log('Response từ API khi nhập kho:', data);
    
            if (response.ok) {
                displayToast('Nhập kho thành công!', 'success');
                setTimeout(() => navigate('/inventory'), 2000);
            } else {
                displayToast(data.error || 'Có lỗi xảy ra.', 'error');
            }
        } catch (error) {
            displayToast('Lỗi hệ thống.', 'error');
            console.error('Lỗi hệ thống khi gửi yêu cầu nhập kho:', error);
        } finally {
            setLoading(false);
        }
    };
    
    
    
    
    return (
        <div className="container_div">
            <SidebarNav />
            <div className="import-form-container">
            <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="back-btn_addInventory" 
                    onClick={() => navigate(-1)}
                    title="Quay lại"
                />
                <h1>Nhập Kho</h1>

                {showToastNotification && (
                    <ToastNotification 
                        message={toastMessage} 
                        type={toastType} 
                        onClose={() => setShowToastNotification(false)} 
                    />
                )}

                <form onSubmit={handleSubmit} className="import-form">
                    <div className="form-group">
                        <label>Chọn Nguyên Liệu:</label>
                        <select
                            name="inventoryId"
                            value={formData.inventoryId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Chọn nguyên liệu --</option>
                            {inventories.map((item) => (
                                <option key={item.inventoryId} value={item.inventoryId}>
                                    {item.name}
                                </option>
                            ))}
                            <option value="new">+ Thêm nguyên liệu mới</option>
                        </select>
                    </div>

                    {isNewInventory && (
                        <>
                            <div className="form-group">
                                <label>Tên Nguyên Liệu:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Đơn Vị:</label>
                                <input
                                    type="text"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label>Ngày Nhập:</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Giá Nhập (VND):</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}        
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Số Lượng:</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Nhập Kho'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddInventory;
