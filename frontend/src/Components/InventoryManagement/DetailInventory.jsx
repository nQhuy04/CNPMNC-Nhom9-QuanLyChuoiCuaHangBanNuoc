import React, { useEffect, useState } from 'react'; // Khai báo useEffect và useState
import { useParams, useNavigate } from 'react-router-dom'; // Khai báo useParams và useNavigate
import SidebarNav from '../SidebarNav/SidebarNav'; // Khai báo SidebarNav
import ToastNotification from '../ToastNotification/ToastNotification'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; 
import './DetailInventory.css'; // Import CSS

const DetailInventory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inventory, setInventory] = useState(null);
    const [dateFilter, setDateFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [filteredImports, setFilteredImports] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchInventoryDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8000/v1/inventory/${id}`);
                if (!response.ok) {
                    throw new Error('Không thể lấy thông tin nguyên liệu.');
                }
                const data = await response.json();
                setInventory(data);
                setFilteredImports(data.imports);
            } catch (error) {
                console.error('Error fetching inventory detail:', error);
                setErrorMessage(error.message);
            }
        };

        fetchInventoryDetail();
    }, [id]);

    if (!inventory) return <p className="loading-text">Loading...</p>;

    const today = new Date().toISOString().split('T')[0]; // Định nghĩa biến today ở đây

    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (value === '' || value >= 0) {
            setPriceFilter(value);
            setErrorMessage('');
        } else {
            setErrorMessage("Giá không được âm.");
        }
    };

    const handleDateChange = (e) => {
        setDateFilter(e.target.value);
        setErrorMessage('');
    };

    const applyFilters = () => {
        if (dateFilter && (dateFilter < "2020-01-01" || dateFilter > today)) {
            setErrorMessage("Ngày phải nằm trong khoảng từ 01/01/2020 đến hôm nay.");
            return;
        }

        if (priceFilter < 0) {
            setErrorMessage("Giá không được âm.");
            return;
        }

        const filtered = inventory.imports.filter((entry) => {
            const entryDate = new Date(entry.date).toISOString().split('T')[0];
            const entryPrice = entry.price;

            const dateMatch = dateFilter ? entryDate === dateFilter : true;
            const priceMatch = priceFilter ? entryPrice === parseFloat(priceFilter) : true;

            return dateMatch && priceMatch;
        });

        setFilteredImports(filtered);
        setErrorMessage('');
    };

    const handleCloseToast = () => {
        setErrorMessage('');
    };

    return (
        <div className="container_div">
            <SidebarNav />
            <div className="detail-inventory-content">
                <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="back_btn_inventory" 
                    onClick={() => navigate(-1)}
                    title="Quay lại"
                />
                <h1 className="detail-inventory-title">Chi Tiết Nguyên Liệu: {inventory.name}</h1>
                <div className="detail-inventory-info">
                    <p className="detail-inventory-item"><strong>Mã Nguyên Liệu:</strong> {inventory.inventoryId}</p>
                    <p className="detail-inventory-item"><strong>Đơn Vị:</strong> {inventory.unit}</p>
                    <p className="detail-inventory-item"><strong>Số Lượng Tồn:</strong> {inventory.stockQuantity.toLocaleString()} {inventory.unit}</p>
                </div>

                <h3 className="detail-inventory-subtitle">Bộ Lọc:</h3>
                <div className="filter-container">
                    <input
                        type="date"
                        className="filter-input"
                        onChange={handleDateChange}
                        value={dateFilter}
                        min="2020-01-01"
                        max={today} // Sử dụng biến today ở đây
                    />
                    <input
                        type="number"
                        className="filter-input_price"
                        placeholder="Giá nhập (VND)"
                        onChange={handlePriceChange}
                        value={priceFilter}
                    />
                    <button className="filter-button_inventory" onClick={applyFilters}>Lọc</button>
                </div>

                <h3 className="detail-inventory-subtitle">Ngày Nhập, Giá và Số Lượng Nhập:</h3>
                <table className="detail-inventory-table">
                    <thead>
                        <tr>
                            <th>Số Thứ Tự</th>
                            <th>Ngày Nhập</th>
                            <th>Giá (VND)</th>
                            <th>Số Lượng Nhập</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredImports.map((entry, index) => (
                            <tr key={entry._id}>
                                <td>{index + 1}</td>
                                <td>{new Date(entry.date).toLocaleDateString()}</td>
                                <td>{entry.price.toLocaleString()} VND</td>
                                <td>{entry.quantity.toLocaleString()} {inventory.unit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {errorMessage && (
                <ToastNotification
                    message={errorMessage}
                    onClose={handleCloseToast}
                    type="error"
                />
            )}
        </div>
    );
};

export default DetailInventory;
