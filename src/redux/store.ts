import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./services/apiSlice";
import userReducer from "./reducers/userSlice";
import { authSlice } from "./services/authSlice";
import { profileSlice } from "./services/profileSlice";
import { userManagementSlice } from "./services/userManagement";
import { orderSlice } from "./services/orderSlice";
import { productSlice } from "./services/productSlice";
import { resourceSlice } from "./services/resourceSlice";
import { couponSlice } from "./services/couponSlice";
import { collectionSlice } from "./services/collectionSlice";
import { emailSlice } from "./services/emailSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // Add API slice reducer
    [authSlice.reducerPath]: authSlice.reducer,
    [profileSlice.reducerPath]: profileSlice.reducer,
    [userManagementSlice.reducerPath]: userManagementSlice.reducer,
    [orderSlice.reducerPath]: orderSlice.reducer,
    [productSlice.reducerPath]: productSlice.reducer,
    [collectionSlice.reducerPath]: collectionSlice.reducer,
    [resourceSlice.reducerPath]: resourceSlice.reducer,
    [couponSlice.reducerPath]: couponSlice.reducer,
    [emailSlice.reducerPath]: emailSlice.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware).concat(authSlice.middleware).concat(profileSlice.middleware).concat(userManagementSlice.middleware).concat(orderSlice.middleware).concat(productSlice.middleware).concat(collectionSlice.middleware).concat(resourceSlice.middleware).concat(couponSlice.middleware)
      .concat(emailSlice.middleware), // Add RTK Query middleware
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
