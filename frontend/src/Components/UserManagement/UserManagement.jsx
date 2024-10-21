import { useEffect, useState } from "react";
import "./userManagement.css";
import { deleteUser, getAllUsers } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import { createAxios } from "../../createInstance";
import { FaUserCircle, FaTrash } from 'react-icons/fa';

const UserManagement = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const [deleteMessage, setDeleteMessage] = useState("");

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        const response = await deleteUser(user?.accessToken, dispatch, id, axiosJWT);
        console.log("Delete response:", response);
        if (response && response.success) {
          setDeleteMessage("Người dùng đã được xóa thành công");
          getAllUsers(user?.accessToken, dispatch, axiosJWT);
          setTimeout(() => setDeleteMessage(""), 3000);
        } else {
          setDeleteMessage("Xóa người dùng không thành công");
        }
      } catch (error) {
        console.error("Không thể xóa người dùng:", error);
        setDeleteMessage("Có lỗi xảy ra khi xóa người dùng");
      }
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user?.accessToken) {
      getAllUsers(user?.accessToken, dispatch, axiosJWT);
    }
  }, [user, dispatch, navigate, axiosJWT]);

  return (
    <main className="user-management-container">
      <h1 className="user-management-title">Quản Lý Người Dùng</h1>
      <div className="user-management-role">
        {`Vai trò của bạn: ${user?.isAdmin ? 'Quản trị viên' : 'Người dùng'}`}
      </div>
      {deleteMessage && <div className="delete-message">{deleteMessage}</div>}
      <div className="user-list">
        {userList?.map((user) => (
          <div className="user-card" key={user._id}>
            <FaUserCircle className="user-icon" />
            <div className="user-info">
              <h3 className="user-name">{user.username}</h3>
              <p className="user-email">{user.email}</p>
            </div>
            <button className="delete-user" onClick={() => handleDelete(user._id)}>
              <FaTrash /> Xóa
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default UserManagement;