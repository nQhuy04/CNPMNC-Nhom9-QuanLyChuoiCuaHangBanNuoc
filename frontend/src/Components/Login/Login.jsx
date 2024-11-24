import { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset lỗi trước khi gửi yêu cầu

    const newUser = {
      username,
      password,
    };

    try {
      const user = await loginUser(newUser, dispatch, navigate);

      // Phân quyền
      if (user.isAdmin) {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      const errorMessage = error.response?.data || error.message || "Lỗi không xác định. Vui lòng thử lại.";

      const newErrors = {};

      // Nếu có lỗi tên đăng nhập
      if (errorMessage.username) {
        newErrors.username = errorMessage.username;
      }

      // Nếu có lỗi mật khẩu
      if (errorMessage.password) {
        newErrors.password = errorMessage.password;
      }

      // Nếu có lỗi chung
      if (!errorMessage.username && !errorMessage.password) {
        newErrors.general = errorMessage;
      }

      setErrors(newErrors); // Cập nhật lỗi vào state
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* Hiển thị lỗi dưới input username nếu có */}
        {errors.username && <p className="login-err">{errors.username}</p>}

        <label className="login_pass_label">Mật khẩu</label>
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Hiển thị lỗi dưới input mật khẩu nếu có */}
        {errors.password && <p className="login-err">{errors.password}</p>}

        <button type="submit">Đăng nhập</button>

        {/* Hiển thị lỗi chung nếu có */}
        {errors.general && <p className="login-err">{errors.general}</p>}
      </form>
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
