import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUserData: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    removeUserData: (state) => {
      state.user = null;
      localStorage.removeItem("userData");
    },
  },
});

export const { addUserData, removeUserData } = userSlice.actions;
export default userSlice.reducer;
