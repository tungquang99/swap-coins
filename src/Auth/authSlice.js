import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user: {
        token: 'response.accessToken',
        profile: {},
        tokenId: 'response.tokenId'
    },
    loading: false,
    error: ''
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state, action) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.loading = false
            state.user = action.payload.user;
            localStorage.setItem('token', JSON.stringify(state.user.token));
            localStorage.setItem('user', JSON.stringify(state.user.profile));
        },
        loginError: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },
        logout: (state) => {
            state = initialState;
            localStorage.clear();
        }
    }, 
    // extraReducers: (
    //     builder => {
    //         builder
    //             .addMatcher(
    //                 (action) => {
    //                     return action.type.startsWith('auth/') && 
    //                         action.type.endsWith('/pending')
    //                 },
    //                 (state, action) => {
    //                 state.loading = true;
    //                 }
    //             )
    //             .addMatcher(
    //                 (action) => {
    //                     return action.type.startsWith('auth/') &&
    //                         action.type.endsWith('fulfilled')
    //                 },
    //                 (state, action) => {
    //                     state.loading = false;
    //                     state.email = action.playload;
    //                 }
    //             )
    //             .addMatcher(
    //                 (action) => {
    //                     return action.type.startsWith('auth/') &&
    //                     action.type.endsWith('/rejected')
    //                 },
    //                 (state, action) => {
    //                     state.loading = true;
    //                     state.error = action.playload
    //                 }
    //             )
    //     }
    // )
});

export const { loginStart, loginSuccess, loginError, logout } = authSlice.actions;

export default authSlice.reducer;