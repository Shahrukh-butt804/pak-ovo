import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/api";
import { prepareHeaders } from "../prepareHeader/preapareHeader";

export const wishlistSlice = createApi({
  reducerPath: "wishlistSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + "/wishlist",
    credentials: "include",
    prepareHeaders,
  }),
  tagTypes: ["wishlist"],
  endpoints: (builder) => ({
    getMyWishlist: builder.query({
      query: ({ page, limit, keyword }) => ({
        url: "/",
        method: "GET",
        params: {
          page,
          limit,
          keyword,
        },
      }),
      transformResponse : (res :any) => res.data,
      providesTags: ["wishlist"],
    }),

    addProductToWishlist: builder.mutation({
      query: (id) => ({
        url: `/add-product/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["wishlist"],
    }),

    deleteFromWishlist: builder.mutation({
      query: (id) => ({
        url: `/delete-product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["wishlist"],
    }),
  }),
});

export const {
  useAddProductToWishlistMutation,
  useGetMyWishlistQuery,
  useDeleteFromWishlistMutation,
} = wishlistSlice;
