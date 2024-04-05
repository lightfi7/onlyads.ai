// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "../../services/axios";

export const getUsers = createAsyncThunk("Users/getUsers", async (params) => {
  const response = await axios.post("/api/users", params);
  return {
    params,
    data: response.data.users,
    totalPages: response.data.total,
  };
});

export const getUser = createAsyncThunk("Users/getUser", async (id) => {
  const response = await axios.post("/api/users/getone", { id });
  return response.data.user;
});

export const addUser = createAsyncThunk(
  "Users/addUser",
  async (user, { dispatch, getState }) => {
    await axios.post("/apps/users/add-user", user);
    await dispatch(getUsers(getState().users.params));
    return user;
  }
);

export const deleteUser = createAsyncThunk(
  "Users/deleteUser",
  async (id, { dispatch, getState }) => {
    await axios.post("/api/users/delete", { id });
    await dispatch(getUsers(getState().users.params));
    return id;
  }
);

export const usersSlice = createSlice({
  name: "Users",
  initialState: {
    data: [],
    total: 1,
    params: {},
    selectedUser: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.params = action.payload.params;
        state.total = action.payload.totalPages;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      });
  },
});

export default usersSlice.reducer;
