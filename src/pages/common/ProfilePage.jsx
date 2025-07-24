import React from "react";
import { useSelector } from "react-redux";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  ShieldIcon,
  BookIcon,
  UsersIcon,
  FileTextIcon,
  Trash2Icon,
  SettingsIcon,
} from "../../components/ui/icons";
import Badge from "../../components/ui/Badge";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  // Role-specific configurations
  const roleConfig = {
    admin: {
      badgeVariant: "destructive",
      badgeLabel: "ADMIN",
      colorClass: "text-green-600",
      bgColorClass: "bg-green-100",
      iconColorClass: "text-green-600",
      permissions: [
        {
          label: "Full system administration access",
          icon: SettingsIcon,
          granted: true,
        },
        {
          label: "Manage all books, members, and genres",
          icon: BookIcon,
          granted: true,
        },
        {
          label: "Delete records and manage staff",
          icon: Trash2Icon,
          granted: true,
        },
        {
          label: "Access all reports and analytics",
          icon: FileTextIcon,
          granted: true,
        },
      ],
      additionalInfo: {
        phone: "(555) 123-4567",
      },
    },
    librarian: {
      badgeVariant: "primary",
      badgeLabel: "LIBRARIAN",
      colorClass: "text-blue-600",
      bgColorClass: "bg-blue-100",
      iconColorClass: "text-blue-600",
      permissions: [
        { label: "Manage books and members", icon: BookIcon, granted: true },
        {
          label: "Handle borrow/return operations",
          icon: UsersIcon,
          granted: true,
        },
        { label: "View basic reports", icon: FileTextIcon, granted: true },
        {
          label: "Cannot delete records or manage genres",
          icon: Trash2Icon,
          granted: false,
        },
      ],
      additionalInfo: {
        phone: "(555) 987-6543",
      },
    },
  };

  const currentRoleConfig =
    roleConfig[user?.role?.toLowerCase()] || roleConfig.librarian;

  // User information items
  const infoItems = [
    {
      label: "Username",
      value: user?.username || currentRoleConfig.badgeLabel.toLowerCase(),
      icon: UserIcon,
    },
    {
      label: "Email Address",
      value:
        user?.email ||
        `${currentRoleConfig.badgeLabel.toLowerCase()}@library.com`,
      icon: MailIcon,
    },
    {
      label: "Phone Number",
      value: currentRoleConfig.additionalInfo.phone,
      icon: PhoneIcon,
    },
    {
      label: "Role",
      value: user?.role || currentRoleConfig.badgeLabel,
      icon: ShieldIcon,
    },
    {
      label: "Member Since",
      value: new Date(user?.createdAt || new Date()).toLocaleDateString(
        "en-US",
        { month: "long", year: "numeric" }
      ),
      icon: CalendarIcon,
    },
  ];

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">
            View your account information and permissions
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-lg border border-primary/10 bg-white shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center space-x-4">
              <div
                className={`h-16 w-16 ${currentRoleConfig.bgColorClass} rounded-full flex items-center justify-center`}
              >
                <UserIcon
                  className={`h-8 w-8 ${currentRoleConfig.iconColorClass}`}
                />
              </div>
              <div>
                <div className="font-semibold text-xl">
                  {user?.username || currentRoleConfig.badgeLabel.toLowerCase()}
                </div>
                <Badge variant={currentRoleConfig.badgeVariant}>
                  {currentRoleConfig.badgeLabel}
                </Badge>
              </div>
            </div>
          </div>

          <div className="p-6 pt-0 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid gap-4">
                {infoItems.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center p-3 bg-gray-50 rounded-md"
                  >
                    <Icon className="mr-3 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {label}
                      </p>
                      <p className="text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Card */}
        <div className="rounded-lg border border-primary/10 bg-white shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-2xl font-semibold">Permissions & Access</h2>
            <p className="text-sm text-gray-500">
              Your current role permissions
            </p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-3">
              {currentRoleConfig.permissions.map(
                ({ label, granted, icon: Icon }) => (
                  <div
                    key={label}
                    className={
                      granted
                        ? `flex items-center ${currentRoleConfig.colorClass}`
                        : "flex items-center text-gray-400"
                    }
                  >
                    <Icon
                      className={`mr-2 h-4 w-4 ${
                        granted
                          ? currentRoleConfig.iconColorClass
                          : "text-gray-400"
                      }`}
                    />
                    <span className="text-sm">{label}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
