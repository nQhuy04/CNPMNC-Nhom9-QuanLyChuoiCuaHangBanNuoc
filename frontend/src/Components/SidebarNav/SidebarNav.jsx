import React from 'react';
import './sidebarnav.css';
import { Link } from 'react-router-dom';
import { FiHome, FiUsers, FiBox, FiShoppingCart, FiPackage, FiDatabase, FiBarChart2 } from 'react-icons/fi';

const SidebarNav = () => {
  const menuItems = [
    { icon: <FiHome />, text: 'Bảng điều khiển', path: '/' },
    { icon: <FiUsers />, text: 'Quản Lý Người Dùng', path: '/usermanagement' },
    { icon: <FiBox />, text: 'Quản lý sản phẩm', path: '/productmanagement' },
    { icon: <FiShoppingCart />, text: 'Quản lý đơn hàng', path: '/ordermanagement' },
    { icon: <FiPackage />, text: 'Quản lý nguyên liệu', path: '/ingredientmanagement' },
    { icon: <FiDatabase />, text: 'Quản lý kho', path: '/inventorymanagement' },
    { icon: <FiBarChart2 />, text: 'Báo cáo', path: '/reports' },
  ];

  return (
    <div className="sidebar">
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link to={item.path}>
              {item.icon}
              <span>{item.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarNav;