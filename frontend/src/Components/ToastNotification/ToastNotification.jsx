// Components/ToastNotification.jsx
import React, { useEffect, useState } from 'react';
import './ToastNotification.css';

const ToastNotification = ({ message, onClose, type }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Tự động ẩn thông báo sau 3 giây
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000); // Thời gian tồn tại của thông báo (3 giây)

        return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
    }, []);

    const handleClose = () => {
        setIsVisible(false); // Khi người dùng nhấn nút đóng
        onClose(); // Gọi hàm onClose từ props
    };

    return (
        <div className={`toast-notification ${type} ${!isVisible ? 'fade-out' : ''}`}>
            <span>{message}</span>
            <button className="close-button" onClick={handleClose}>×</button>
        </div>
    );
};

export default ToastNotification;
