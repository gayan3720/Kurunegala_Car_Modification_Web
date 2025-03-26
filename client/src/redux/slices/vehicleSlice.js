import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vehicle: null,
};

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    setVehicle: (state, action) => {
      state.vehicle = action.payload;
    },
    clearVehicle: (state) => {
      state.vehicle = null;
    },
  },
});

export const { setCredentials, logout } = vehicleSlice.actions;
export const getVehicle = (state) => state.vehicle.user;
export default vehicleSlice.reducer;
