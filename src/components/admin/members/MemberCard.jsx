import React from "react";
import { EyeIcon, HistoryIcon, PencilIcon, TrashIcon } from "../../ui/icons";
import Button from "../../ui/Button";

const MemberCard = ({ member, onView, onHistory, onEdit, onDelete }) => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
    <div className="flex flex-col space-y-1.5 p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-semibold tracking-tight text-lg">
            {member.name}
          </div>
          <div className="text-sm text-muted-foreground">{member.email}</div>
        </div>
        <div
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${
            member.activeBorrows > 0
              ? "bg-primary text-primary-foreground hover:bg-primary/80"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {member.activeBorrows} active
        </div>
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
        <Button onClick={onView} variant="secondary">
          <EyeIcon />
        </Button>
        <Button variant="secondary" onClick={onHistory}>
          <HistoryIcon />
        </Button>
        <Button variant="secondary" onClick={onEdit}>
          <PencilIcon />
        </Button>
        <Button variant="secondary" onClick={onDelete}>
          <TrashIcon />
        </Button>
      </div>
    </div>
  </div>
);

export default MemberCard;
