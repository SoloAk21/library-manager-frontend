import React from "react";
import {
  EyeIcon,
  SquarePenIcon,
  TrashIcon,
  UserIcon,
  ShieldIcon,
} from "../../ui/icons";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";

const StaffCard = ({ staff, loading, onView, onEdit, onDelete, isAdmin }) => {
  const getStatusProps = (isActive) => ({
    variant: isActive ? "primary" : "secondary",
    text: isActive ? "Active" : "Inactive",
  });

  const getRoleIcon = () => {
    if (staff.role === "admin") {
      return <ShieldIcon className="mr-2 h-5 w-5 text-red-500" />;
    }
    return <UserIcon className="mr-2 h-5 w-5 text-blue-500" />;
  };

  const getRoleBadgeVariant = () => {
    return staff.role === "admin" ? "destructive" : "default";
  };

  const formatCreatedDate = () => {
    if (staff.createdAt) {
      return new Date(staff.createdAt).toLocaleDateString();
    }
    return "Jan 1, 2023";
  };

  const formatPhoneNumber = () => {
    if (staff.phone) {
      return staff.phone;
    }
    return "(555) 000-0000";
  };

  return (
    <div className="rounded-lg border border-primary/10 bg-white text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="font-semibold tracking-tight text-lg flex items-center">
              {getRoleIcon()}
              {staff.username}
            </div>
            <div className="text-sm text-muted-foreground">{staff.email}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <Badge variant={getRoleBadgeVariant()}>
              {staff.role.toUpperCase()}
            </Badge>
            <Badge {...getStatusProps(staff.isActive)}>
              {getStatusProps(staff.isActive).text}
            </Badge>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Phone:</span> {formatPhoneNumber()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Created:</span> {formatCreatedDate()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Role:</span>{" "}
            {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
          </p>
        </div>
        {isAdmin && (
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onView(staff)}
              disabled={loading}
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(staff)}
              disabled={loading}
            >
              <SquarePenIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDelete(staff)}
              disabled={loading}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(StaffCard);
