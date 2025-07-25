import React, { useEffect, useRef } from "react";
import Dialog from "../../common/Dialog";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { deleteStaff, clearMessages } from "../../../redux/staff/staffSlice";
import { useToast } from "../../../context/ToastContext";

const DeleteStaffDialog = ({
  isOpen,
  onClose,
  staff,
  isLoading,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { loading, error, successMessage } = useSelector(
    (state) => state.staff
  );
  const toastCompletedRef = useRef(false);

  const handleConfirm = async () => {
    try {
      await dispatch(deleteStaff(staff.id)).unwrap();
    } catch (error) {
      console.error("Failed to delete staff:", error);
    }
  };

  useEffect(() => {
    if (successMessage && isOpen && !toastCompletedRef.current) {
      showToast(successMessage, "success", "Staff Deleted");
      dispatch(clearMessages());
      toastCompletedRef.current = true;
      onSuccess();
      setTimeout(() => onClose(), 1500);
    }

    if (error && isOpen && !toastCompletedRef.current) {
      showToast(error, "error", "Delete Staff Failed");
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch, isOpen, onClose, showToast, onSuccess]);

  if (!staff) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => {
        if (!loading && !toastCompletedRef.current) {
          onClose();
        }
      }}
      title="Delete Staff Member"
      description={`Are you sure you want to delete ${staff.username}? This action cannot be undone.`}
    >
      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="secondary"
          onClick={() => {
            if (!loading && !toastCompletedRef.current) {
              onClose();
            }
          }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleConfirm}
          isLoading={loading}
          disabled={loading}
        >
          Delete Staff
        </Button>
      </div>
    </Dialog>
  );
};

export default DeleteStaffDialog;
