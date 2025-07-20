import React, { useEffect } from "react";
import Dialog from "../../common/Dialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchMemberById } from "../../../redux/members/membersSlice";
import Badge from "../../ui/Badge";

const ViewMemberDialog = ({ isOpen, onClose, member }) => {
  const dispatch = useDispatch();
  const { loading, currentMember } = useSelector((state) => state.members);

  useEffect(() => {
    if (isOpen && member?.id) {
      dispatch(fetchMemberById(member.id));
    }
  }, [isOpen, member?.id, dispatch]);

  const getStatusProps = (activeBorrows) => ({
    variant: activeBorrows > 0 ? "primary" : "secondary",
    text: `${activeBorrows} active`,
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
          <span className="font-medium">Email:</span>
          <span className="col-span-2">{currentMember?.email || "N/A"}</span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Phone:</span>
          <span className="col-span-2">{currentMember?.phone || "N/A"}</span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Joined:</span>
          <span className="col-span-2">{currentMember?.joinDate || "N/A"}</span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Active Borrows:</span>
          <span className="col-span-2">
            <Badge {...getStatusProps(currentMember?.activeBorrows || 0)}>
              {getStatusProps(currentMember?.activeBorrows || 0).text}
            </Badge>
          </span>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewMemberDialog;
