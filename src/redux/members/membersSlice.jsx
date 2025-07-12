import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:3000";

// Async Thunks
export const fetchMembers = createAsyncThunk(
  "members/fetchMembers",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_BASE_URL}/members`, { headers });
      return response.data.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        joinDate: member.join_date,
        activeBorrows: member.active_borrows || 0,
      }));
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch members"
      );
    }
  }
);

export const fetchMemberById = createAsyncThunk(
  "members/fetchMemberById",
  async (memberId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_BASE_URL}/members/${memberId}`, {
        headers,
      });
      return {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        joinDate: response.data.join_date,
        activeBorrows: response.data.active_borrows || 0,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch member details"
      );
    }
  }
);

export const fetchMemberBorrowingHistory = createAsyncThunk(
  "members/fetchMemberBorrowingHistory",
  async (memberId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${API_BASE_URL}/members/${memberId}/borrowing-history`,
        { headers }
      );
      return {
        memberId,
        history: response.data.map((record) => ({
          id: record.id,
          bookId: record.book_id,
          bookTitle: record.book?.title || "Unknown Book",
          borrowDate: record.borrow_date,
          dueDate: record.due_date,
          returnDate: record.return_date,
          status: record.return_date
            ? "returned"
            : new Date(record.due_date) < new Date()
            ? "overdue"
            : "borrowed",
        })),
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
          "Failed to fetch member borrowing history"
      );
    }
  }
);

export const createMember = createAsyncThunk(
  "members/createMember",
  async (memberData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${API_BASE_URL}/members`,
        {
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone,
          join_date: memberData.joinDate || new Date().toISOString(),
        },
        { headers }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create member"
      );
    }
  }
);

export const updateMember = createAsyncThunk(
  "members/updateMember",
  async ({ memberId, memberData }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.patch(
        `${API_BASE_URL}/members/${memberId}`,
        {
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone,
        },
        { headers }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update member"
      );
    }
  }
);

export const deleteMember = createAsyncThunk(
  "members/deleteMember",
  async (memberId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_BASE_URL}/members/${memberId}`, { headers });
      return memberId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete member"
      );
    }
  }
);

// Slice
const membersSlice = createSlice({
  name: "members",
  initialState: {
    members: [],
    currentMember: null,
    borrowingHistory: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetCurrentMember: (state) => {
      state.currentMember = null;
    },
    clearBorrowingHistory: (state) => {
      state.borrowingHistory = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all members
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch single member
      .addCase(fetchMemberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMember = action.payload;
      })
      .addCase(fetchMemberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch member borrowing history
      .addCase(fetchMemberBorrowingHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberBorrowingHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.borrowingHistory = action.payload.history;
      })
      .addCase(fetchMemberBorrowingHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Create member
      .addCase(createMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members.push({
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          phone: action.payload.phone,
          joinDate: action.payload.join_date,
          activeBorrows: action.payload.active_borrows || 0,
        });
        state.successMessage = "Member created successfully!";
        toast.success("Member created successfully!");
      })
      .addCase(createMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Update member
      .addCase(updateMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.loading = false;
        const updatedMember = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          phone: action.payload.phone,
          joinDate: action.payload.join_date,
          activeBorrows: action.payload.active_borrows || 0,
        };
        state.members = state.members.map((member) =>
          member.id === updatedMember.id ? updatedMember : member
        );
        if (
          state.currentMember &&
          state.currentMember.id === updatedMember.id
        ) {
          state.currentMember = updatedMember;
        }
        state.successMessage = "Member updated successfully!";
        toast.success("Member updated successfully!");
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Delete member
      .addCase(deleteMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members = state.members.filter(
          (member) => member.id !== action.payload
        );
        if (state.currentMember && state.currentMember.id === action.payload) {
          state.currentMember = null;
        }
        state.successMessage = "Member deleted successfully!";
        toast.success("Member deleted successfully!");
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearMessages, resetCurrentMember, clearBorrowingHistory } =
  membersSlice.actions;

export default membersSlice.reducer;
