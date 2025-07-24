import React from "react";
import Dialog from "../../common/Dialog";
import Badge from "../../ui/Badge";
import {
  CalendarIcon,
  EmailIcon,
  PhoneIcon,
  UserIcon,
  ShieldIcon,
} from "../../ui/icons";

const ViewStaffDialog = ({ isOpen, onClose, staff }) => {
  if (!staff) return null;

  const getStatusProps = (isActive) => ({
    variant: isActive ? "primary" : "secondary",
    text: isActive ? "ACTIVE" : "INACTIVE",
  });

  const getRoleProps = (role) => ({
    variant: role === "admin" ? "destructive" : "primary",
    text: role === "admin" ? "ADMIN" : "LIBRARIAN",
  });

  // Static data mapping based on staff role
  const staticData = {
    librarian: {
      phone: "(555) 987-6543",
      createdAt: new Date("2024-01-15"),
    },
    admin: {
      phone: "(555) 123-4567",
      createdAt: new Date("2024-01-01"),
    },
  };

  const staffData = {
    ...staff,
    phone: staticData[staff.role]?.phone || "N/A",
    createdAt: staticData[staff.role]?.createdAt || staff.createdAt,
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={staffData.username || "Staff Details"}
      description="Staff Member Details"
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Username:</span>
          <span className="col-span-2 flex items-center">
            <UserIcon className="h-4 w-4 mr-2" />
            {staffData.username || "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Email:</span>
          <span className="col-span-2 flex items-center">
            <EmailIcon className="h-4 w-4 mr-2" />
            {staffData.email || "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Phone:</span>
          <span className="col-span-2 flex items-center">
            <PhoneIcon className="h-4 w-4 mr-2" />
            {staffData.phone || "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Role:</span>
          <span className="col-span-2 flex items-center">
            {staffData.role === "admin" ? (
              <ShieldIcon className="h-4 w-4 mr-2" />
            ) : (
              <UserIcon className="h-4 w-4 mr-2" />
            )}
            <Badge {...getRoleProps(staffData.role)}>
              {getRoleProps(staffData.role).text}
            </Badge>
          </span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Created:</span>
          <span className="col-span-2 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {staffData.createdAt
              ? staffData.createdAt.toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Status:</span>
          <span className="col-span-2">
            <Badge {...getStatusProps(staffData.isActive)}>
              {getStatusProps(staffData.isActive).text}
            </Badge>
          </span>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewStaffDialog;
