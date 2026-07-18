import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/api";
import { prepareHeaders } from "../prepareHeader/preapareHeader";

export const categorySlice = createApi({
  reducerPath: "categorySlice",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + "/category",
    credentials: "include",
    prepareHeaders,
  }),
  endpoints: (builder) => ({

    getAllCategories: builder.query({
      query: ({ page, limit, keyword }) => ({
        url: "/",
        method: "GET",
        params: {
          page,
          limit,
          keyword,
        },
      }),
      transformResponse: (response: any) => response?.data,
    }),

    getAllCategoriesWithSubCategories: builder.query({
      query: ({ page, limit, keyword }) => ({
        url: "/with-subcategories",
        method: "GET",
        params: {
          page,
          limit,
          keyword,
        },
      }),
      transformResponse: (response: any) => response?.data,
    }),

    getCategoryById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response: any) => response?.data,
    }),

    getCategoryBySlug: builder.query({
      query: (slug) => `/slug/${slug}`,
      transformResponse: (response: any) => response?.data,
    }),

    addToCategory: builder.mutation({
      query: (body) => ({
        url: "/add-product",
        method: "POST",
        body,
      }),
    }),

    updateCategory: builder.mutation({
      query: (body) => ({
        url: "update-product",
        method: "PUT",
        body,
      }),
    }),

    deleteFromCategory: builder.mutation({
      query: (id) => ({
        url: `/update-product`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetAllCategoriesWithSubCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryBySlugQuery,
  useAddToCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteFromCategoryMutation,
} = categorySlice;
