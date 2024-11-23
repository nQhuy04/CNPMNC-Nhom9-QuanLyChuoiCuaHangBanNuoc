import axios from 'axios';
import { useState, useEffect } from 'react';
import SidebarNav from '../SidebarNav/SidebarNav';
import './EditProduct.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState('');
    const [ingredients, setIngredients] = useState([{ id: '', quantity: '', unit: '' }]);
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await axios.get(`http://localhost:8000/v1/products/${id}`);
                const categoriesResponse = await axios.get('http://localhost:8000/v1/categories');
                const ingredientsResponse = await axios.get('http://localhost:8000/v1/inventory');
        
                setProductName(productResponse.data.name);
                setPrice(productResponse.data.price);
                setDescription(productResponse.data.description);
                setCategoryId(productResponse.data.categoryId._id);
                setImageName(productResponse.data.image.split('/').pop());
    
                setAvailableIngredients(ingredientsResponse.data);
                setCategories(categoriesResponse.data);
    
                const loadedIngredients = productResponse.data.ingredients.map(ing => {
                    const matchingIngredient = ingredientsResponse.data.find(
                        availableIng => availableIng.name === ing.name
                    );
                    return {
                        id: matchingIngredient ? matchingIngredient._id : undefined,
                        unit: ing.unit,
                        quantity: ing.quantity
                    };
                });
    
                setIngredients(loadedIngredients);
                console.log("Ingredients from API:", productResponse.data.ingredients); 
                console.log("Loaded Ingredients:", loadedIngredients); 
    
            } catch (error) {
                setError('Lỗi khi tải dữ liệu sản phẩm hoặc danh mục.');
                console.error("Fetch Data Error:", error);
            }
        };
        fetchData();
    }, [id]);

    const handleIngredientChange = (index, value) => {
        const newIngredients = [...ingredients];
        const selectedIngredient = availableIngredients.find(ing => ing._id === value);
        newIngredients[index].id = value;
        newIngredients[index].unit = selectedIngredient ? selectedIngredient.unit : ''; 
        setIngredients(newIngredients);
        console.log("Updated Ingredients:", newIngredients);
    };

    const handleQuantityChange = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index].quantity = value;
        setIngredients(newIngredients);
        console.log("Updated Ingredients with Quantity:", newIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { id: '', quantity: '', unit: '' }]);
    };

    const removeIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        setImageName(e.target.files[0] ? e.target.files[0].name : '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productNameRegex = /^[\p{L}\p{M}0-9 ]+$/u; 
        if (!productNameRegex.test(productName)) {
            setError('Tên sản phẩm không được chứa ký tự đặc biệt.');
            return;
        }

        if (isNaN(price) || price <= 0 || price > 1000000) {
            setError('Giá phải là một số dương và tối đa là 1 triệu.');
            return;
        }

        if (description.length > 500) {
            setError('Mô tả không được quá 500 ký tự.');
            return;
        }

        const formData = new FormData();
        formData.append('name', productName);
        formData.append('price', Number(price));
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }
        formData.append('categoryId', categoryId);

        for (let i = 0; i < ingredients.length; i++) {
            const ing = ingredients[i];
            if (!ing.id || isNaN(ing.quantity) || ing.quantity <= 0) {
                setError('Một trong các nguyên liệu không hợp lệ (cần có ID và số lượng dương).');
                return;
            }
            formData.append(`ingredients[${i}][inventoryId]`, ing.id);
            formData.append(`ingredients[${i}][quantity]`, Number(ing.quantity));
        }

        try {
            const response = await axios.put(`http://localhost:8000/v1/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccessMessage('Sản phẩm đã được sửa thành công!');
            navigate('/product');
        } catch (error) {
            console.error("Error updating product:", error);
            setError('Lỗi khi sửa sản phẩm. Vui lòng thử lại.');
        }
    };

    return (
        <div className="container_div">
            <SidebarNav />
            <div className="edit-product-container">
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="back_btn_EditProduct"
                    onClick={() => navigate(-1)}
                    title="Quay lại"
                />
                <h2 className="edit-product-header">Sửa Sản Phẩm</h2>
                {error && <div className="error-message-product">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <form onSubmit={handleSubmit} className="edit-product-form">
                    <div className="form-group">
                        <label>Tên sản phẩm:</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label>Giá:</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label>Mô tả:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            maxLength="500"
                            className="textarea-field"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Hình ảnh:</label>
                        <div className="file-input-container">
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="file-input"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="file-label">Ảnh đang chọn</label>
                            {imageName && <div className="file-name-display">{imageName}</div>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Danh mục:</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                            className="input-field"
                        >
                            <option value="" disabled>Chọn danh mục</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <h3>Công thức</h3>
                    <button type="button" onClick={addIngredient} className="add-ingredient-button">Thêm nguyên liệu</button>
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="ingredient-group">
                            <select
                                value={ingredient.id}
                                onChange={(e) => handleIngredientChange(index, e.target.value)}
                                className="ingredient-select"
                                required
                            >
                                <option value="" disabled>Chọn nguyên liệu</option>
                                {availableIngredients.map(ing => (
                                    <option key={ing._id} value={ing._id}>{ing.name}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Số lượng"
                                value={ingredient.quantity}
                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                required
                                className="quantity-input"
                            />
                            <span>{ingredient.unit}</span>
                            <button type="button" onClick={() => removeIngredient(index)} className="remove-ingredient-button">Xóa</button>
                        </div>
                    ))}
                    <button type="submit" className="submit-button">Lưu thay đổi</button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
