import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './ProductManagement.css';


const ProductManagement = () => {
<<<<<<< HEAD
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);
    const navigate = useNavigate(); 

    useEffect(() => {
        fetchProducts();
    }, []); 

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error.response?.data || error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await axios.delete(`http://localhost:8000/api/products/${id}`);               
                fetchProducts();
                
                
            } catch (error) {
                console.error('Error deleting product:', error.response?.data || error.message);
            }
        }
    };


    const handleView = (id) => {
        navigate(`/detail-product/${id}`);
    };

    
    const handleEdit = (id) => {
        navigate(`/edit-product/${id}`); // Điều hướng đến trang sửa sản phẩm
    };

    const handleAddProduct = () => {
        navigate('/add-product'); 
    };
    


    // Hàm lọc sản phẩm theo tên
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Xác định sản phẩm hiển thị trên trang hiện tại
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    
    return (
        <div className="product-management">
            <h1 className="product-management__title">Quản Lý Sản Phẩm</h1>
            <button className="product-management__add-button" onClick={handleAddProduct}>
                Thêm sản phẩm
            </button>
            <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="product-management__search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <h2 className="product-management__subtitle">Danh sách sản phẩm</h2>
            <div className="product-management__table-container">
                <table className="product-management__table">
                    <thead>
                        <tr>
                            <th className="product-management__table-header">Hình ảnh</th>
                            <th className="product-management__table-header">Tên sản phẩm</th>
                            <th className="product-management__table-header">Mô tả</th>
                            <th className="product-management__table-header">Giá (VND)</th>
                            <th className="product-management__table-header">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product) => (
                            <tr key={product._id} className="product-management__table-row">
                                <td className="product-management__table-cell">
                                    <img
                                        className="product-management__item-image"
                                        src={product.image_url}
                                        alt={product.name}
                                        style={{ width: '100px', height: 'auto' }}
                                    />
                                </td>
                                <td className="product-management__table-cell">{product.name}</td>
                                <td className="product-management__table-cell">{product.description}</td>
                                <td className="product-management__table-cell">{new Intl.NumberFormat().format(product.price)} VND</td>
                                <td className="product-management__table-cell">
                                    <button 
                                        className="product-management__edit-button" 
                                        onClick={() => handleEdit(product._id)}
                                    >
                                        Sửa
                                    </button>
                                    <button 
                                        className="product-management__delete-button" 
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        Xóa
                                    </button>
                                    <button  onClick={() => handleView(product._id)} className="product-management__view-button">Xem</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="product-management__pagination">
                {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
                    <button 
                        key={index + 1} 
                        onClick={() => paginate(index + 1)} 
                        className="product-management__pagination-button"
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
=======
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
>>>>>>> 44d9a4ea5dbf253f49618f1fdfdec7fe830160f5
};

export default ProductManagement;