// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "../../services/axios";

export const getColor = createAsyncThunk("appTheme/getColor", async () => {
  const response = await axios.get("/api/setting/theme/color");
  return {
    color: response.data?.color,
  };
});

export const setColor = createAsyncThunk("appTheme/setColor", async (color) => {
  return { color };
});

export const submitColor = createAsyncThunk(
  "appTheme/submitColor",
  async (color) => {
    await axios.post("/api/setting/theme/color", { color });
    return { color };
  }
);

export const appTheme = createSlice({
  name: "appTheme",
  initialState: {
    color: {
      light: "#33ab9f",
      main: "#009688",
      dark: "#00695f",
      contrastText: "#fff",
    },
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getColor.fulfilled, (state, action) => {
        if (action.payload.color) state.color = action.payload.color;
        state.loading = false;
      })
      .addCase(getColor.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(setColor.fulfilled, (state, action) => {
        state.color = action.payload.color;
      })
      .addCase(submitColor.fulfilled, (state, action) => {
        state.color = action.payload.color;
      });
  },
});

export default appTheme.reducer;
