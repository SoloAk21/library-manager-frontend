import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all books
      const booksResponse = await axios.get(`${API_BASE_URL}/books`, {
        headers,
      });
      console.log("Books fetched:", booksResponse);

      // Fetch all members
      const membersResponse = await axios.get(`${API_BASE_URL}/members`, {
        headers,
      });
      // Fetch all borrow records
      const borrowRecordsResponse = await axios.get(
        `${API_BASE_URL}/borrow-records`,
        { headers }
      );
      console.log("Borrow records fetched:", borrowRecordsResponse);

      // Fetch overdue books
      const overdueResponse = await axios.get(
        `${API_BASE_URL}/borrow-records/reports/overdue`,
        { headers }
      );

      console.log("Overdue books fetched:", overdueResponse);

      return {
        totalBooks: booksResponse.data.length,
        totalMembers: membersResponse.data.length,
        activeBorrows: borrowRecordsResponse.data.filter(
          (record) => !record.return_date
        ).length,
        overdueBooks: overdueResponse.data.length,
        recentActivity: borrowRecordsResponse.data
          .slice(0, 5)
          .map((record) => ({
            id: record.id,
            bookTitle: record.book?.title || "Unknown Book",
            memberName: record.member?.name || "Unknown Member",
            action: record.return_date ? "Returned" : "Borrowed",
            date: record.return_date || record.borrow_date,
          })),
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    totalBooks: 0,
    totalMembers: 0,
    activeBorrows: 0,
    overdueBooks: 0,
    recentActivity: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.totalBooks = action.payload.totalBooks;
        state.totalMembers = action.payload.totalMembers;
        state.activeBorrows = action.payload.activeBorrows;
        state.overdueBooks = action.payload.overdueBooks;
        state.recentActivity = action.payload.recentActivity;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;

export default dashboardSlice.reducer;
