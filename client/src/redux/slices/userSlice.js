import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userList: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserList: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
});

export const { setUserList } = userSlice.actions;
export const getUserList = (state) => state.user.user;
export default userSlice.reducer;
