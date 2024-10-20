// Dashboard.jsx
import { useEffect } from "react";
import React from 'react';
import './dashboard.css';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } 
  });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Chào mừng bạn đến với trang quản lý</h1>
      </header>
      <div className="dashboard-content">
        <div className="card">
          <h2>Tổng số người dùng</h2>
          <p>1200</p>
        </div>
        <div className="card">
          <h2>Tổng số sản phẩm</h2>
          <p>350</p>
        </div>
        <div className="card">
          <h2>Tổng doanh thu</h2>
          <p>$10,000</p>
        </div>
        <div className="card">
          <h2>Đơn hàng hôm nay</h2>
          <p>45</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
