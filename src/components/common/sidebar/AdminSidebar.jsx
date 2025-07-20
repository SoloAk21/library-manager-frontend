import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../Sidebar";
import {
  HouseIcon,
  BookOpenIcon,
  ArrowLeftRightIcon,
  UsersIcon,
  UserCogIcon,
  ChartColumnIcon,
  TagIcon,
} from "../../ui/icons";

const AdminSidebar = ({
  isSidebarOpen,
  toggleSidebar,
  sidebarRef,
  hamburgerRef,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth.user || { role: "" });
  const navItems = [
    {
      path: "/dashboard",
      icon: <HouseIcon className="mr-3 h-5 w-5" />,
      label: "Dashboard",
    },
    {
      path: "/books",
      icon: <BookOpenIcon className="mr-3 h-5 w-5" />,
      label: "Books",
    },
    {
      path: "/borrow-return",
      icon: <ArrowLeftRightIcon className="mr-3 h-5 w-5" />,
      label: "Borrow/Return",
    },
    {
      path: "/members",
      icon: <UsersIcon className="mr-3 h-5 w-5" />,
      label: "Members",
    },
    {
      path: "/staff",
      icon: <UserCogIcon className="mr-3 h-5 w-5" />,
      label: "Staff",
    },
    {
      path: "/reports",
      icon: <ChartColumnIcon className="mr-3 h-5 w-5" />,
      label: "Reports",
    },
    {
      path: "/genres",
      icon: <TagIcon className="mr-3 h-5 w-5" />,
      label: "Genres",
    },
  ];

  React.useEffect(() => {
    if (role !== "admin") {
      navigate("/dashboard"); // Redirect to default page if role mismatch
    }
  }, [role, navigate]);

  if (role !== "admin") return null;

  return (
    <Sidebar
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
      sidebarRef={sidebarRef}
      hamburgerRef={hamburgerRef}
      navItems={navItems}
    />
  );
};

export default AdminSidebar;
