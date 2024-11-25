import axios from "axios";
import { logOutFailure, logOutStart, logOutSuccess, loginFailure, loginStart, loginSuccess, registerFailure, registerStart, registerSuccess } from "./authSlice";
import{deleteUserStart, deleteUserSuccess, deleteUserFailed, getUsersStart, getUsersSuccess, getUsersFailed} from "./userSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("/v1/auth/login", user);
        dispatch(loginSuccess(res.data)); // Lưu thông tin người dùng vào Redux
        return res.data; // Trả về dữ liệu người dùng để kiểm tra quyền
    } catch (err) {
        dispatch(loginFailure());
        // Kiểm tra lỗi từ server
        if (err.response && err.response.data) {
            throw new Error(JSON.stringify(err.response.data)); // Ném lỗi dưới dạng đối tượng Error
        } else {
            throw new Error("Lỗi không xác định. Vui lòng thử lại sau.");
        }
    }
};

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        await axios.post("/v1/auth/register", user);
        dispatch(registerSuccess());
        navigate("/login");
    } catch (err) {
        dispatch(registerFailure());
        // Kiểm tra lỗi từ server
        if (err.response && err.response.data) {
            throw new Error(JSON.stringify(err.response.data)); // Ném lỗi dưới dạng đối tượng Error
        } else {
            throw new Error("Lỗi không xác định. Vui lòng thử lại sau.");
        }
    }
};

export const getAllUsers = async(accessToken, dispatch, axiosJWT)=>{
    dispatch(getUsersStart());
    try {
        const res = await axiosJWT.get("/v1/user", {
            headers:{token: `Bearer ${accessToken}`},
        });
        dispatch(getUsersSuccess(res.data));
    } catch (err) {
        dispatch(getUsersFailed());
    }
};
export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteUserStart());
    try {
      const res = await axiosJWT.delete(`/v1/user/${id}`, {
        headers: { token: `Bearer ${accessToken}` },
      });
      dispatch(deleteUserSuccess(res.data.deletedUserId));
      return res.data; 
    } catch (err) {
      console.error("Delete user error:", err);
      const errorMsg = err.response?.data?.message || "An error occurred while deleting the user.";
      dispatch(deleteUserFailed(errorMsg));
      throw err; 
    }
  };

  export const logOut = async(dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logOutStart());
    try {
        // Gửi yêu cầu logout đến API
        await axiosJWT.post("/v1/auth/logout", id, {
            headers: { token: `Bearer ${accessToken}` }
        });

        // Xóa cookie chứa token
        document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        // Dispatch logout success
        dispatch(logOutSuccess());

        // Chuyển hướng tới trang đăng nhập
        navigate("/login");
    } catch (err) {
        dispatch(logOutFailure());
    }
};