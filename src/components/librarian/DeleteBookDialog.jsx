import React, { useEffect, useRef } from "react";
import Dialog from "../common/Dialog";
import Button from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { deleteBook, clearMessages } from "../../redux/books/booksSlice";
import { useToast } from "../../context/ToastContext";

const DeleteBookDialog = ({ isOpen, onClose, book }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { loading, error, successMessage } = useSelector(
    (state) => state.books
  );
  const actionTypeRef = useRef(null);

  const handleDelete = async () => {
    if (!book) return;
    actionTypeRef.current = "delete";
    await dispatch(deleteBook(book.id));
  };

  useEffect(() => {
    if (successMessage && actionTypeRef.current === "delete") {
      showToast(successMessage, "success", "Book Deleted");
      dispatch(clearMessages());
      setTimeout(() => onClose(), 1500);
    }

    if (error && actionTypeRef.current === "delete") {
      showToast(error, "error", "Delete Failed");
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch, onClose, showToast]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(clearMessages());
      actionTypeRef.current = null;
    }
  }, [isOpen, dispatch]);

  if (!book) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Book"
      description={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
    >
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white"
          isLoading={loading}
        >
          Delete
        </Button>
      </div>
    </Dialog>
  );
};

export default DeleteBookDialog;
