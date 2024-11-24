// Components/ConfirmDialog.jsx
import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirm-dialog" onClick={onCancel}> {/* Thêm onClick cho phần nền */}
            <div className="confirm-dialog-content" onClick={(e) => e.stopPropagation()}> {/* Ngăn chặn sự kiện click từ truyền sang phần nền */}
                <h2>Xác Nhận</h2>
                <p>{message}</p>
                <div className="confirm-dialog-actions">
                    <button className="confirm-button" onClick={onConfirm}>Đồng Ý</button>
                    <button className="cancel-button" onClick={onCancel}>Hủy</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
