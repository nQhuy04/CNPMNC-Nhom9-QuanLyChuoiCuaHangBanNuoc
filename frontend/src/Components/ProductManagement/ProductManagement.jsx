import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SidebarNav from '../SidebarNav/SidebarNav';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import ToastNotification from '../ToastNotification/ToastNotification';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai'; // Import new icons
import './ProductManagement.css'; // Import file CSS

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of products per page

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/v1/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching product list:', error);
      showToast('Lỗi khi tải dữ liệu.', 'error');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleDelete = async () => {
    if (productIdToDelete) {
      try {
        const response = await axios.delete(`http://localhost:8000/v1/products/${productIdToDelete}`);
        if (response.status === 200) {
          showToast('Xóa thành công!', 'success');
          fetchProducts();
        } else {
          showToast('Lỗi khi xóa sản phẩm.', 'error');
        }
      } catch (error) {
        // Kiểm tra lỗi từ phản hồi server
        const errorMessage = error.response?.data?.message || 'Lỗi khi xóa sản phẩm.';
        showToast(errorMessage, 'error');
      } finally {
        setShowConfirmDialog(false);
        setProductIdToDelete(null);
      }
    }
  };
  

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="container_div">
      <SidebarNav />
      <div className="product-management-content">
        <h1 className="product-management-title">Quản Lý Sản Phẩm</h1>
        <div className="product-actions">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            className="product-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/product/add" className="product-add-button">
            Thêm Sản Phẩm
          </Link>
        </div>

        <div className="table-wrapper">
          <table className="product-table">
            <thead className="product-thead">
              <tr>
                <th>STT</th>
                <th>ID Sản Phẩm</th>
                <th>Hình Ảnh</th>
                <th>Tên Sản Phẩm</th>
                <th>Giá (VND)</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody className="product-tbody">
              {currentItems.map((product, index) => (
                <tr key={product.productId} className="product-row">
                  <td>{index + 1}</td> {/* Serial Number */}
                  <td>{product.productId}</td> {/* Product ID */}
                  <td>
                    <img src={product.image} alt={product.name} className="product-image" />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.price.toLocaleString()} VND</td>
                  <td>
                    <div className="product-action-buttons">
                      <Link to={`/product/detail/${product.productId}`} className="product-detail-button">
                        <AiOutlineEye size={20} />
                      </Link>
                      <Link to={`/product/edit/${product.productId}`} className="product-edit-button">
                        <AiOutlineEdit size={20} />
                      </Link>
                      <button
                        onClick={() => {
                          setShowConfirmDialog(true);
                          setProductIdToDelete(product.productId);
                        }}
                        className="product-delete-button"
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {showConfirmDialog && (
        <ConfirmDialog
          message="Bạn có chắc chắn muốn xóa sản phẩm này không?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}

      {toast.visible && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
      )}
    </div>
  );
};

export default ProductManagement;
