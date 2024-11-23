import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RevenueReport.css'; 
import SidebarNav from '../SidebarNav/SidebarNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate } from 'react-router-dom';

const RevenueReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [revenueData, setRevenueData] = useState([]);
  const navigate = useNavigate();

  const fetchRevenue = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/v1/report/revenue', {
        params: { startDate, endDate },
      });
      setRevenueData(data.revenueByDate);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  return (
    <div className="container_div">
      <SidebarNav/>
    <div className="revenue-report">
    <FontAwesomeIcon 
          icon={faArrowLeft} 
          className="back_btn_RevenueReport" 
          onClick={() => navigate(-1)}
          title="Quay lại"
        />
      <h1 className="title">Báo cáo doanh thu</h1>
      <div className="filter-container">
        <div className="filter">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
        </div>
        <div className="filter">
          <label>Đến ngày:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
        </div>
        <button className="filter-button" onClick={fetchRevenue}>
          Xem báo cáo
        </button>
      </div>
      <table className="revenue-table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Doanh thu (VND)</th>
          </tr>
        </thead>
        <tbody>
          {revenueData.map((item, index) => (
            <tr key={index}>
              <td>{item._id}</td>
              <td>{item.totalRevenue.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default RevenueReport;
