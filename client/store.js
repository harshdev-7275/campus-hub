import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./src/slices/authSlice";
import themeReducer from "./src/slices/themeSlice";
import loadingReducer from "./src/slices/loadingSlice";
import userReducer from "./src/slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    theme: themeReducer,
    loading: loadingReducer,
  },
});
