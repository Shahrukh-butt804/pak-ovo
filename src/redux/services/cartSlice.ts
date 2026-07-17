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
  endpoints: (builder) => ({
    getMyCart: builder.query({
      query: () => "/",
      transformResponse: (response: any) => response?.coupon,
    }),

    addToCart: builder.mutation({
      query: (body) => ({
        url: "/add-product",
        method: "POST",
        body,
      }),
    }),

    updateCart: builder.mutation({
      query: (body) => ({
        url: "update-product",
        method: "PUT",
        body,
      }),
    }),

    deleteFromCart: builder.mutation({
      query: (id) => ({
        url: `/update-product`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetMyCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useDeleteFromCartMutation,
} = cartSlice;
