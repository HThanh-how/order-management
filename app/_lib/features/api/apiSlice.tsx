// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getFromLocalStorage from "../../getFromLocalStorage";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

interface IHeader {
  "Content-Type": string;
  Authorization: string;
}
const Header: IHeader = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getFromLocalStorage("accessToken")}`,
};

type ResponseHandler =
  | 'content-type'
  | 'json'
  | 'text'
  | ((response: Response) => Promise<any>)

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_HOSTNAME}api/v1`,
  prepareHeaders: (headers: any) => {
    headers.set("Content-Type", Header["Content-Type"]);
    headers.set(
      "Authorization",
      `Bearer ${getFromLocalStorage("accessToken")}`
    );
    headers.set('ngrok-skip-browser-warning', 'true');
    return headers;
  },
});

const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    // try to get a new token

    const refreshResult = await fetch(
      `${process.env.NEXT_PUBLIC_HOSTNAME}auth/refreshToken`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: getFromLocalStorage("refreshToken"),
        }),
      }
    );

    if (refreshResult.ok) {
      const tmp = await refreshResult.json();
      console.log(tmp);
      const { accessToken, refreshToken } = tmp;
      
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      const createdAt = new Date().toISOString();
      localStorage.setItem("createdAt", createdAt);
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // refresh failed - do something like redirect to login or show a "retry" button
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("createdAt");
      // localStorage.removeItem("userId");
      window.location.href =  '/login';
    }
  }
  return result;
};

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: "api",
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: baseQueryWithRefresh,
  // baseQuery: fetchBaseQuery({
  //   baseUrl: `${process.env.NEXT_PUBLIC_HOSTNAME}api/v1`,
  //   prepareHeaders: (headers) => {
  //     headers.set("Content-Type", Header["Content-Type"]);
  //     headers.set("Authorization", Header["Authorization"]);
  //     return headers;
  //   }
  // }),
  tagTypes: ["Product", "Customer", "Store", "Order", "Staff", "Request", "UserInfo", "Notification"],
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getRefreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: "http://localhost:8080/auth/refreshToken",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: refreshToken,
      }),
    }),
    getProducts: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        method: "GET",
        url: "/products",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
      }),
      providesTags: ["Product"],
    }),
    getProductsForEmployee: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        method: "GET",
        url: "/products/owner/getall",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
      }),
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),
    addProductForEmployee: builder.mutation({
      query: (newProduct) => ({
        url: "/products/owner",
        method: "POST",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),
    editProduct: builder.mutation({
      query: (newProduct) => ({
        url: `/products/${newProduct.id}`,
        method: "PUT",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),
    editProductForEmployee: builder.mutation({
      query: (newProduct) => ({
        url: `/products/owner/${newProduct.id}`,
        method: "PUT",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),
    removeProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Product"],
    }),

    getCustomers: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: "/receivers",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
      }),
      providesTags: ["Customer"],
    }),
    getCustomerForEmployee: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        method: "GET",
        url: "/receivers/owner/getall",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
      }),
      providesTags: ["Customer"],
    }),
    getTopCustomers: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: "order/top-receiver",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
      }),
      providesTags: ["Customer"],
    }),
    getCustomersForEmployee: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: "/receivers/owner/getall",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
      }),
      providesTags: ["Customer"],
    }),
    addCustomer: builder.mutation({
      query: (newReceiver) => ({
        url: "/receivers/create",
        method: "POST",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
        body: newReceiver,
      }),
      invalidatesTags: ["Customer"],
    }),
    addCustomerForEmployee: builder.mutation({
      query: (newProduct) => ({
        url: "/recievers/owner",
        method: "POST",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
        body: newProduct,
      }),
      invalidatesTags: ["Customer"],
    }),
    editCustomer: builder.mutation({
      query: (newCustomer) => ({
        url: `/receivers/${newCustomer.receiverId}`,
        method: "PUT",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
        body: newCustomer,
      }),
      invalidatesTags: ["Customer"],
    }),
    editCustomerForEmployee: builder.mutation({
      query: (newCustomer) => ({
        url: `/receivers/owner/${newCustomer.receiverId}`,
        method: "PUT",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
        body: newCustomer,
      }),
      invalidatesTags: ["Customer"],
    }),
    removeCustomer: builder.mutation({
      query: (id) => ({
        url: `/receivers/${id}`,
        method: "DELETE",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
      }),

      invalidatesTags: ["Customer"],
    }),

    getStores: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: "/stores",
      }),
      providesTags: ["Store"],
    }),
    getStoresForEmployee: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        method: "GET",
        url: "/stores/owner/getall",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
      }),
      providesTags: ["Store"],
    }),
    addStore: builder.mutation({
      query: (newStore) => ({
        url: "/stores/create",
        method: "POST",
        body: newStore,
      }),
      invalidatesTags: ["Store"],
    }),
    addStoreForEmployee: builder.mutation({
      query: (newStore) => ({
        url: "/stores/owner",
        method: "POST",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
        body: newStore,
      }),
      invalidatesTags: ["Store"],
    }),
    editStore: builder.mutation({
      query: (newStore) => ({
        url: `/stores/${newStore.storeId}`,
        method: "PUT",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
        body: newStore,
      }),
      invalidatesTags: ["Store"],
    }),
    editStoreForEmployee: builder.mutation({
      query: (newStore) => ({
        url: `/stores/owner/${newStore.storeId}`,
        method: "PUT",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
        body: newStore,
      }),
      invalidatesTags: ["Store"],
    }),
    removeStore: builder.mutation({
      query: (id) => ({
        url: `/stores/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Store"],
    }),

    getOrders: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: "/order",
      }),
      providesTags: ["Order"],
    }),
    getOrdersForEmployee: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: "/order/owner",
      }),
      providesTags: ["Order"],
    }),
    getOrderDetail: builder.query<any, number | null>({
      // The URL for the request is '/fakeApi/posts'
      query: (id) => ({
        url: `/order/${id}`,
      }),
      providesTags: ["Order"],
    }),
    getOrderDetailForEmployee: builder.query<any, number | null>({
      // The URL for the request is '/fakeApi/posts'
      query: (id) => ({
        url: `/order/${id}/owner`,
      }),
      providesTags: ["Order"],
    }),
    addOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/order",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["Order"],
    }),
    addOrderForEmployee: builder.mutation({
      query: (newOrder) => ({
        url: "/order/owner",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["Order"],
    }),
    editOrderStatus: builder.mutation({
      query: ({newStatus, id}) => ({
        url: `/order/${id}/status`,
        method: "PATCH",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
        body: newStatus,
      }),
      invalidatesTags: ["Order"],
    }),
    editOrderStatusForEmployee: builder.mutation({
      query: ({newStatus, id}) => ({
        url: `/order/${id}/owner/status`,
        method: "PATCH",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
        body: newStatus,
      }),
      invalidatesTags: ["Order"],
    }),
    removeOrder: builder.mutation({
      query: (id) => ({
        url: `/order/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Order"],
    }),

    getEmployees: builder.query<any, void>({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: "/empl-mngt",
      }),
      providesTags: ["Staff"],
    }),

    getEmployeePermission: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: "/empl-mngt/employee/permissions",
      }),
    }),

    editEmployeePermission: builder.mutation({
      query: ({newPermissions, id}) => ({
        url: `/empl-mngt/${id}`,
        method: "PUT",
        body: newPermissions,
      }),

      invalidatesTags: ["Staff"],
    }),

    removeEmployee: builder.mutation({
      query: (id) => ({
        url: `/empl-mngt/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Staff"],
    }),


    sendEmployeeRequest: builder.mutation({
      query: (request) => ({
        url: "/empl-mngt/request",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Request"],
    }),

    getAllRequestOfOwner: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: "/empl-mngt/owner/get-all",
      }),
      providesTags: ["Request"],
    }),

    getEmployeesRequest: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: "/empl-mngt/employee/get-all?status=PENDING",
      }),
    }),

    getUserInfo: builder.query<any, string | null>({
      // The URL for the request is '/fakeApi/posts'
      query: (id) => ({
        url: `/user/${id}`,
      }),
      providesTags: ["UserInfo"],
    }),
    editUserInfo: builder.mutation({
      query: ({ newUserInfo, id }) => ({
        url: `/user/${id}/update`,
        method: "PATCH",
        body: newUserInfo,
      }),
      invalidatesTags: ["UserInfo"],
    }),

    approveEmployeeRequest: builder.mutation({
      query: ({ id, request }) => ({
        url: `/empl-mngt/${id}/approve`,
        method: "PATCH",
        body: request,
        responseHandler: (response) => response.text(),
      }),
    }),
    rejectEmployeeRequest: builder.mutation({
      query: ({ id, request }) => ({
        url: `/empl-mngt/${id}/reject`,
        method: "PATCH",
        body: request,
        responseHandler: (response) => response.text(),
      }),
    }),
    getNotifications: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: `/notification`,
      }),
      providesTags: ["Notification"],
    }),
    setNotiIsRead: builder.mutation({
      query: (id) => ({
        url: `/notification/${id}`,
        method: "PUT",
        headers: {
          userId: `${getFromLocalStorage("userId")}`,
        },
      }),
      invalidatesTags: ["Notification"],
    }),
    getStatistic: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: `order/statistic`,
      }),
      
    }),
    getStatistic2: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: `order/statistic-completed`,
      }),
      
    }),
    getTodayReceiver: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: `receivers/statistics`,
      }),
      
    }),
    getTodayStore: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: `stores/statistics`,
      }),
      
    }),
    getTodayProduct: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: `products/statistics`,
      }),
      
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useGetProductsQuery,
  useGetProductsForEmployeeQuery,
  useAddProductMutation,
  useAddProductForEmployeeMutation,
  useEditProductMutation,
  useEditProductForEmployeeMutation,
  useRemoveProductMutation,
  useGetCustomersQuery,
  useGetCustomerForEmployeeQuery,
  useGetTopCustomersQuery,
  useGetCustomersForEmployeeQuery,
  useAddCustomerMutation,
  useAddCustomerForEmployeeMutation,
  useEditCustomerMutation,
  useEditCustomerForEmployeeMutation,
  useRemoveCustomerMutation,
  useGetStoresQuery,
  useGetStoresForEmployeeQuery,
  useAddStoreMutation,
  useAddStoreForEmployeeMutation,
  useEditStoreMutation,
  useEditStoreForEmployeeMutation,
  useRemoveStoreMutation,
  useGetOrdersQuery,
  useGetOrdersForEmployeeQuery,
  useGetOrderDetailQuery,
  useGetOrderDetailForEmployeeQuery,
  useAddOrderMutation,
  useAddOrderForEmployeeMutation,
  useEditOrderStatusMutation,
  useEditOrderStatusForEmployeeMutation,
  useRemoveOrderMutation,
  useGetRefreshTokenMutation,
  useGetEmployeesQuery,
  useGetEmployeePermissionQuery,
  useEditEmployeePermissionMutation,
  useRemoveEmployeeMutation,
  useSendEmployeeRequestMutation,
  useGetEmployeesRequestQuery,
  useApproveEmployeeRequestMutation,
  useRejectEmployeeRequestMutation,
  useGetAllRequestOfOwnerQuery,
  useGetUserInfoQuery,
  useEditUserInfoMutation,
  useGetNotificationsQuery,
  useSetNotiIsReadMutation,
  useGetStatisticQuery,
  useGetStatistic2Query,
  useGetTodayProductQuery,
  useGetTodayReceiverQuery,
  useGetTodayStoreQuery,
} = apiSlice;
