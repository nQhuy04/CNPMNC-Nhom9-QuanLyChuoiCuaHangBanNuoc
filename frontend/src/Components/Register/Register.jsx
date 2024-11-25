import { useState } from "react";
import "./register.css";
import { registerUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({}); // Lưu lỗi của từng trường
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors

        const newUser = {
            email,
            username,
            password,
        };

        try {
            // Gọi API đăng ký
            await registerUser(newUser, dispatch, navigate);
        } catch (error) {
            // Kiểm tra lỗi và phân loại lỗi
            const errorMessage = error.response?.data || error.message || "Lỗi không xác định. Vui lòng thử lại.";
            // Đặt lỗi cho từng trường nếu có
            if (errorMessage.username) {
              setErrors({ username: errorMessage.username });
            } else if (errorMessage.password) {
              setErrors({ password: errorMessage.password });
            } else if(errorMessage.email){
                setErrors({email: errorMessage.email});
            } 
            else {
              setErrors({ general: errorMessage });
            }
          }
        };

    return (
        <section className="register-container">
            <div className="register-title">Đăng Ký Tài Khoản</div>
            <form onSubmit={handleRegister}>
                <label className="email_label">Email</label>
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="register-err">{errors.email}</p>}

                <label className="username_label">Tên Đăng Nhập</label>
                <input
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <p className="register-err">{errors.username}</p>}

                <label className="password_label">Mật Khẩu</label>
                <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="register-err">{errors.password}</p>}
                
                <button type="submit">Tạo Tài Khoản</button>
                {errors.general && <p className="register-err">{errors.general}</p>}
            </form>
            <div className="register-login">
                Đã có tài khoản?{" "}
                <Link className="register-login-link" to="/login">
                    Đăng nhập ngay
                </Link>
            </div>
        </section>
    );
};

export default Register;