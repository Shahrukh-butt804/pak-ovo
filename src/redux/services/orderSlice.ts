import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/api";
import { prepareHeaders } from "../prepareHeader/preapareHeader";

export const orderSlice = createApi({
  reducerPath: "orderSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + "/order",
    credentials: "include",
    prepareHeaders,
  }),
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: ({ page, limit, keyword }) => ({
        url: "/get-all-orders",
        method: "GET",
        params: {
          page,
          limit,
          keyword,
        },
      }),
    }),
    getMyOrders: builder.query({
      query: ({ page, limit, keyword }) => ({
        url: "/my-orders",
        method: "GET",
        params: {
          page,
          limit,
          keyword,
        },
      }),
    }),
    getOrderById: builder.query({
      query: (id) => `/order-by-id/${id}`,
      transformResponse: (response: any) => response?.data,
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update-order-status/${id}`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = orderSlice;
