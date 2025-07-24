import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardData,
  clearError,
} from "../../redux/dashboard/dashboardSlice";
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
  const dashboard = useSelector((state) => state.dashboard);
  const { loading, error } = dashboard;

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (error) dispatch(clearError());
    };
  }, [error, dispatch]);

  const isAdmin = user?.role === "admin";

  // Dashboard stats cards data
  const stats = [
    {
      label: "Total Books",
      value: dashboard.totalBooks || (isAdmin ? 1250 : 0),
      icon: BookOpenIcon,
      description: isAdmin ? "All books in system" : "Available books",
    },
    {
      label: "Total Members",
      value: dashboard.totalMembers || (isAdmin ? 340 : 0),
      icon: UsersIcon,
    },
    {
      label: "Active Borrows",
      value: dashboard.activeBorrows || (isAdmin ? 89 : 0),
      icon: ArrowLeftRightIcon,
    },
    {
      label: "Overdue Books",
      value: dashboard.overdueBooks || (isAdmin ? 12 : 0),
      icon: TriangleAlertIcon,
      highlight: "text-red-600",
    },
  ];

  // Quick actions based on user role
  const quickActions = [
    { to: "/borrow-return", label: "Borrow Book", icon: ArrowLeftRightIcon },
    { to: "/borrow-return", label: "Return Book", icon: ArrowLeftRightIcon },
    { to: "/members", label: "Add Member", icon: PlusIcon },
    { to: "/books", label: "Add Book", icon: PlusIcon },
    ...(isAdmin
      ? [
          {
            to: "/genres",
            label: "Manage Genres",
            icon: SettingsIcon,
            adminOnly: true,
          },
          {
            to: "/reports",
            label: "Admin Reports",
            icon: ChartColumnIcon,
            adminOnly: true,
          },
        ]
      : []),
  ];

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-6">
        {/* Loading and Error States */}
        {loading && <p className="text-center">Loading dashboard data...</p>}

        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex items-center">
              <TriangleAlertIcon className="h-5 w-5 text-red-400 mr-3" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdmin ? "Admin Dashboard" : "Librarian Dashboard"}
            </h1>
            <RoleBadge isAdmin={isAdmin} />
          </div>
          <p className="text-gray-600">
            {isAdmin
              ? "Full system access - Manage all library operations"
              : "Standard library operations - Books, members, and borrowing"}
          </p>
        </div>

        {/* Access Card */}
        <AccessCard isAdmin={isAdmin} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              Icon={stat.icon}
              description={stat.description}
              highlight={stat.highlight}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <SectionCard
          title="Quick Actions"
          description={
            isAdmin
              ? "Administrative and library operations"
              : "Common library operations"
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionLink
                key={action.label}
                to={action.to}
                label={action.label}
                Icon={action.icon}
                isFirst={index === 0}
                isAdminAction={action.adminOnly}
              />
            ))}
          </div>
        </SectionCard>

        {/* Recent Activity */}
        <SectionCard
          title="Recent Activity"
          description={
            isAdmin
              ? "System-wide borrow and return operations"
              : "Recent borrow and return operations"
          }
        >
          <div className="space-y-4">
            {dashboard.recentActivity?.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </SectionCard>
      </div>
    </main>
  );
};

// Extracted Components for better organization

const RoleBadge = ({ isAdmin }) => (
  <div
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold text-xs",
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
);

const AccessCard = ({ isAdmin }) => (
  <div
    className={cn(
      "rounded-lg border shadow-sm",
      isAdmin ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
    )}
  >
    <div className="p-6 flex items-center space-x-3">
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
          className={cn("text-sm", isAdmin ? "text-red-700" : "text-green-700")}
        >
          {isAdmin
            ? "You have full system privileges including delete operations, genre management, and staff administration."
            : "You can manage books and members, handle borrowing operations, and view reports. Contact admin for advanced operations."}
        </p>
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value, Icon, description, highlight }) => (
  <div className="rounded-lg border border-primary/10 bg-white text-card-foreground shadow-sm">
    <div className="p-6 flex justify-between items-center pb-2">
      <div className="text-sm font-medium">{label}</div>
      <Icon
        className={cn(
          "h-4 w-4 text-muted-foreground",
          label.includes("Overdue") && "text-red-500"
        )}
      />
    </div>
    <div className="p-6 pt-0">
      <div className={cn("text-2xl font-bold", highlight)}>{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  </div>
);

const SectionCard = ({ title, description, children }) => (
  <div className="rounded-lg border border-primary/10 bg-white text-card-foreground shadow-sm">
    <div className="flex flex-col space-y-1.5 p-6">
      <h2 className="text-2xl font-semibold leading-none tracking-tight">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <div className="p-6 pt-0">{children}</div>
  </div>
);

const QuickActionLink = ({ to, label, Icon, isFirst, isAdminAction }) => (
  <Link
    to={to}
    className={cn(
      "flex flex-col items-center justify-center p-4 rounded-md text-sm font-medium transition-colors space-y-2",
      isFirst
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "border border-primary/10 border-input hover:bg-accent hover:text-accent-foreground bg-transparent",
      isAdminAction && "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
    )}
  >
    <Icon className="h-6 w-6" />
    <span>{label}</span>
  </Link>
);

const ActivityItem = ({ activity }) => (
  <div className="flex items-center space-x-4 p-3 bg-primary/2 rounded-lg">
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
);

export default MainContent;
