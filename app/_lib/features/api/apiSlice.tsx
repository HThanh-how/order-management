// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getFromLocalStorage from '../../getFromLocalStorage';

interface IHeader {
  "Content-Type": string;
  "Authorization": string;
}
const Header: IHeader = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getFromLocalStorage("accessToken")}`,
};

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${process.env.NEXT_PUBLIC_HOSTNAME}api/v1`,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", Header["Content-Type"]);
      headers.set("Authorization", Header["Authorization"]);
      return headers;
    }
  }),
  tagTypes: ['Product', 'Customer', 'Store'],
  // The "endpoints" represent operations and requests for this server
  endpoints: builder => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getProducts: builder.query<any, void>({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: "/products",
        headers: {
          "userId": `${getFromLocalStorage("userId")}`,
        },
      }),
      providesTags: ['Product']  
    }),
    addProduct: builder.mutation({
      query: newProduct => ({
        url: "products",
        method: "POST",
        headers: {
          "userId": `${getFromLocalStorage("userId")}`,
        },
        body: newProduct
      }),
      invalidatesTags: ['Product'],
    }),
    editProduct: builder.mutation({
      query: newProduct => ({
        url: `products/${newProduct.id}`,
        method: "PUT",
        headers: {
          "userId": `${getFromLocalStorage("userId")}`,
        },
        body: newProduct
      }),
      invalidatesTags: ['Product'],
    }),
    removeProduct: builder.mutation({
      query: id => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
    
      invalidatesTags: ['Product'],
    }),

    getCustomers: builder.query<any, void>({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: "/receivers",
        headers: {
          "userId": `${getFromLocalStorage("userId")}`,
        },
      }),
      providesTags: ['Customer']  
    }),
    addCustomer: builder.mutation({
      query: newReceiver => ({
        url: "receivers/create",
        method: "POST",
        headers: {
          "userId": `${getFromLocalStorage("userId")}`,
        },
        body: newReceiver
      }),
      invalidatesTags: ['Customer'],
    }),
    removeCustomer: builder.mutation({
      query: id => ({
        url: `receivers/${id}`,
        method: "DELETE",
        headers: {
          "userId": `${getFromLocalStorage("userId")}`,
        },
      }),
    
      invalidatesTags: ['Customer'],
    }),

    getStores: builder.query<any, void>({
      // The URL for the request is '/fakeApi/posts'
      query: () => ({
        url: "/stores",
        // headers: {
        //   "userId": `${getFromLocalStorage("userId")}`,
        // },
      }),
      providesTags: ['Store']  
    }),
    addStore: builder.mutation({
      query: newReceiver => ({
        url: "stores/create",
        method: "POST",
        // headers: {
        //   "userId": `${getFromLocalStorage("userId")}`,
        // },
        body: newReceiver
      }),
      invalidatesTags: ['Store'],
    }),
    removeStore: builder.mutation({
      query: id => ({
        url: `stores/${id}`,
        method: "DELETE",
        // headers: {
        //   "userId": `${getFromLocalStorage("userId")}`,
        // },
      }),
    
      invalidatesTags: ['Store'],
    }),
  })
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetProductsQuery, useAddProductMutation, useEditProductMutation, useRemoveProductMutation,
                useGetCustomersQuery, useAddCustomerMutation, useRemoveCustomerMutation,
                useGetStoresQuery, useAddStoreMutation, useRemoveStoreMutation } = apiSlice