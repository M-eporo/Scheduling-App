import { createSlice } from "@reduxjs/toolkit";
import { InitialEmailUserState } from "../types";

const initialState: InitialEmailUserState = {
  emailUser: null
};

const emailUserSlice = createSlice({
  name: "emailUser",
  initialState,
  reducers: {
    emailLogin: (state, action) => {
      state.emailUser = action.payload
    },
    emailLogout: (state) => {
      state.emailUser = null;
    },
    getUserInfo: (state, action) => {
      if (state.emailUser) {
        state.emailUser.displayName = action.payload.displayName;
        state.emailUser.name = action.payload.name;
        state.emailUser.emailVerified = action.payload.emailVerified
      }
    }
  }
});

export default emailUserSlice.reducer;
export const { emailLogin, emailLogout, getUserInfo } = emailUserSlice.actions;
