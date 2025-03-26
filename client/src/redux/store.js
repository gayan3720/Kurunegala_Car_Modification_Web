import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import vehicleSlice from "./slices/vehicleSlice";
import { authApiSlice } from "./api_slices/authApiSlice";
import { vehicleApiSlice } from "./api_slices/vehicleApiSlice";
import { userApiSlice } from "./api_slices/userApiSlice";
import userSlice from "./slices/userSlice";

const store = configureStore({
  reducer: {
    auth: authSlice, // Use this if you want to persist additional auth state
    vehicle: vehicleSlice,
    user: userSlice,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [vehicleApiSlice.reducerPath]: vehicleApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApiSlice.middleware,
      vehicleApiSlice.middleware,
      userApiSlice.middleware
    ),
});

export default store;
