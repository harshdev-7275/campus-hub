import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./src/slices/authSlice";
import themeReducer from "./src/slices/themeSlice";
import loadingReducer from "./src/slices/loadingSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    loading:loadingReducer
  },
});
