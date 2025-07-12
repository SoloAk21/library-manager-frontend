import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:3000";

// Async Thunks
export const fetchBorrowRecords = createAsyncThunk(
  "borrowRecords/fetchBorrowRecords",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_BASE_URL}/borrow-records`, {
        headers,
      });
      return response.data.map((record) => ({
        id: record.id,
        bookId: record.book_id,
        bookTitle: record.book?.title || "Unknown Book",
        memberId: record.member_id,
        memberName: record.member?.name || "Unknown Member",
        borrowDate: record.borrow_date,
        dueDate: record.due_date,
        returnDate: record.return_date,
        status: record.return_date
          ? "returned"
          : new Date(record.due_date) < new Date()
          ? "overdue"
          : "borrowed",
      }));
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch borrow records"
      );
    }
  }
);

export const fetchBorrowRecordById = createAsyncThunk(
  "borrowRecords/fetchBorrowRecordById",
  async (recordId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${API_BASE_URL}/borrow-records/${recordId}`,
        { headers }
      );
      return {
        id: response.data.id,
        bookId: response.data.book_id,
        bookTitle: response.data.book?.title || "Unknown Book",
        memberId: response.data.member_id,
        memberName: response.data.member?.name || "Unknown Member",
        borrowDate: response.data.borrow_date,
        dueDate: response.data.due_date,
        returnDate: response.data.return_date,
        status: response.data.return_date
          ? "returned"
          : new Date(response.data.due_date) < new Date()
          ? "overdue"
          : "borrowed",
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch borrow record"
      );
    }
  }
);

export const borrowBook = createAsyncThunk(
  "borrowRecords/borrowBook",
  async ({ bookId, memberId, dueDate }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${API_BASE_URL}/borrow-records/borrow`,
        {
          book_id: bookId,
          member_id: memberId,
          due_date: dueDate,
        },
        { headers }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to borrow book"
      );
    }
  }
);

export const returnBook = createAsyncThunk(
  "borrowRecords/returnBook",
  async (borrowRecordId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${API_BASE_URL}/borrow-records/return`,
        {
          borrow_record_id: borrowRecordId,
        },
        { headers }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to return book"
      );
    }
  }
);

export const fetchOverdueBooks = createAsyncThunk(
  "borrowRecords/fetchOverdueBooks",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${API_BASE_URL}/borrow-records/reports/overdue`,
        { headers }
      );
      return response.data.map((record) => ({
        id: record.id,
        bookId: record.book_id,
        bookTitle: record.book?.title || "Unknown Book",
        memberId: record.member_id,
        memberName: record.member?.name || "Unknown Member",
        borrowDate: record.borrow_date,
        dueDate: record.due_date,
        daysOverdue: Math.floor(
          (new Date() - new Date(record.due_date)) / (1000 * 60 * 60 * 24)
        ),
      }));
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch overdue books"
      );
    }
  }
);

export const fetchPopularGenres = createAsyncThunk(
  "borrowRecords/fetchPopularGenres",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${API_BASE_URL}/borrow-records/reports/popular-genres`,
        { headers }
      );
      return response.data.map((genre) => ({
        id: genre.id,
        name: genre.name,
        borrowCount: genre.borrow_count,
      }));
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch popular genres"
      );
    }
  }
);

export const fetchAnalyticsSummary = createAsyncThunk(
  "borrowRecords/fetchAnalyticsSummary",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${API_BASE_URL}/borrow-records/reports/summary`,
        { headers }
      );
      return {
        totalBorrows: response.data.total_borrows,
        avgDuration: response.data.avg_duration,
        returnRate: response.data.return_rate,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch analytics summary"
      );
    }
  }
);

// Slice
const borrowRecordsSlice = createSlice({
  name: "borrowRecords",
  initialState: {
    records: [],
    currentRecord: null,
    overdueBooks: [],
    popularGenres: [],
    analyticsSummary: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetCurrentRecord: (state) => {
      state.currentRecord = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all records
      .addCase(fetchBorrowRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBorrowRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchBorrowRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch single record
      .addCase(fetchBorrowRecordById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBorrowRecordById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecord = action.payload;
      })
      .addCase(fetchBorrowRecordById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Borrow book
      .addCase(borrowBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(borrowBook.fulfilled, (state, action) => {
        state.loading = false;
        state.records.push({
          id: action.payload.id,
          bookId: action.payload.book_id,
          bookTitle: action.payload.book?.title || "Unknown Book",
          memberId: action.payload.member_id,
          memberName: action.payload.member?.name || "Unknown Member",
          borrowDate: action.payload.borrow_date,
          dueDate: action.payload.due_date,
          returnDate: null,
          status: "borrowed",
        });
        state.successMessage = "Book borrowed successfully!";
        toast.success("Book borrowed successfully!");
      })
      .addCase(borrowBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Return book
      .addCase(returnBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(returnBook.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRecord = {
          id: action.payload.id,
          bookId: action.payload.book_id,
          bookTitle: action.payload.book?.title || "Unknown Book",
          memberId: action.payload.member_id,
          memberName: action.payload.member?.name || "Unknown Member",
          borrowDate: action.payload.borrow_date,
          dueDate: action.payload.due_date,
          returnDate: action.payload.return_date,
          status: "returned",
        };
        state.records = state.records.map((record) =>
          record.id === updatedRecord.id ? updatedRecord : record
        );
        if (
          state.currentRecord &&
          state.currentRecord.id === updatedRecord.id
        ) {
          state.currentRecord = updatedRecord;
        }
        state.successMessage = "Book returned successfully!";
        toast.success("Book returned successfully!");
      })
      .addCase(returnBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch overdue books
      .addCase(fetchOverdueBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverdueBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.overdueBooks = action.payload;
      })
      .addCase(fetchOverdueBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch popular genres
      .addCase(fetchPopularGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.popularGenres = action.payload;
      })
      .addCase(fetchPopularGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch analytics summary
      .addCase(fetchAnalyticsSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsSummary = action.payload;
      })
      .addCase(fetchAnalyticsSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearMessages, resetCurrentRecord } = borrowRecordsSlice.actions;

export default borrowRecordsSlice.reducer;
