import React, { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuIcon, XIcon } from "../ui/icons";

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  sidebarRef,
  hamburgerRef,
  navItems,
}) => {
  const location = useLocation();
  console.log("Sidebar rendered with navItems:", navItems);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        ref={hamburgerRef}
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 inline-flex items-center justify-center h-10 w-10 rounded-md bg-transparent hover:bg-gray-100"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <XIcon className="h-6 w-6" />
        ) : (
          <MenuIcon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-primary/10 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 ml-4 border-b border-primary/10">
            <h1 className="text-xl font-bold text-gray-900">Library Manager</h1>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {(navItems || []).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={toggleSidebar}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
