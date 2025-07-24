import React, { useEffect } from "react";
import Dialog from "../../common/Dialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchMemberById } from "../../../redux/members/membersSlice";
import Badge from "../../ui/Badge";
import { CalendarIcon, EmailIcon, PhoneIcon } from "../../ui/icons";

const ViewMemberDialog = ({ isOpen, onClose, member }) => {
  const dispatch = useDispatch();
  const { loading, currentMember } = useSelector((state) => state.members);

  useEffect(() => {
    if (isOpen && member?.id) {
      dispatch(fetchMemberById(member.id));
    }
  }, [isOpen, member?.id, dispatch]);

  const getStatusProps = (status) => ({
    variant: status === "Active" ? "primary" : "secondary",
    text: status || "Inactive",
  });

  const getBorrowsProps = (count) => ({
    variant: count > 0 ? "primary" : "secondary",
    text: `${count} ${count === 1 ? "book" : "books"}`,
  });

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={currentMember?.name || "Member Details"}
      description="View member information"
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Name:</span>
          <span className="col-span-2">{currentMember?.name || "N/A"}</span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Email:</span>
          <span className="col-span-2 flex items-center">
            <EmailIcon className="h-5 w-5 mr-2" />
            {currentMember?.email || "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Phone:</span>
          <span className="col-span-2 flex items-center">
            <PhoneIcon className="h-5 w-5 mr-2" />
            {currentMember?.phone || "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Joined:</span>
          <span className="col-span-2 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            {currentMember?.joinDate || "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Active Borrows:</span>
          <span className="col-span-2">
            <Badge {...getBorrowsProps(currentMember?.activeBorrows || 0)}>
              {getBorrowsProps(currentMember?.activeBorrows || 0).text}
            </Badge>
          </span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Status:</span>
          <span className="col-span-2">
            <Badge {...getStatusProps(currentMember?.status || "Inactive")}>
              {getStatusProps(currentMember?.status || "Inactive").text}
            </Badge>
          </span>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewMemberDialog;
