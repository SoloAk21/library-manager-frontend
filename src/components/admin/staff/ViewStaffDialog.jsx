import React from "react";
import Dialog from "../../common/Dialog";
import Badge from "../../ui/Badge";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  ShieldIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "../../ui/icons";

const ViewStaffDialog = ({ isOpen, onClose, staff }) => {
  const getRoleBadgeProps = (role) => ({
    variant: role === "admin" ? "destructive" : "default",
    text: role === "admin" ? "Admin" : "Librarian",
  });

  const getStatusBadgeProps = (isActive) => ({
    variant: isActive ? "primary" : "secondary",
    text: isActive ? "Active" : "Inactive",
  });

  if (!staff) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={staff.username}
      description="Staff member details"
    >
      <div className="grid gap-4 py-4">
        <div className="flex items-center gap-4">
          <UserIcon className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <span className="font-medium">Username:</span>
            <span className="ml-2">{staff.username}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <MailIcon className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <span className="font-medium">Email:</span>
            <span className="ml-2">{staff.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <PhoneIcon className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <span className="font-medium">Phone:</span>
            <span className="ml-2">{staff.phone || "Not provided"}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ShieldIcon className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <span className="font-medium">Role:</span>
            <span className="ml-2">
              <Badge {...getRoleBadgeProps(staff.role)}>
                {getRoleBadgeProps(staff.role).text}
              </Badge>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {staff.isActive ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          ) : (
            <XCircleIcon className="h-5 w-5 text-gray-500" />
          )}
          <div className="flex-1">
            <span className="font-medium">Status:</span>
            <span className="ml-2">
              <Badge {...getStatusBadgeProps(staff.isActive)}>
                {getStatusBadgeProps(staff.isActive).text}
              </Badge>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <span className="font-medium">Member since:</span>
            <span className="ml-2">
              {new Date(staff.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Close
        </button>
      </div>
    </Dialog>
  );
};

export default ViewStaffDialog;
