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
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Staff updated successfully!";
      })

      // Delete staff
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Staff deleted successfully!";
      })

      // Add these cases to handle the pending/rejected states
      .addMatcher(
        (action) =>
          [updateStaff.pending, deleteStaff.pending].includes(action.type),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [updateStaff.rejected, deleteStaff.rejected].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearMessages } = staffSlice.actions;

export default staffSlice.reducer;
