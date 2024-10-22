import { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const newUser = {
      username,
      password,
    };
    try {
      loginUser(newUser, dispatch, navigate);
    } catch (error) {
      if (error.response) {
        // Display the error message coming from the controller
        setMessage(error.response.data.message || "Đã xảy ra lỗi khi đăng nhập.");
      } else {
        setMessage("Lỗi kết nối đến máy chủ.");
      }
    }
  };

  return (
    <section className="login-container">
      <div className="login-title">Đăng Nhập</div>
      <form onSubmit={handleLogin}>
        <label className="login_name_label">Tên đăng nhập</label>
        <input
          type="text"
          placeholder="Nhập tên đăng nhập"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="login_pass_label">Mật khẩu</label>
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Đăng nhập</button>
      </form>
      {message && <p className="login-err">{message}</p>}
      <div className="login-register">
        Chưa có tài khoản?{" "}
        <Link className="login-register-link" to="/register">
          Đăng ký ngay
        </Link>
      </div>
    </section>
  );
};

export default Login;
