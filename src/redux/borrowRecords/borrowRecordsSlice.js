import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_BASE_URL = "http://localhost:3000";

export const fetchBorrowRecords = createAsyncThunk(
  "borrowRecords/fetchBorrowRecords",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue("No authentication token found");
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
        bookAuthor: record.book?.author || "Unknown Author",
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
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch borrow records"
      );
    }
  }
);

export const fetchBorrowRecordById = createAsyncThunk(
  "borrowRecords/fetchBorrowRecordById",
  async (recordId, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue("No authentication token found");
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
        bookAuthor: response.data.book?.author || "Unknown Author",
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
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch borrow record"
      );
    }
  }
);

export const borrowBook = createAsyncThunk(
  "borrowRecords/borrowBook",
  async ({ bookId, memberId, dueDate }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${API_BASE_URL}/borrow-records/borrow`,
        { book_id: bookId, member_id: memberId, due_date: dueDate },
        { headers }
      );
      return {
        id: response.data.id,
        bookId: response.data.book_id,
        bookTitle: response.data.book?.title || "Unknown Book",
        bookAuthor: response.data.book?.author || "Unknown Author",
        memberId: response.data.member_id,
        memberName: response.data.member?.name || "Unknown Member",
        borrowDate: response.data.borrow_date,
        dueDate: response.data.due_date,
        returnDate: null,
        status: "borrowed",
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to borrow book"
      );
    }
  }
);

export const returnBook = createAsyncThunk(
  "borrowRecords/returnBook",
  async (borrowRecordId, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${API_BASE_URL}/borrow-records/return`,
        { borrow_record_id: borrowRecordId },
        { headers }
      );
      return {
        id: response.data.id,
        bookId: response.data.book_id,
        bookTitle: response.data.book?.title || "Unknown Book",
        bookAuthor: response.data.book?.author || "Unknown Author",
        memberId: response.data.member_id,
        memberName: response.data.member?.name || "Unknown Member",
        borrowDate: response.data.borrow_date,
        dueDate: response.data.due_date,
        returnDate: response.data.return_date,
        status: "returned",
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to return book"
      );
    }
  }
);

export const fetchOverdueBooks = createAsyncThunk(
  "borrowRecords/fetchOverdueBooks",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue("No authentication token found");
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
        bookAuthor: record.book?.author || "Unknown Author",
        memberId: record.member_id,
        memberName: record.member?.name || "Unknown Member",
        borrowDate: record.borrow_date,
        dueDate: record.due_date,
        daysOverdue: Math.floor(
          (new Date() - new Date(record.due_date)) / (1000 * 60 * 60 * 24)
        ),
      }));
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch overdue books"
      );
    }
  }
);

export const fetchPopularGenres = createAsyncThunk(
  "borrowRecords/fetchPopularGenres",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue("No authentication token found");
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
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch popular genres"
      );
    }
  }
);

export const fetchAnalyticsSummary = createAsyncThunk(
  "borrowRecords/fetchAnalyticsSummary",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue("No authentication token found");
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
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch analytics summary"
      );
    }
  }
);

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
      })

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
      })

      .addCase(borrowBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(borrowBook.fulfilled, (state, action) => {
        state.loading = false;
        state.records = [...state.records, action.payload];
        state.successMessage = "Book borrowed successfully!";
      })
      .addCase(borrowBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(returnBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(returnBook.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.map((record) =>
          record.id === action.payload.id ? action.payload : record
        );
        if (
          state.currentRecord &&
          state.currentRecord.id === action.payload.id
        ) {
          state.currentRecord = action.payload;
        }
        state.successMessage = "Book returned successfully!";
      })
      .addCase(returnBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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
      })

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
      })

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
      });
  },
});

export const { clearMessages, resetCurrentRecord } = borrowRecordsSlice.actions;

export default borrowRecordsSlice.reducer;
