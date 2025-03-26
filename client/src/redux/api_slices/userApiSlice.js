import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../utils/axiosBaseQuery";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    getAll: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    updateUser: builder.mutation({
      query: (credentials) => ({
        url: `/users/${credentials._id}`,
        method: "PUT",
        data: credentials,
      }),
      invalidatesTags: ["users"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/delete/${id.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const { useGetAllQuery, useDeleteUserMutation, useUpdateUserMutation } =
  userApiSlice;
