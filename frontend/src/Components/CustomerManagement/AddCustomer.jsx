import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCustomer.css";
import SidebarNav from "../SidebarNav/SidebarNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Xử lý khi nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ràng buộc tên khách hàng không chứa ký tự đặc biệt và số
    if (name === "name") {
      // Kiểm tra ký tự đặc biệt và số
      if (/[<>?./~!@$%^&*()_+|\\=\[\]{};:'",<>0-9]/.test(value)) {
        setError("Tên khách hàng không được chứa ký tự đặc biệt và số.");
        return;
      }
    }

    // Ràng buộc số điện thoại chỉ chứa chữ số
    if (name === "phone" && !/^[0-9\b]+$/.test(value)) {
      setError("Số điện thoại chỉ chứa chữ số.");
      return;
    }

    setError(""); // Xóa lỗi khi nhập đúng
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Kiểm tra tính hợp lệ của form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Tên khách hàng không được để trống.");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Số điện thoại không được để trống.");
      return false;
    }
    if (!/^(\+84|0)\d{9,10}$/.test(formData.phone)) {
      setError("Số điện thoại không đúng định dạng.");
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email không hợp lệ.");
      return false;
    }
    if (!formData.address.trim()) {
      setError("Địa chỉ không được để trống.");
      return false;
    }
    return true;
  };

  // Gửi dữ liệu lên server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi
    setSuccessMessage(""); // Reset thông báo thành công

    // Kiểm tra tính hợp lệ của form
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:8000/v1/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Thêm khách hàng thành công!");
        navigate("/customer");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Có lỗi xảy ra.");
      }
    } catch (err) {
      console.error("Error adding customer:", err);
      setError("Không thể kết nối tới server.");
    }
  };

  return (
    <div className="container_div">
      <SidebarNav />
      <div className="add-customer-container">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="back-btn_category"
          onClick={() => navigate(-1)}
          title="Quay lại"
        />
        <h1>Thêm Khách Hàng Mới</h1>
        <form className="add-customer-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tên khách hàng</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Địa chỉ</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <div className="form-actions">
            <button type="submit" className="submit-button">
              Thêm Khách Hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
