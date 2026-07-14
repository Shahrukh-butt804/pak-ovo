import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/api";
import { prepareHeaders } from "../prepareHeader/preapareHeader";

export const profileSlice = createApi({
    reducerPath: "profileSlice",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL + "/profile", credentials: 'include' , prepareHeaders }),
    endpoints: (builder) => ({
        upDateProfile: builder.mutation({
            query: (body) => ({
                url: "/update-profile",
                method: "PUT",
                body,
            }),
        })
    }),
});

export const { useUpDateProfileMutation } = profileSlice;


