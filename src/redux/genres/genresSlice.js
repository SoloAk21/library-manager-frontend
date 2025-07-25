import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

// Async Thunks
export const fetchGenres = createAsyncThunk(
  "genres/fetchGenres",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_BASE_URL}/genres`, { headers });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch genres"
      );
    }
  }
);

export const fetchGenreById = createAsyncThunk(
  "genres/fetchGenreById",
  async (genreId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_BASE_URL}/genres/${genreId}`, {
        headers,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch genre details"
      );
    }
  }
);

export const createGenre = createAsyncThunk(
  "genres/createGenre",
  async (genreData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${API_BASE_URL}/genres`,
        { name: genreData.name },
        { headers }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create genre"
      );
    }
  }
);

export const updateGenre = createAsyncThunk(
  "genres/updateGenre",
  async ({ genreId, genreData }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.patch(
        `${API_BASE_URL}/genres/${genreId}`,
        { name: genreData.name },
        { headers }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update genre"
      );
    }
  }
);

export const deleteGenre = createAsyncThunk(
  "genres/deleteGenre",
  async (genreId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_BASE_URL}/genres/${genreId}`, { headers });
      return genreId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete genre"
      );
    }
  }
);

// Slice
const genresSlice = createSlice({
  name: "genres",
  initialState: {
    genres: [],
    currentGenre: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetCurrentGenre: (state) => {
      state.currentGenre = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all genres
      .addCase(fetchGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.genres = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single genre
      .addCase(fetchGenreById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenreById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGenre = action.payload;
      })
      .addCase(fetchGenreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create genre
      .addCase(createGenre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGenre.fulfilled, (state, action) => {
        state.loading = false;
        state.genres.push(action.payload);
        state.successMessage = "Genre created successfully!";
      })
      .addCase(createGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update genre
      .addCase(updateGenre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGenre.fulfilled, (state, action) => {
        state.loading = false;
        const updatedGenre = action.payload;
        state.genres = state.genres.map((genre) =>
          genre.id === updatedGenre.id ? updatedGenre : genre
        );
        if (state.currentGenre && state.currentGenre.id === updatedGenre.id) {
          state.currentGenre = updatedGenre;
        }
        state.successMessage = "Genre updated successfully!";
      })
      .addCase(updateGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete genre
      .addCase(deleteGenre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGenre.fulfilled, (state, action) => {
        state.loading = false;
        state.genres = state.genres.filter(
          (genre) => genre.id !== action.payload
        );
        if (state.currentGenre && state.currentGenre.id === action.payload) {
          state.currentGenre = null;
        }
        state.successMessage = "Genre deleted successfully!";
      })
      .addCase(deleteGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages, resetCurrentGenre } = genresSlice.actions;

export default genresSlice.reducer;
