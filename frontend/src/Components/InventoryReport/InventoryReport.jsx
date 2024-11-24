import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InventoryReport.css';
import SidebarNav from '../SidebarNav/SidebarNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const InventoryReport = () => {
  const [lowInventory, setLowInventory] = useState([]);
  const [highInventory, setHighInventory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventoryExtremes = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/v1/report/inventory-extremes');
        setLowInventory(data.lowInventory);
        setHighInventory(data.highInventory);
      } catch (error) {
        console.error('Error fetching inventory extremes:', error);
      }
    };

    fetchInventoryExtremes();
  }, []);

  return (
    <div className="container_div">
      <SidebarNav />
      <div className="inventory-report">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="back_btn_InventoryReport"
          onClick={() => navigate(-1)}
          title="Quay lại"
        />
        <h1 className="title">Báo cáo tồn kho</h1>
        <div className="inventory-section">
          <h2 className="section-title">5 nguyên liệu tồn ít nhất</h2>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>ID Nguyên liệu</th>
                <th>Tên</th>
                <th>Đơn vị</th>
                <th>Số lượng</th>
                <th>Cập nhật lần cuối</th>
              </tr>
            </thead>
            <tbody>
              {lowInventory.map((item) => (
                <tr key={item.inventoryId}>
                  <td>{item.inventoryId}</td>
                  <td>{item.name}</td>
                  <td>{item.unit}</td>
                  <td>{item.stockQuantity}</td>
                  <td>{new Date(item.lastUpdated).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="inventory-section">
          <h2 className="section-title">5 nguyên liệu tồn nhiều nhất</h2>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>ID Nguyên liệu</th>
                <th>Tên</th>
                <th>Đơn vị</th>
                <th>Số lượng</th>
                <th>Cập nhật lần cuối</th>
              </tr>
            </thead>
            <tbody>
              {highInventory.map((item) => (
                <tr key={item.inventoryId}>
                  <td>{item.inventoryId}</td>
                  <td>{item.name}</td>
                  <td>{item.unit}</td>
                  <td>{item.stockQuantity}</td>
                  <td>{new Date(item.lastUpdated).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;
