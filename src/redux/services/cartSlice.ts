import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/api";
import { prepareHeaders } from "../prepareHeader/preapareHeader";

export const cartSlice = createApi({
  reducerPath: "cartSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + "/cart",
    credentials: "include",
    prepareHeaders,
  }),
  tagTypes: ["cart"],
  endpoints: (builder) => ({
    getMyCart: builder.query({
      query: () => "/",
      transformResponse: (response: any) => response?.data,
      providesTags: ["cart"],
    }),

    addToCart: builder.mutation({
      query: (body) => ({
        url: "/add-product",
        method: "POST",
        body,
      }),
      invalidatesTags: ["cart"],
    }),

    updateCart: builder.mutation({
      query: (body) => ({
        url: "/update-product",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["cart"],
    }),

    deleteFromCart: builder.mutation({
      query: (id) => ({
        url: `/delete-product/${id}`,
        method: "DELETE",
        params: { id },
      }),
      invalidatesTags: ["cart"],
    }),
  }),
});

export const {
  useGetMyCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useDeleteFromCartMutation,
} = cartSlice;
