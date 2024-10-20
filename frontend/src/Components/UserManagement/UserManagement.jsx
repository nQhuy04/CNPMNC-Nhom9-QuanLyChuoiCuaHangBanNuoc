import { useEffect, useState } from "react";
import "./userManagement.css";
import { deleteUser, getAllUsers } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import { createAxios } from "../../createInstance";

const UserManagement = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(null); // Xác nhận xóa
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const handleDelete = (id) => {
    // Xác nhận trước khi xóa
    if (confirmDelete === id) {
      deleteUser(user?.accessToken, dispatch, id, axiosJWT);
      setConfirmDelete(null); // Reset xác nhận sau khi xóa
    } else {
      setConfirmDelete(id); // Đặt ID cần xác nhận
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
    <main className="home-container">
      <div className="home-title">Danh Sách Người Dùng</div>
      <div className="home-role">
        {`Vai trò của bạn: ${user?.isAdmin ? `Quản trị viên` : `Người dùng`}`}
      </div>
      <div className="home-userlist">
        {userList?.map((user) => (
          <div className="user-container" key={user._id}>
            <div className="home-user">{user.username}</div>
            <div className="delete-user" onClick={() => handleDelete(user._id)}>
              {confirmDelete === user._id ? (
                <>
                  <span>Xác nhận xóa?</span>
                  <button onClick={() => handleDelete(user._id)}>Có</button>
                  <button onClick={() => setConfirmDelete(null)}>Không</button>
                </>
              ) : (
                "Xóa"
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default UserManagement;
