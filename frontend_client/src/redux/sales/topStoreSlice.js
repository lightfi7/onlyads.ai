// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "../../services/axios";

export const getStores = createAsyncThunk(
  "appTopStore/getStores",
  async (params, { dispatch, getState }) => {
    const response = await axios.post("/api/sales/topstores", { params });
    return { data: response.data[0] };
  }
);

export const getProductsByStore = createAsyncThunk(
  "appTopStore/getProductsByStore",
  async (params, { dispatch, getState }) => {
    const response = await axios.post("/api/sales/productsbystore", params);
    return { data: response.data[0] };
  }
);

export const getProducts5ByStore = createAsyncThunk(
  "appTopStore/getProducts5ByStore",
  async (params, { dispatch, getState }) => {
    const response = await axios.post("/api/sales/productsbystore", params);
    return { data: response.data[0] };
  }
);

export const clearProductsByStore = createAsyncThunk(
  "appTopStore/clearProductsByStore",
  async (params, { dispatch, getState }) => {
    return { data: [] };
  }
);

export const setParams = createAsyncThunk(
  "appTopStore/setParams",
  async (params) => {
    return { params };
  }
);

export const loadParams = createAsyncThunk(
  "appTopStore/loadParams",
  async (_, { dispatch, getState }) => {
    let params = getState().topstores.params;
    return { params };
  }
);

export const appTopStoreSlice = createSlice({
  name: "appData",
  initialState: {
    params: {
      page: 0,
      page_size: 50,
      filters: {
        title: null,
        price: { max: null, min: null },
        sales: { max: null, min: null },
        revenue: { max: null, min: null },
        products: { max: null, min: null },
        created_at: {
          min: null, //new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit'}),
          max: null, //new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit'}),
        },
        languages: [],
      },
    },
    stores: [],
    store: {},
    products: {
      loading: false,
      total: 0,
      data: [],
    },
    total: 1000,
    inited: false,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStores.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getStores.fulfilled, (state, action) => {
        state.stores = action.payload.data.data;
        if (action.payload.data.metadata.length)
          state.total = action.payload.data.metadata[0].total;
        state.loading = false;
      })
      .addCase(clearProductsByStore.fulfilled, (state, action) => {
        state.products.data = [];
        state.products.total = 0;
      })
      .addCase(getProductsByStore.pending, (state, action) => {
        state.products.loading = true;
      })
      .addCase(getProductsByStore.fulfilled, (state, action) => {
        state.products.data = action.payload.data.data;
        if (action.payload.data.metadata.length)
          state.products.total = action.payload.data.metadata[0].total;
        state.products.loading = false;
      })
      .addCase(getProducts5ByStore.pending, (state, action) => {
        state.products.loading = true;
      })
      .addCase(getProducts5ByStore.fulfilled, (state, action) => {
        state.products.data = state.products.data.concat(
          action.payload.data.data
        );
        if (action.payload.data.metadata.length)
          state.products.total = action.payload.data.metadata[0].total;
        state.products.loading = false;
      })
      .addCase(setParams.fulfilled, (state, action) => {
        state.params = action.payload.params;
      })
      .addCase(loadParams.fulfilled, (state, action) => {
        state.params = action.payload.params;
        state.inited = true;
      });
  },
});

export default appTopStoreSlice.reducer;
