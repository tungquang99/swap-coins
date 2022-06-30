import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from './../api/apiRequest';
import { loginStart } from './authSlice';
// export const loginAuth = createAsyncThunk(
//     'auth/loginUser',
//     async(payload, thunkAPI) => {
//     }
// )