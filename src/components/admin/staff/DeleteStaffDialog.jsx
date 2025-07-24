import React from "react";
import Dialog from "../../common/Dialog";
import Button from "../../ui/Button";
import { useDispatch } from "react-redux";
import { deleteStaff } from "../../../redux/staff/staffSlice";
import { useToast } from "../../../context/ToastContext";

const DeleteStaffDialog = ({ isOpen, onClose, staff, isLoading }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const handleConfirm = async () => {
    try {
      await dispatch(deleteStaff(staff.id)).unwrap();
      showToast("Staff deleted successfully!", "success", "Deleted");
      onClose();
    } catch (error) {
      showToast(error || "Failed to delete staff", "error", "Error");
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
