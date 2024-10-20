import axios from "axios";
import { logOutFailure, logOutStart, logOutSuccess, loginFailure, loginStart, loginSuccess, registerFailure, registerStart, registerSuccess } from "./authSlice";
import{deleteUserStart, deleteUserSuccess, deleteUserFailed, getUsersStart, getUsersSuccess, getUsersFailed} from "./userSlice";

export const loginUser = async(user, dispatch, navigate) =>{
    dispatch(loginStart());
    try {
        const res = await axios.post("/v1/auth/login", user);
        dispatch(loginSuccess(res.data));
        navigate("/");
    } catch (err) {
        dispatch(loginFailure());
    }
};
export const registerUser = async (user, dispatch, navigate)=>{
    dispatch(registerStart());
    try {
        await axios.post("v1/auth/register", user);
        dispatch(registerSuccess());
        navigate("/login");
    } catch (err) {
        dispatch(registerFailure());
    }
}
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
        const res = await axiosJWT.delete("/v1/user/" + id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(deleteUserSuccess(res.data)); // Res data trả về từ server là msg
    } catch (err) {
        dispatch(deleteUserFailed(err.response?.data || "Đã xảy ra lỗi khi xóa người dùng"));
    }
};
export const logOut = async(dispatch, id, navigate, accessToken, axiosJWT)=>{
    dispatch(logOutStart());
    try {
        await axiosJWT.post("/v1/auth/logout",id,{
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(logOutSuccess());
        navigate("/login");
    } catch (err) {
        dispatch(logOutFailure());
    }
}