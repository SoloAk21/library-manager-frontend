import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/auth/authSlice";
import { UserIcon, LogOutIcon } from "../ui/icons";
import { cn } from "../../utils/cn";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get first letter of user's username or default to 'L' for librarian
  const userInitial = user?.username?.charAt(0).toUpperCase() || "L";
  console.log("user:", user); // Debugging line

  return (
    <header className="bg-white border-b border-primary/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1" />
        <div className="relative flex" ref={menuRef}>
          <div className="px-4 py-2 text-sm text-gray-700">
            Welcome, {user?.username || "librarian"}
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            id="user-menu-button"
          >
            <span className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
              {userInitial}
            </span>
          </button>
          {isMenuOpen && (
            <div
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              className="z-50 bg-white min-w-[8rem] overflow-hidden rounded-md border border-primary/10 bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 w-56 absolute right-0 mt-2"
            >
              <div className="px-2 py-1.5 text-sm font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.username || "librarian"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.role || "librarian"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleProfile}
                role="menuitem"
                className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full"
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </button>

              <button
                onClick={handleLogout}
                role="menuitem"
                className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full"
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
