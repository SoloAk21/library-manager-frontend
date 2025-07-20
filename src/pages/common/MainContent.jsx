import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardData,
  clearError,
} from "../../redux/dashboard/dashboardSlice";
import toast from "react-hot-toast";
import Badge from "../../components/ui/Badge";
import {
  UserIcon,
  UsersIcon,
  BookOpenIcon,
  ArrowLeftRightIcon,
  TriangleAlertIcon,
  PlusIcon,
  ShieldIcon,
  SettingsIcon,
  ChartColumnIcon,
} from "../../components/ui/icons";
import { cn } from "../../utils/cn";

const MainContent = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    totalBooks,
    totalMembers,
    activeBorrows,
    overdueBooks,
    recentActivity,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const quickActions =
    user?.role === "admin"
      ? [
          {
            to: "/borrow-return",
            label: "Borrow Book",
            icon: ArrowLeftRightIcon,
          },
          {
            to: "/borrow-return",
            label: "Return Book",
            icon: ArrowLeftRightIcon,
          },
          { to: "/members", label: "Add Member", icon: PlusIcon },
          { to: "/books", label: "Add Book", icon: PlusIcon },
          { to: "/genres", label: "Manage Genres", icon: SettingsIcon },
          { to: "/reports", label: "Admin Reports", icon: ChartColumnIcon },
        ]
      : [
          {
            to: "/borrow-return",
            label: "Borrow Book",
            icon: ArrowLeftRightIcon,
          },
          {
            to: "/borrow-return",
            label: "Return Book",
            icon: ArrowLeftRightIcon,
          },
          { to: "/members", label: "Add Member", icon: PlusIcon },
          { to: "/books", label: "Add Book", icon: PlusIcon },
        ];

  const isAdmin = user?.role === "admin";

  return (
    <main className="flex-1 overflow-auto p-6">
      {loading && <p className="text-center">Loading dashboard data...</p>}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {isAdmin ? "Admin Dashboard" : "Librarian Dashboard"}
              </h1>
              <div
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-xs",
                  isAdmin
                    ? "border-transparent bg-red-600 text-white hover:bg-red-700"
                    : "border-transparent bg-green-600 text-white"
                )}
              >
                {isAdmin ? (
                  <>
                    <ShieldIcon className="w-3 h-3 mr-1" />
                    ADMINISTRATOR
                  </>
                ) : (
                  <>
                    <UserIcon className="w-3 h-3 mr-1" />
                    LIBRARIAN
                  </>
                )}
              </div>
            </div>
            <p className="text-gray-600">
              {isAdmin
                ? "Full system access - Manage all library operations"
                : "Standard library operations - Books, members, and borrowing"}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "rounded-lg border shadow-sm",
            isAdmin
              ? "border-red-200 bg-red-50 text-card-foreground"
              : "border-green-200 bg-green-50"
          )}
        >
          <div className="p-6 pt-6">
            <div className="flex items-center space-x-3">
              {isAdmin ? (
                <ShieldIcon className="h-8 w-8 text-red-600" />
              ) : (
                <UserIcon className="h-8 w-8 text-green-600" />
              )}
              <div>
                <h3
                  className={cn(
                    "font-semibold",
                    isAdmin ? "text-red-900" : "text-green-900"
                  )}
                >
                  {isAdmin ? "Administrator Access" : "Librarian Access"}
                </h3>
                <p
                  className={cn(
                    "text-sm",
                    isAdmin ? "text-red-700" : "text-green-700"
                  )}
                >
                  {isAdmin
                    ? "You have full system privileges including delete operations, genre management, and staff administration."
                    : "You can manage books and members, handle borrowing operations, and view reports. Contact admin for advanced operations."}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="tracking-tight text-sm font-medium">
                Total Books
              </div>
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">
                {totalBooks || (isAdmin ? 1250 : 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? "All books in system" : "Available books"}
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="tracking-tight text-sm font-medium">
                Total Members
              </div>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">
                {totalMembers || (isAdmin ? 340 : 0)}
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="tracking-tight text-sm font-medium">
                Active Borrows
              </div>
              <ArrowLeftRightIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">
                {activeBorrows || (isAdmin ? 89 : 0)}
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="tracking-tight text-sm font-medium">
                Overdue Books
              </div>
              <TriangleAlertIcon className="h-4 w-4 text-red-500" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold text-red-600">
                {overdueBooks || (isAdmin ? 12 : 0)}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="text-2xl font-semibold leading-none tracking-tight">
              Quick Actions
            </div>
            <div className="text-sm text-muted-foreground">
              {isAdmin
                ? "Administrative and library operations"
                : "Common library operations"}
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map(({ to, label, icon: Icon }, index) => (
                <Link
                  key={label}
                  to={to}
                  className={cn(
                    "justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-auto p-4 flex flex-col items-center space-y-2",
                    index === 0
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-input hover:bg-accent hover:text-accent-foreground bg-transparent",
                    isAdmin &&
                      index > 3 &&
                      "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="text-2xl font-semibold leading-none tracking-tight">
              Recent Activity
            </div>
            <div className="text-sm text-muted-foreground">
              {isAdmin
                ? "System-wide borrow and return operations"
                : "Recent borrow and return operations"}
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      activity.action === "Borrowed"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    )}
                  >
                    <ArrowLeftRightIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.action}: {activity.bookTitle}
                    </p>
                    <p className="text-xs text-gray-500">
                      Member: {activity.memberName} •{" "}
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
