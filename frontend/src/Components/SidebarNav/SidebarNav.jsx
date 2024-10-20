
import React from 'react';
import './sidebarnav.css';
import { Link } from 'react-router-dom';

const SidebarNav = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">📊 Bảng điều khiển</Link>
        </li>
        <li>
          <Link to="/usermanagement">👥 Quản Lý Người Dùng</Link>
        </li>
        <li>
          <Link to="/productmanagement">☕ Quản lý sản phẩm</Link>
        </li>
        <li>
          <Link to="">🛒 Quản lý đơn hàng</Link>
        </li>
        <li>
          <Link to="">🍃 Quản lý nguyên liệu</Link>
        </li>
        <li>
          <Link to="">📦 Quản lý kho</Link>
        </li>
        <li>
          <Link to="">📈 Báo cáo</Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarNav;
