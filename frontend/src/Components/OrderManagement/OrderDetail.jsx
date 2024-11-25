import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SidebarNav from '../SidebarNav/SidebarNav'; // Import SidebarNav
import './OrderDetail.css';
import { useNavigate } from 'react-router-dom';
import ToastNotification from '../ToastNotification/ToastNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/v1/order/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };
    fetchOrderDetail();
  }, [id]);

  if (!order) return <div className="loading">Loading...</div>;

  return (
    <div className="container_div">
      <SidebarNav />
      <div className="order-detail-container">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="back-btn_order-detail"
          onClick={() => navigate(-1)}
          title="Quay lại"
        />
        <h1 className="order-detail-title">Chi Tiết Đơn Hàng: {order.orderId}</h1>

        <table className="order-info-table">
          <tbody>
            <tr>
              <th>Khách hàng:</th>
              <td>{order.customerName || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <th>Ngày đặt hàng:</th>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <th>Tổng tiền:</th>
              <td>{order.totalAmount.toLocaleString()} VND</td>
            </tr>
            <tr>
              <th>Phương thức thanh toán:</th>
              <td>{order.paymentMethod || 'Không có thông tin'}</td>
            </tr>
          </tbody>
        </table>

        <h2 className="order-detail-subtitle">Danh sách sản phẩm</h2>
        <table className="order-items-table">
          <thead>
            <tr>
              <th>Tên Sản Phẩm</th>
              <th>Số Lượng</th>
              <th>Đơn Giá (VND)</th>
              <th>Thành Tiền (VND)</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productName}> {/* Dùng productName làm key vì mỗi sản phẩm sẽ có tên riêng */}
                <td>{item.productName || 'Sản phẩm không tồn tại'}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toLocaleString() || '0'}</td>
                <td>{(item.quantity * item.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="order-total">
          <strong>Tổng cộng:</strong> {order.totalAmount.toLocaleString()} VND
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
