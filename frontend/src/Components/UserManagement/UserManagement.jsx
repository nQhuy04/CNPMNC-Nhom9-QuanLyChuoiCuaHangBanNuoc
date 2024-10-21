import { useEffect } from "react";
import "./userManagement.css";
import { deleteUser, getAllUsers } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import { createAxios } from "../../createInstance";

const UserManagement = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers);
  const msg = useSelector((state) => state.users?.msg);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(user?.accessToken, dispatch, id, axiosJWT);
        // Refresh the user list after successful deletion
        getAllUsers(user?.accessToken, dispatch, axiosJWT);
      } catch (error) {
        console.error("Failed to delete user:", error);
        // Optionally, show an error message to the user
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
              Xóa
            </div>
          </div>
        ))}
      </div>
      {msg && <div className="errorMsg">{msg}</div>}
    </main>
  );
};

export default UserManagement;
