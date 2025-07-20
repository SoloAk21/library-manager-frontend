import React, { useEffect, useState, useRef, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import LibrarianSidebar from "../../components/common/sidebar/LibrarianSidebar";
import AdminSidebar from "../../components/common/sidebar/AdminSidebar";
import Header from "../../components/common/Header";
import { cn } from "../../utils/cn";

const DashboardPage = React.memo(() => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  const SidebarComponent =
    user?.role === "admin" ? AdminSidebar : LibrarianSidebar;

  return (
    <div className={cn("flex h-screen bg-gray-50")}>
      <SidebarComponent
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        sidebarRef={sidebarRef}
        hamburgerRef={hamburgerRef}
      />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header />
        <Outlet />
      </div>
    </div>
  );
});

export default DashboardPage;
