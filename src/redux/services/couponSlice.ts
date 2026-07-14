import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/api";
import { prepareHeaders } from "../prepareHeader/preapareHeader";

export const couponSlice = createApi({
    reducerPath: "couponSlice",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL + "/coupons", credentials: 'include' , prepareHeaders }),
    endpoints: (builder) => ({

        getAllCoupons: builder.query({
            query: ({ page, limit, keyword }) => ({
                url: "/get-all-coupons",
                method: "GET",
                params: {
                    page,
                    limit,
                    keyword
                }
            }),
        }),
        getCouponById: builder.query({
            query: (id) => `/get-coupon-by-id/${id}`,
            transformResponse: (response: any) => response?.coupon
        }),
        addCoupon: builder.mutation({
            query: (body) => ({
                url: "/add-coupon",
                method: "POST",
                body,
            }),
        }),
        updateCoupon: builder.mutation({
            query: ({ id, body }) => ({
                url: `/update-coupon/${id}`,
                method: "PUT",
                body,
            }),
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/delete-coupon/${id}`,
                method: "DELETE",
            }),
        }),
        toggleCouponStatus: builder.mutation({
            query: ({ id }) => ({
                url: `/toggle-coupon-status/${id}`,
                method: "PUT",
            }),
        })

    }),
});

export const { useGetAllCouponsQuery, useGetCouponByIdQuery, useAddCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation, useToggleCouponStatusMutation } = couponSlice;


