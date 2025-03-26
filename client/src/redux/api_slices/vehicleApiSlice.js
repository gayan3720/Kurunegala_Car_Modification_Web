import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../utils/axiosBaseQuery";

export const vehicleApiSlice = createApi({
  reducerPath: "vehicleApi",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
  }),
  prepareHeaders: (headers, { getState }) => {
    // Retrieve the token from local storage (or you could also use getState if stored in Redux)
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  endpoints: (builder) => ({
    recognizeVehicle: builder.mutation({
      query: (formData) => ({
        url: "/vehicles/recognize",
        method: "POST",
        data: formData,
      }),
    }),
  }),
});

export const { useRecognizeVehicleMutation } = vehicleApiSlice;
