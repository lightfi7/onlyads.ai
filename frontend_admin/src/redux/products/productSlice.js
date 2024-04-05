// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "../../services/axios";

export const getProducts = createAsyncThunk(
  "appProducts/getProducts",
  async (params, { dispatch, getState }) => {
    const response = await axios.post("/api/products", { params });
    return { data: response.data[0] };
  }
);

export const getProduct = createAsyncThunk(
  "appProducts/getProduct",
  async (id) => {
    const response = await axios.get(`/api/products/${id}`);
    return response.data;
  }
);

export const setParams = createAsyncThunk(
  "appProducts/setParams",
  async (params) => {
    return { params };
  }
);

export const loadParams = createAsyncThunk(
  "appProducts/loadParams",
  async (_, { dispatch, getState }) => {
    let params = getState().products.params;
    return { params };
  }
);

export const appProductSlice = createSlice({
  name: "appProducts",
  initialState: {
    params: {
      page: 0,
      page_size: 50,
      ordering: {},
      new_search: true,
      filters: {
        categories: [
          "Appliances",
          "Arts Crafts & Sewing",
          "Automotive",
          "Baby",
          "Beauty & Personal Care",
          "Camera & Photo",
          "Clothing & Shoes & Jewelry",
          "Cell Phones & Accessories",
          "Computers & Accessories",
          "Digital Goods",
          "Grocery & Gourmet Food",
          "Health & Household",
          "Home & Kitchen & Dining",
          "Musical Instruments",
          "Office Products",
          "Patio Lawn & Garden",
          "Pet Supplies",
          "Sports & Outdoors",
          "Tools & Home Improvement",
          "Toys & Games",
        ],
        title: { exclude: null, include: null },
        description: { exclude: null, include: null },
        domain: { exclude: null, include: null },
        price: { max: null, min: null },
        sales: { max: null, min: null },
        revenue: { max: null, min: null },
        products: { max: null, min: null },
        images: { max: null, min: null },
        variants: { max: null, min: null },
        product_created_at: {
          min: null, //new Date(new Date().setFullYear(new Date().getFullYear() - 10)).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
          max: null, //new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        },
        store_created_at: {
          min: null, //new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
          max: null, //new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        },
        language: null,
        currency: null,
        domain_tld: null,
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
      .addCase(getProduct.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.product = action.payload;
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

export default appProductSlice.reducer;
