import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import emailUserReducer from "../features/emailUserSlice";
import scheduleReducer from "../features/scheduleSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    emailUser: emailUserReducer,
    schedules: scheduleReducer
  }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;