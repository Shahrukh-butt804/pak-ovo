import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/api";
import { prepareHeaders } from "../prepareHeader/preapareHeader";

export const subCategorySlice = createApi({
  reducerPath: "subCategorySlice",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + "/sub-category",
    credentials: "include",
    prepareHeaders,
  }),
  endpoints: (builder) => ({
    getAllSubCategories: builder.query({
      query: ({ page, limit, keyword, slug }) => ({
        url: "/",
        method: "GET",
        params: {
          page,
          limit,
          keyword,
          slug,
        },
      }),
      transformResponse: (response: any) => response?.data,
    }),

    getSubCategoryById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response: any) => response?.data,
    }),
  }),
});

export const { useGetAllSubCategoriesQuery, useGetSubCategoryByIdQuery } = subCategorySlice;
