// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "../../services/axios";

export const getPlans = createAsyncThunk(
  "appMembership/getData",
  async (params) => {
    const response = await axios.post("/api/memberships/getByUser", params);
    return {
      params,
      data: response.data.memberships,
      totalPages: response.data.total,
    };
  }
);

export const deletePlan = createAsyncThunk(
  "appMembership/deleteMembership",
  async (id, { dispatch, getState }) => {
    await axios.post("/api/memberships/delete", { id });
    await dispatch(getPlans(getState().plans.params));
    return id;
  }
);

export const addPlan = createAsyncThunk(
  "appMembership/createMembership",
  async (
    { id, membershipType, amount, description },
    { dispatch, getState }
  ) => {
    await axios.post("/api/memberships/create", {
      id,
      membershipType,
      amount,
      description,
    });
    await dispatch(getPlans(getState().plans.params));
    return id;
  }
);

export const appPlanSlice = createSlice({
  name: "appPlanSlice",
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPlans.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.total = action.payload.totalPages;
      state.params = action.payload.params;
    });
  },
});

export default appPlanSlice.reducer;
