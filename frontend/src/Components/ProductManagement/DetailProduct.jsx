import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SidebarNav from '../SidebarNav/SidebarNav'; // Import SidebarNav
import './DetailProduct.css'; // Import file CSS

const DetailProduct = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch thông tin sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/v1/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError('Lỗi khi tải thông tin sản phẩm.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  // Kiểm tra nếu product không có dữ liệu
  if (!product) return <div className="error">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="container_div">
      <SidebarNav />
      <div className="product-detail">
        <h1 className="product-title">{product.name}</h1>
        <div className="product-content">
          <img src={product.image} alt={product.name} className="product-image" />
          <div className="product-info">
            <p><strong>ID:</strong> {product.productId}</p>
            <p><strong>Giá:</strong> {product.price.toLocaleString()} VND</p>
            <p><strong>Mô Tả:</strong> {product.description || 'Không có mô tả.'}</p>
            <p><strong>Danh Mục:</strong> {product.categoryId ? product.categoryId.name : 'Không xác định'}</p>

            <h3>Nguyên Liệu:</h3>
            <ul className="ingredient-list">
              {product.ingredients && product.ingredients.length > 0 ? (
                product.ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    <strong>{ingredient.name || 'Không xác định'}</strong>: 
                    {ingredient.quantity} {ingredient.unit || 'Không xác định'}
                  </li>
                ))
              ) : (
                <li>Không có nguyên liệu được xác định.</li>
              )}
            </ul>

            <Link to="/product" className="back-button">Quay Lại</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
