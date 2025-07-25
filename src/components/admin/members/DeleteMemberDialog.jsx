import React, { useEffect, useRef } from "react";
import Dialog from "../../common/Dialog";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMember,
  clearMessages,
} from "../../../redux/members/membersSlice";
import { useToast } from "../../../context/ToastContext";

const DeleteMemberDialog = ({ isOpen, onClose, member }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { loading, error, successMessage } = useSelector(
    (state) => state.members
  );
  const toastCompletedRef = useRef(false);

  const handleDelete = async () => {
    if (!member) return;
    toastCompletedRef.current = false;
    try {
      await dispatch(deleteMember(member.id)).unwrap();
    } catch (err) {
      console.error("Failed to delete member:", err);
    }
  };

  useEffect(() => {
    if (successMessage && isOpen && !toastCompletedRef.current) {
      showToast(successMessage, "success", "Member Deleted");
      dispatch(clearMessages());
      toastCompletedRef.current = true;
      setTimeout(() => {
        onClose();
      }, 1500);
    }

    if (error && isOpen && !toastCompletedRef.current) {
      showToast(error, "error", "Delete Member Failed");
      dispatch(clearMessages());
    }

    return () => {
      dispatch(clearMessages());
    };
  }, [successMessage, error, dispatch, isOpen, onClose, showToast]);

  if (!member) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => {
        if (!loading && !toastCompletedRef.current) {
          onClose();
        }
      }}
      title="Delete Member"
      description={`Are you sure you want to delete "${member.name}"? This action cannot be undone.`}
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
          onClick={handleDelete}
          disabled={loading}
          variant="destructive"
          isLoading={loading}
        >
          Delete
        </Button>
      </div>
    </Dialog>
  );
};

export default DeleteMemberDialog;
