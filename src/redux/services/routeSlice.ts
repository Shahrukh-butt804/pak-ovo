import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/api";
import { prepareHeaders } from "../prepareHeader/preapareHeader";

export const RouteSlice = createApi({
    reducerPath: "RouteSlice",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL + "/routes", credentials: 'include', prepareHeaders }),
    endpoints: (builder) => ({

        getAllRoutess: builder.query({
            query: ({ page, limit, keyword }) => ({
                url: "/",
                method: "GET",
                params: {
                    page,
                    limit,
                    keyword
                }
            }),
            transformResponse: (res) => res?.data

        }),

        addRoutes: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
        }),

        updateRoutes: builder.mutation({
            query: ({ id, body }) => ({
                url: `/${id}`,
                method: "PATCH",
                body,
            }),
        }),

        deleteRoutes: builder.mutation({
            query: ({ id, body }) => ({
                url: `/${id}`,
                method: "DELETE",
                body,
            }),
        })
    }),
});

export const { useGetAllRoutessQuery, useAddRoutesMutation, useUpdateRoutesMutation , useDeleteRoutesMutation } = RouteSlice;


