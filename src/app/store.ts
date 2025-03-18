import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import emailUserReducer from "../features/emailUserSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    emailUser: emailUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;