// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "../../services/axios";

export const getAds = createAsyncThunk(
  "appEcommerce/getAds",
  async (params, { getState }) => {
    const response = await axios.post("/api/dd", params);
    return { data: response.data };
  }
);

export const getAd = createAsyncThunk("appEcommerce/getAd", async (id) => {
  const response = await axios.get(`/api/dd/${id}`);
  return response.data;
});

export const setParams = createAsyncThunk(
  "appEcommerce/setParams",
  async (params) => {
    return { params };
  }
);

export const loadParams = createAsyncThunk(
  "appEcommerce/loadParams",
  async (_, { dispatch, getState }) => {
    let params = getState().data.params;
    return { params };
  }
);

export const appDataSlice = createSlice({
  name: "appData",
  initialState: {
    params: {
      type: "all",
      q: "",
      qt: "keyword",
      // likes: [0, 100000],
      // popularity: [0, 100000],
      // impression: [0, 100000],
      // days: [0, 100000],
      sortBy: "desc",
      perPage: 12,
      page: 1,
      categories: [],
      languages: [],
      countries: [],
      date: [
        new Date(
          new Date().setMonth(new Date().getMonth() - 1)
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      ],
    },
    ads: [],
    ad: {},
    total: 0,
    inited: false,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAds.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAds.fulfilled, (state, action) => {
        state.ads = action.payload.data.ads;
        state.total = action.payload.data.total;
        state.loading = false;
      })
      .addCase(getAd.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAd.fulfilled, (state, action) => {
        state.ad = action.payload;
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

export default appDataSlice.reducer;
