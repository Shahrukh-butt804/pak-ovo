import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/api";
import { prepareHeaders } from "../prepareHeader/preapareHeader";

export const collectionSlice = createApi({
    reducerPath: "collectionSlice",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL + "/collections", credentials: 'include' , prepareHeaders }),
    endpoints: (builder) => ({
        getAllCollections: builder.query({
            query: ({ page, limit, keyword }) => ({
                url: "/get-all-collection",
                method: "GET",
                params: {
                    page,
                    limit,
                    keyword
                }
            }),
        }),
        getCollectionById: builder.query({
            query: (id) => `/get-collection-by-id/${id}`,
            transformResponse: (response: any) => response?.collection
        }),
        addCollection: builder.mutation({
            query: (body) => ({
                url: "/add-collection",
                method: "POST",
                body,
            }),
        }),
        updateCollection: builder.mutation({
            query: ({ id, body }) => ({
                url: `/update-collection/${id}`,
                method: "PUT",
                body,
            }),
        }),
        deleteCollection: builder.mutation({
            query: (id) => ({
                url: `/delete-collection/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const { useGetAllCollectionsQuery, useGetCollectionByIdQuery, useAddCollectionMutation, useUpdateCollectionMutation, useDeleteCollectionMutation } = collectionSlice;


