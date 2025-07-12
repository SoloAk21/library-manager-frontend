import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import MainContent from "./pages/MainContent";
import BooksPage from "./pages/BooksPage";
import BorrowRecordsPage from "./pages/BorrowRecordsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        >
          <Route index element={<MainContent />} />
          <Route path="borrow-return" element={<BorrowRecordsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="members" element={<div>Members Page</div>} />
        </Route>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
