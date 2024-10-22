import "./App.css";
import UserManagement from "./Components/UserManagement/UserManagement"; // Đảm bảo đường dẫn chính xác
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import NavBar from "./Components/NavBar/NavBar";
import Dashboard from "./Components/Dashboard/Dashboard";
import ProductManagement from "./Components/ProductManagement/ProductManagement";
import AddProduct from "./Components/ProductManagement/AddProduct";
import EditProduct from "./Components/ProductManagement/EditProduct";
import DetailProduct from "./Components/ProductManagement/DetailProduct";
import OrderManagement from "./Components/OrderManagement/OrderManagement";
import OrderDetail from "./Components/OrderManagement/OrderDetail";
import IngredientManagement from "./Components/IngredientManagement/IngredientManagement";
import AddIngredient from "./Components/IngredientManagement/AddIngredient";
import EditIngredient from "./Components/IngredientManagement/EditIngredient"; 



function App() {
  return (
    <Router>  
      <NavBar />
      <div className="App"> 
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Route Quản lý người dùng */}
          <Route path="/usermanagement" element={<UserManagement />} />
  
          {/* Route Quản lý đăng nhập, đăng ký */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Route Quản lý sản phẩm */}
          <Route path="/productmanagement" element={<ProductManagement />} />
          <Route path="/add-product" element={<AddProduct />} /> 
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/detail-product/:id" element={<DetailProduct />} />

          {/* Route Quản lý đơn hàng */}
          <Route path="/ordermanagement" element={<OrderManagement />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />


          <Route path="/ingredientmanagement" element={<IngredientManagement />} />
          <Route path="/ingredients-add" element={<AddIngredient/>} />
          <Route path="/ingredients-edit/:id" element={<EditIngredient />} /> 
        </Routes>
      </div>  
    </Router>
  );
}

export default App;
