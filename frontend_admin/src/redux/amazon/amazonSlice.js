// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "../../services/axios";

export const getProducts = createAsyncThunk(
  "appAmazonProducts/getProducts",
  async (params, { dispatch, getState }) => {
    const response = await axios.post("/api/amazon/products", {
      ...params,
    });
    return { data: response.data[0], params };
  }
);

export const setParams = createAsyncThunk(
  "appAmazonProducts/setParams",
  async (params, { getState }) => {
    return { params };
  }
);

export const loadParams = createAsyncThunk(
  "appAmazonProducts/loadParams",
  async (_, { dispatch, getState }) => {
    let params = getState().amazon.params;
    return { params };
  }
);

export const appAmazonProductslice = createSlice({
  name: "appAmazonProducts",
  initialState: {
    params: {
      page: 0,
      page_size: 24,
      q: "",
      categories: [],
      price: {
        min: null,
        max: null,
      },
      rank: "any",
    },
    products: [],
    product: {},
    total: 10000,
    loading: false,
    inited: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload.data.data;
        if (action.payload.data.metadata.length)
          state.total = action.payload.data.metadata[0].total;
        state.loading = false;
      })
      .addCase(setParams.fulfilled, (state, action) => {
        state.params = { ...state.params, ...action.payload.params };
      })
      .addCase(loadParams.fulfilled, (state, action) => {
        state.params = action.payload.params;
        state.inited = true;
      });
  },
});

export default appAmazonProductslice.reducer;
