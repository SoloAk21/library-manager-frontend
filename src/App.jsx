import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/common/LoginPage";
import SignupPage from "./pages/common/SignupPage";
import PrivateRoute from "./components/common/PrivateRoute";
import DashboardPage from "./pages/common/DashboardPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import ManageGenresPage from "./pages/admin/ManageGenresPage";
import MainContent from "./pages/common/MainContent";
import BorrowRecordsPage from "./pages/common/BorrowRecordsPage";
import ProfilePage from "./pages/common/ProfilePage";
import { useSelector } from "react-redux";
import MembersPage from "./pages/admin/MembersPage";
import StaffPage from "./pages/admin/StaffPage";
import BooksPage from "./pages/common/BooksPage";

function App() {
  const { user } = useSelector((state) => state.auth);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<MainContent />} />
          <Route path="borrow-return" element={<BorrowRecordsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="genres" element={<ManageGenresPage />} />
          <Route path="staff" element={<StaffPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
