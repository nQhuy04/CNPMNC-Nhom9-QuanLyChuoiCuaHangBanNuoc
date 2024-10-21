
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../redux/apiRequest.js";
import { createAxios } from "../../createInstance";
import { logOutSuccess } from "../../redux/authSlice";

const NavBar = () => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const id = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, logOutSuccess);

  const handleLogout = () => {
    logOut(dispatch, id, navigate, accessToken, axiosJWT);
  };

  return (
    <nav className="navbar-container">
      {user ? (
        <>
          <p className="navbar-user">Hi, <span>{user.username}</span></p>
          <div className="navbar-links">
            <Link to="/logout" className="navbar-logout" onClick={handleLogout}>Log out</Link>
          </div>
        </>
      ) : (
        <div className="navbar-links">
          <Link to="/login" className="navbar-login">Đăng nhập</Link>
          <Link to="/register" className="navbar-register">Đăng ký</Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
