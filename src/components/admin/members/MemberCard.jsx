import React from "react";
import { EyeIcon, HistoryIcon, SquarePenIcon, TrashIcon } from "../../ui/icons";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";
import { cn } from "../../../utils/cn";

const MemberCard = React.memo(
  ({ member, onView, onHistory, onEdit, onDelete, loading }) => {
    const getStatusProps = (activeBorrows) => ({
      variant: activeBorrows > 0 ? "primary" : "secondary",
      text: `${activeBorrows} active`,
    });

    return (
      <div
        className={cn(
          "rounded-lg border border-primary/10 text-card-foreground bg-white shadow-xs hover:shadow-md transition-shadow"
        )}
      >
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-semibold text-lg">{member.name}</div>
              <div className="text-sm text-gray-500">{member.email}</div>
            </div>
            <Badge {...getStatusProps(member.activeBorrows)}>
              {getStatusProps(member.activeBorrows).text}
            </Badge>
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Phone:</span> {member.phone}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Joined:</span>{" "}
              {new Date(member.joinDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Active Borrows:</span>{" "}
              {member.activeBorrows}
            </p>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="secondary"
              onClick={() => onView(member)}
              disabled={loading}
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => onHistory(member)}
              disabled={loading}
            >
              <HistoryIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => onEdit(member)}
              disabled={loading}
            >
              <SquarePenIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => onDelete(member)}
              disabled={loading}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

export default MemberCard;
