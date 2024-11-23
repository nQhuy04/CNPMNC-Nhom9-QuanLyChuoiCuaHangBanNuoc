import React, { useState, useEffect } from 'react';
import SidebarNav from '../SidebarNav/SidebarNav'; // Import SidebarNav
import { Link } from 'react-router-dom';
import './ReportManagement.css';
import axios from 'axios';
import { FaChartLine, FaBoxOpen, FaTag } from 'react-icons/fa'; // Icons for the cards

const ReportManagement = () => {
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi

  // Fetch top customers khi trang được load
  useEffect(() => {
    const fetchTopCustomers = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/v1/report/top-customers');
        setTopCustomers(data);
      } catch (error) {
        setError('Có lỗi khi tải dữ liệu khách hàng.');
        console.error('Error fetching top customers:', error);
      } finally {
        setLoading(false); // Đảm bảo loading sẽ được tắt sau khi có kết quả
      }
    };
    fetchTopCustomers();
  }, []);

  return (
    <div className="container_div">
      <SidebarNav /> {/* Add SidebarNav here */}
      
      <div className="main-content">
        <h2 className="page-title">Báo Cáo Quản Lý</h2>
        
        <div className="report-cards">
          {/* Doanh Thu Card */}
          <Link to="/revenue" className="report-card revenue-card">
            <div className="card-content">
              <FaChartLine className="card-icon" />
              <h3 className="card-title">Doanh Thu</h3>
              <p className="card-description">Xem báo cáo doanh thu hôm nay.</p>
            </div>
          </Link>

          {/* Tồn Kho Card */}
          <Link to="/inventoryreport" className="report-card inventory-card">
            <div className="card-content">
              <FaBoxOpen className="card-icon" />
              <h3 className="card-title">Tồn Kho Thấp</h3>
              <p className="card-description">Xem báo cáo tồn kho thấp.</p>
            </div>
          </Link>

          {/* Sản Phẩm Bán Chạy Card */}
          <Link to="/best-selling" className="report-card best-selling-card">
            <div className="card-content">
              <FaTag className="card-icon" />
              <h3 className="card-title">Sản Phẩm Bán Chạy</h3>
              <p className="card-description">Xem báo cáo sản phẩm bán chạy.</p>
            </div>
          </Link>
        </div>

        {/* Bảng Top Khách Hàng */}
        <div className="top-customers-table">
          <h3 className="table-title">Top 10 Khách Hàng Tiềm Năng</h3>
          
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID Khách Hàng</th>
                  <th>Tên Khách Hàng</th>
                  <th>Email</th>
                  <th>Tổng Chi Tiêu (VND)</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => (
                  <tr key={index}>
                    <td>{customer.idCustomer}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.totalSpend ? customer.totalSpend.toLocaleString() : 'Chưa có dữ liệu'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportManagement;
