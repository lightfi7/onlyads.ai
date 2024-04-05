// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "../../services/axios";

export const getProducts = createAsyncThunk(
  "appTopProduct/getProducts",
  async (params, { dispatch, getState }) => {
    const response = await axios.post("/api/sales/topproducts", { params });
    return { data: response.data[0] };
  }
);

export const setParams = createAsyncThunk(
  "appTopProduct/setParams",
  async (params) => {
    return { params };
  }
);

export const loadParams = createAsyncThunk(
  "appTopProduct/loadParams",
  async (_, { dispatch, getState }) => {
    let params = getState().topproducts.params;
    return { params };
  }
);

export const appTopProductSlice = createSlice({
  name: "appTopProducts",
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
          min: null, //new Date(new Date().setFullYear(new Date().getFullYear() - 10)).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
          max: null, //new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        },
        languages: [],
      },
    },
    products: [],
    product: {},
    total: 1000,
    inited: false,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload.data.data;
        if (action.payload.data.metadata.length)
          state.total = action.payload.data.metadata[0].total;
        state.loading = false;
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

export default appTopProductSlice.reducer;
