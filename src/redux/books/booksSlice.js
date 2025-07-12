import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:3000";

// Async Thunks
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_BASE_URL}/books`, { headers });
      return response.data.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        publishedYear: book.published_year,
        availableCopies: book.available_copies,
        genreId: book.genre_id,
        genre: book.genre?.name || "Unknown Genre",
      }));
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch books"
      );
    }
  }
);

export const fetchBookById = createAsyncThunk(
  "books/fetchBookById",
  async (bookId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_BASE_URL}/books/${bookId}`, {
        headers,
      });
      return {
        id: response.data.id,
        title: response.data.title,
        author: response.data.author,
        publishedYear: response.data.published_year,
        availableCopies: response.data.available_copies,
        genreId: response.data.genre_id,
        genre: response.data.genre?.name || "Unknown Genre",
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch book details"
      );
    }
  }
);

export const createBook = createAsyncThunk(
  "books/createBook",
  async (bookData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${API_BASE_URL}/books`,
        {
          title: bookData.title,
          author: bookData.author,
          published_year: bookData.publishedYear,
          available_copies: bookData.availableCopies,
          genre_id: bookData.genreId,
        },
        { headers }
      );

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create book"
      );
    }
  }
);

export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ bookId, bookData }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.patch(
        `${API_BASE_URL}/books/${bookId}`,
        {
          title: bookData.title,
          author: bookData.author,
          published_year: bookData.publishedYear,
          available_copies: bookData.availableCopies,
          genre_id: bookData.genreId,
        },
        { headers }
      );

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update book"
      );
    }
  }
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (bookId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_BASE_URL}/books/${bookId}`, { headers });
      return bookId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete book"
      );
    }
  }
);

// Slice
const booksSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    currentBook: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetCurrentBook: (state) => {
      state.currentBook = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch single book
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Create book
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push({
          id: action.payload.id,
          title: action.payload.title,
          author: action.payload.author,
          publishedYear: action.payload.published_year,
          availableCopies: action.payload.available_copies,
          genreId: action.payload.genre_id,
          genre: action.payload.genre?.name || "Unknown Genre",
        });
        state.successMessage = "Book created successfully!";
        toast.success("Book created successfully!");
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Update book
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBook = {
          id: action.payload.id,
          title: action.payload.title,
          author: action.payload.author,
          publishedYear: action.payload.published_year,
          availableCopies: action.payload.available_copies,
          genreId: action.payload.genre_id,
          genre: action.payload.genre?.name || "Unknown Genre",
        };
        state.books = state.books.map((book) =>
          book.id === updatedBook.id ? updatedBook : book
        );
        if (state.currentBook && state.currentBook.id === updatedBook.id) {
          state.currentBook = updatedBook;
        }
        state.successMessage = "Book updated successfully!";
        toast.success("Book updated successfully!");
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Delete book
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter((book) => book.id !== action.payload);
        if (state.currentBook && state.currentBook.id === action.payload) {
          state.currentBook = null;
        }
        state.successMessage = "Book deleted successfully!";
        toast.success("Book deleted successfully!");
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearMessages, resetCurrentBook } = booksSlice.actions;

export default booksSlice.reducer;
