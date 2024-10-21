import "./App.css";
import UserManagement from "./Components/UserManagement/UserManagement"; // Đảm bảo đường dẫn chính xác
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SidebarNav from "./Components/SidebarNav/SidebarNav";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import NavBar from "./Components/NavBar/NavBar";
import Dashboard from "./Components/Dashboard/Dashboard";
import ProductManagement from "./Components/ProductManagement/ProductManagement";
import AddProduct from "./Components/ProductManagement/AddProduct";
import EditProduct from "./Components/ProductManagement/EditProduct";
import DetailProduct from "./Components/ProductManagement/DetailProduct";






function App() {
  return (
    <Router>  
      <NavBar />
      <div className="container_App">
      <SidebarNav/>
      <div className="App"> 
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/usermanagement" element={<UserManagement />} />
          <Route path="/productmanagement" element={<ProductManagement />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-product" element={<AddProduct />} /> 
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/detail-product/:id" element={<DetailProduct />} />
        </Routes>
      </div>
      </div>   
    </Router>
  );
}

export default App;
