import React from "react";
import Dialog from "../../common/Dialog";
import Button from "../../ui/Button";
import { useDispatch } from "react-redux";
import { deleteStaff } from "../../../redux/staff/staffSlice";
import toast from "react-hot-toast";

const DeleteStaffDialog = ({ isOpen, onClose, staff, isLoading }) => {
  const dispatch = useDispatch();

  const handleConfirm = async () => {
    try {
      await dispatch(deleteStaff(staff.id)).unwrap();
      toast.success("Staff deleted successfully!");
      onClose();
    } catch (error) {
      toast.error(error || "Failed to delete staff");
    }
  };

  if (!staff) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Staff Member"
      description={`Are you sure you want to delete ${staff.username}? This action cannot be undone.`}
    >
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleConfirm}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Delete Staff
        </Button>
      </div>
    </Dialog>
  );
};

export default DeleteStaffDialog;
