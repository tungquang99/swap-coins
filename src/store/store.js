import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Auth/authSlice";

const store = configureStore({
    reducer: {
        authState: authSlice,
    }
});

export default store;