import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarNav from '../SidebarNav/SidebarNav';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';  
import { useNavigate } from 'react-router-dom'; 
import './BestSellingReport.css'; 
const BestSellingReport = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/v1/report/best-selling-products');
        setProducts(data);
        setFilteredProducts(data); // Gán dữ liệu ban đầu cho bảng
      } catch (error) {
        console.error('Error fetching best-selling products:', error);
      }
    };
    fetchBestSellingProducts();
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(value) || // Tìm theo tên sản phẩm
        product.productId.toLowerCase().includes(value) // Tìm theo mã sản phẩm
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="container_div">
      <SidebarNav /> {/* Sidebar Nav */}
      <div className="best-selling-report">
        {/* Icon quay lại */}
        <FontAwesomeIcon 
          icon={faArrowLeft} 
          className="back-btn" 
          onClick={() => navigate(-1)} 
          title="Quay lại" 
        />
        
        <h1 className="title">Báo cáo sản phẩm bán chạy</h1>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã sản phẩm"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>ID sản phẩm</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng bán</th>
              <th>Giá (VND)</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.productId}</td>
                <td>{product.productName}</td>
                <td>{product.quantitySold}</td>
                <td>{product.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BestSellingReport;
