import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shopApiSlice = createApi({
  reducerPath: "shopApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
  endpoints: (builder) => ({
    createShop: builder.mutation({
      query: (payload) => ({
        url: "shops",
        method: "POST",
        body: payload,
      }),
    }),
    // getNearbyShops: ...
  }),
});

export const { useCreateShopMutation } = shopApiSlice;
