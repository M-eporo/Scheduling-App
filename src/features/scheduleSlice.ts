import { createSlice } from "@reduxjs/toolkit";
import { InitialSchedulesStateType } from "../types";

const initialState:  InitialSchedulesStateType= {
  schedules: [],
};

const scheduleSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    setSchedulesReducer: (state, action) => {
      state.schedules = action.payload;
    },
    addSchedulesReducer: (state, action) => {
      state.schedules.push(action.payload);
    }
  }
});

export default scheduleSlice.reducer;
export const { setSchedulesReducer, addSchedulesReducer } = scheduleSlice.actions;