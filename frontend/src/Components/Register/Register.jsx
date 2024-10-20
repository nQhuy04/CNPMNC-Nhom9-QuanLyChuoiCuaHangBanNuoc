import { useState } from "react";
import "./register.css";
import { registerUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        const newUser = {
            email,
            username,
            password,
        };
        registerUser(newUser, dispatch, navigate);
    };

    return ( 
        <section className="register-container">
            <div className="register-title">Đăng Ký Tài Khoản</div>
            <form onSubmit={handleRegister}>
                <label className="email_label">Email</label>
                <input type="email" placeholder="Nhập email của bạn" onChange={(e) => setEmail(e.target.value)} />
                <label className="username_label">Tên Đăng Nhập</label>
                <input type="text" placeholder="Nhập tên đăng nhập" onChange={(e) => setUsername(e.target.value)} />
                <label className="password_label">Mật Khẩu</label>
                <input type="password" placeholder="Nhập mật khẩu" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Tạo Tài Khoản</button>
            </form>
        </section>
    );
};

export default Register;
