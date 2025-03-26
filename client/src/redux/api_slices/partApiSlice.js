import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const partApiSlice = createApi({
  reducerPath: "partApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
  endpoints: (builder) => ({
    createPart: builder.mutation({
      query: (payload) => ({
        url: "parts",
        method: "POST",
        body: payload,
      }),
    }),
    // getPartsByBudget: ...
  }),
});

export const { useCreatePartMutation } = partApiSlice;
