import React from "react";
import Dialog from "../../common/Dialog";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { deleteMember } from "../../../redux/members/membersSlice";
import toast from "react-hot-toast";

const DeleteMemberDialog = ({ isOpen, onClose, member }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.members);

  const handleDelete = async () => {
    try {
      await dispatch(deleteMember(member.id)).unwrap();
      toast.success("Member deleted successfully!");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to delete member");
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Member"
      description={`Are you sure you want to delete "${
        member?.name || "this member"
      }"? This action cannot be undone.`}
    >
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          isLoading={loading}
          disabled={loading}
        >
          Delete
        </Button>
      </div>
    </Dialog>
  );
};

export default DeleteMemberDialog;
