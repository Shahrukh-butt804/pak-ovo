import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/api";
import { prepareHeaders } from "../prepareHeader/preapareHeader";

export const userManagementSlice = createApi({
    reducerPath: "userManagementSlice",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL + "/user-management", credentials: 'include' , prepareHeaders }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getReport: builder.query({
            query: () => "/get-report",

        }),

        getGrowthData: builder.query({
            query: ({ weeksBack }) => ({
                url: "/get-membership-growth",
                method: "GET",
                params: weeksBack ? { weeksBack } : {},
            }),
        }),

        getAllUsers: builder.query({
            query: ({ page, limit, keyword }) => ({
                url: "/",
                method: "GET",
                params: {
                    page,
                    limit,
                    keyword
                }
            }),
            transformResponse : (res) => res?.data

        }),
        getUserById: builder.query({
            query: (id) => `/get-user-by-id/${id}`,
            transformResponse: (response: any) => response?.user,
            providesTags: ["User"],

        }),
        toggleUserStatus: builder.mutation({
            query: (id) => ({
                url: `/toggle-status/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["User"],
        })
    }),
});

export const { useGetReportQuery, useGetGrowthDataQuery, useGetAllUsersQuery, useGetUserByIdQuery, useToggleUserStatusMutation } = userManagementSlice;


