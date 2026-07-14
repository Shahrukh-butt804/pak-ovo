import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/api";
import { prepareHeaders } from "../prepareHeader/preapareHeader";

export const resourceSlice = createApi({
    reducerPath: "resourceSlice",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL + "/resource", credentials: 'include', prepareHeaders }),
    endpoints: (builder) => ({
        getAllResources: builder.query({
            query: ({ page, limit, keyword }) => ({
                url: "/get-all-resources",
                method: "GET",
                params: {
                    page,
                    limit,
                    keyword
                }
            }),

        }),
        getResourceById: builder.query({
            query: (id) => `/get-resource-by-id/${id}`,
            transformResponse: (response: any) => response?.resource
        }),
        addResource: builder.mutation({
            query: ({ name, content }) => ({
                url: "/add-resource",
                method: "POST",
                body: { name, content },
            }),
        }),
        updateResource: builder.mutation({
            query: ({ id, body }) => ({
                url: `/update-resource/${id}`,
                method: "PUT",
                body,
            }),
        })
    }),
});

export const { useGetAllResourcesQuery, useGetResourceByIdQuery, useAddResourceMutation, useUpdateResourceMutation } = resourceSlice;


