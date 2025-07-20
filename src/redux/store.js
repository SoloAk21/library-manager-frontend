import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import dashboardReducer from "./dashboard/dashboardSlice";
import borrowRecordsReducer from "./borrowRecords/borrowRecordsSlice";
import booksReducer from "./books/booksSlice";
import genresReducer from "./genres/genresSlice";
import membersReducer from "./members/membersSlice";
import staffReducer from "./staff/staffSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    borrowRecords: borrowRecordsReducer,
    books: booksReducer,
    genres: genresReducer,
    members: membersReducer,
    staff: staffReducer,
  },
});

export default store;
