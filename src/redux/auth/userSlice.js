import { createSlice } from "@reduxjs/toolkit";
import {
  getCurrentUser,
 
} from "./operation";

const initialState = {
  user: {},
  isLoggedIn: false,
  isRefreshing: false,
};

const userInfo = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.fulfilled, (state, { payload }) => {
        state.user = payload[0];
        state.isLoggedIn = true;
        state.isRefreshing = false;
      });
  },
});

export const userReducer = userInfo.reducer;
