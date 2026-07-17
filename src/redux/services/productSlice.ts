import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/api";
import { prepareHeaders } from "../prepareHeader/preapareHeader";

export const productSlice = createApi({
  reducerPath: "productSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + "/product",
    credentials: "include",
    prepareHeaders,
  }),
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: ({ page, limit, keyword, status, category, sortBy }) => ({
        url: "/",
        method: "GET",
        params: {
          page,
          limit,
          keyword,
          status,
          category,
          sortBy,
        },
      }),
      transformResponse: (response: any) => response?.data,
    }),
    getProductById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response: any) => response?.data,
    }),

    getProductBySlug: builder.query({
      query: (slug) => ({
        url: `/slug/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data ?? response,
    }),

    addProduct: builder.mutation({
      query: (body) => ({
        url: "/add",
        method: "POST",
        body,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productSlice;
