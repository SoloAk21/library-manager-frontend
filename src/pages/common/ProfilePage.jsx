import React from "react";
import { useSelector } from "react-redux";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
} from "../../components/ui/icons";
import Badge from "../../components/ui/Badge";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  const infoItems = [
    { label: "Username", value: user?.username || "librarian", icon: UserIcon },
    {
      label: "Email Address",
      value: user?.email || "librarian@library.com",
      icon: MailIcon,
    },
    { label: "Phone Number", value: "(251) 987-6543", icon: PhoneIcon },
    { label: "Role", value: user?.role || "Librarian", icon: UserIcon },
    { label: "Member Since", value: "January 2024", icon: CalendarIcon },
  ];

  const permissions = [
    { label: "Manage books and members", granted: true },
    { label: "Handle borrow/return operations", granted: true },
    { label: "View basic reports", granted: true },
    { label: "Cannot delete records or manage genres", granted: false },
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
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-xl">librarian</div>
                <Badge variant="primary">LIBRARIAN</Badge>
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
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-2xl font-semibold">Permissions & Access</h2>
            <p className="text-sm text-gray-500">
              Your current role permissions
            </p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-3">
              {permissions.map(({ label, granted }) => (
                <div
                  key={label}
                  className={
                    granted
                      ? "flex items-center text-blue-600"
                      : "flex items-center text-gray-400"
                  }
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
