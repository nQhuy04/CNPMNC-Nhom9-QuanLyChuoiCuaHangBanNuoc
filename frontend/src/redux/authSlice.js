import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState:{
        login:{
            currentUser:null,
            isFetching: false,
            error: false
        },
        register:{
            isFetching: false,
            error: false,
            success: false
        }
    },
    reducers:{
        loginStart: (state)=>{
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) =>{
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailure: (state) =>{
            state.login.isFetching = false;
            state.login.error = true;
        },
        registerStart: (state)=>{
            state.register.isFetching = true;
        },
        registerSuccess: (state) =>{
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;
        },
        registerFailure: (state) =>{
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },
        logOutSuccess: (state) =>{
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = false;
        },
        logOutFailure: (state) =>{
            state.login.isFetching = false;
            state.login.error = true;
        },
        logOutStart: (state)=>{
            state.login.isFetching = true;
        }
    }
});
export const {
    loginStart,
    loginSuccess,
    loginFailure,
    registerStart,
    registerSuccess,
    registerFailure,
    logOutStart,
    logOutSuccess,
    logOutFailure
} = authSlice.actions;

export default authSlice.reducer;