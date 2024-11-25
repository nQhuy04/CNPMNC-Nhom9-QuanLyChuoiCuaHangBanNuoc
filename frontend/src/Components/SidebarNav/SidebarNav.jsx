import React from 'react';
import './sidebarnav.css';
import { NavLink } from 'react-router-dom'; // Thay Link bằng NavLink để hỗ trợ active
import { FiHome, FiUser, FiUserPlus, FiBox, FiShoppingCart, FiPackage, FiDatabase, FiBarChart2 } from 'react-icons/fi';

const SidebarNav = () => {
  const menuItems = [
    { icon: <FiHome />, text: 'Bảng điều khiển', path: '/' },
    { icon: <FiUser />, text: 'Quản Lý Tài Khoản', path: '/usermanagement' },
    { icon: <FiUserPlus />, text: 'Quản lý khách hàng', path: '/customer' },
    { icon: <FiPackage />, text: 'Quản lý danh mục', path: '/category' },
    { icon: <FiBox />, text: 'Quản lý sản phẩm', path: '/product' },
    { icon: <FiShoppingCart />, text: 'Quản lý đơn hàng', path: '/order' },
    { icon: <FiDatabase />, text: 'Quản lý kho', path: '/inventory' },
    { icon: <FiBarChart2 />, text: 'Báo cáo', path: '/report' },
  ];

  return (
    <div className="sidebar">
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              activeClassName="active"  
              exact
            >
              {item.icon}
              <span>{item.text}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarNav;
