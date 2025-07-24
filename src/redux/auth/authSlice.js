import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/auth";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, credentials);
      return res.data;
    } catch (err) {
      let errorMessage = "Login failed";

      if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMessage = err.response.data.message.join("\n");
        } else {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/signup`, data);
      return res.data;
    } catch (err) {
      let errorMessage = "Signup failed";

      if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMessage = err.response.data.message.join("\n");
        } else {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      let errorMessage = "Failed to fetch profile";

      if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMessage = err.response.data.message.join("\n");
        } else {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found");
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      let errorMessage = "Failed to fetch users";

      if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMessage = err.response.data.message.join("\n");
        } else {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser || null,
    token: storedToken || null,
    users: [],
    loading: false,
    error: null,
    successMessage: null,
    isAuthenticated: !!storedToken,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.users = [];
      state.error = null;
      state.successMessage = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        state.successMessage = "Login successful!";
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Account created successfully!";
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearMessages } = authSlice.actions;

export default authSlice.reducer;
