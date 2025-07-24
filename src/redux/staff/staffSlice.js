// src/redux/slices/staffSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

// Thunks
export const updateStaff = createAsyncThunk(
  "staff/updateStaff",
  async ({ staffId, staffData }, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.patch(
        `${API_BASE_URL}/staff/${staffId}`,
        staffData,
        { headers }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update staff"
      );
    }
  }
);

export const deleteStaff = createAsyncThunk(
  "staff/deleteStaff",
  async (staffId, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_BASE_URL}/staff/${staffId}`, { headers });
      return staffId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete staff"
      );
    }
  }
);

// Slice
const staffSlice = createSlice({
  name: "staff",
  initialState: {
    staffList: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update staff
      .addCase(updateStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.loading = false;
        const updatedStaff = action.payload;
        state.staffList = state.staffList.map((staff) =>
          staff.id === updatedStaff.id ? updatedStaff : staff
        );
        state.successMessage = "Staff updated successfully!";
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete staff
      .addCase(deleteStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffList = state.staffList.filter(
          (staff) => staff.id !== action.payload
        );
        state.successMessage = "Staff deleted successfully!";
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = staffSlice.actions;

export default staffSlice.reducer;
