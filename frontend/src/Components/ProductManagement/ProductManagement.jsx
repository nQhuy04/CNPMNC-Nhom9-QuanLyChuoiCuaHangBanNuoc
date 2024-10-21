import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api\\/products', newProduct);
      console.log('Product added successfully:', response.data);
      setNewProduct({ name: '', description: '', price: '', image_url: '' });
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Không thể thêm sản phẩm. Vui lòng kiểm tra lại thông tin và thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Quản Lý Sản Phẩm</h1>

      <h2>Thêm Sản Phẩm Mới</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          placeholder="Tên sản phẩm"
          required
        />
        <input
          type="text"
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
          placeholder="Mô tả"
          required
        />
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          placeholder="Giá"
          required
        />
        <input
          type="text"
          name="image_url"
          value={newProduct.image_url}
          onChange={handleInputChange}
          placeholder="URL hình ảnh"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang thêm...' : 'Thêm Sản Phẩm'}
        </button>
      </form>

      <h2>Danh sách sản phẩm</h2>
      <ul>
        {products.map(product => (
          <li key={product._id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Giá: {product.price} VND</p>
            <img src={product.image_url} alt={product.name} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagement;