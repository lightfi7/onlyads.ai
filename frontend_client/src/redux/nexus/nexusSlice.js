// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "../../services/axios";

export const getProducts = createAsyncThunk(
  "appNexusProducts/getProducts",
  async (params, { dispatch, getState }) => {
    const response = await axios.post("/api/nexus/products", {
      // ...getState().nexus.params,
      ...params,
    });
    return { data: response.data[0], params };
  }
);
export const getMoreProducts = createAsyncThunk(
  "appNexusProducts/getMoreProducts",
  async (params, { dispatch, getState }) => {
    const response = await axios.post("/api/nexus/products", {
      ...getState().nexus.params,
      ...params,
    });
    return { data: response.data[0], params };
  }
);

export const getResearch = createAsyncThunk(
  "appNexusProducts/getResearch",
  async (id) => {
    const response = await axios.get(`/api/nexus/products/${id}`);
    return response.data;
  }
);

export const setParams = createAsyncThunk(
  "appNexusProducts/setParams",
  async (params) => {
    return { params };
  }
);

export const loadParams = createAsyncThunk(
  "appNexusProducts/loadParams",
  async (_, { dispatch, getState }) => {
    let params = getState().nexus.params;
    return { params };
  }
);

export const appNexusProductSlice = createSlice({
  name: "appNexusProducts",
  initialState: {
    params: {
      page: 0,
      page_size: 24,
      q: "",
      ship_from: [],
      categories: [],
      price: {
        min: null,
        max: null,
      },
      orders: {
        min: null,
        max: null,
      },
      store_selling: {
        min: null,
        max: null,
      },
    },
    products: [],
    product: {},
    total: 1000,
    loading: false,
    inited: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        // if (state.params.page < action.payload.params.page) {
        //   state.params.page = action.payload.params.page;
        //   state.products = [
        //     ...[],
        //     ...state.products,
        //     ...action.payload.data.data,
        //   ];
        // } else if (action.payload.params.page === 1) {
        //   state.products = action.payload.data.data;
        // }
        state.products = action.payload.data.data;
        if (action.payload.data.metadata.length)
          state.total = action.payload.data.metadata[0].total;
        state.loading = false;
      })
      .addCase(getResearch.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getResearch.fulfilled, (state, action) => {
        state.product = action.payload;
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

export default appNexusProductSlice.reducer;
