import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../redux/apiRequest.js";
import { createAxios } from "../../createInstance";
import { logOutSuccess } from "../../redux/authSlice";
import { FaCoffee } from 'react-icons/fa';

const NavBar = () => {
  const user = useSelector((state) => state.auth.login.currentUser);
  console.log(user); // Kiểm tra xem user có giá trị đúng không
  const accessToken = user?.accessToken;
  const id = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, logOutSuccess);

  const handleLogout = () => {
    logOut(dispatch, id, navigate, accessToken, axiosJWT);
    navigate("/login");  // Chuyển hướng đến trang đăng nhập sau khi đăng xuất
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <FaCoffee className="coffee-icon" />
          <span>Coffee Shop</span>
        </Link>
        {user && (
          <p className="navbar-user">Hi, <span>{user.username}</span></p> // Hiển thị tên người dùng
        )}
      </div>
      <div className="navbar-right">
        {user ? (
          <button className="navbar-logout" onClick={handleLogout}>Đăng xuất</button>
        ) : (
          <>
            <Link to="/login" className="navbar-login">Đăng nhập</Link>
            <Link to="/register" className="navbar-register">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
