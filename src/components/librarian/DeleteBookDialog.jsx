import React from "react";
import Dialog from "../common/Dialog";
import Button from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { deleteBook, clearMessages } from "../../redux/books/booksSlice";
import toast from "react-hot-toast";

const DeleteBookDialog = ({ isOpen, onClose, book }) => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector(
    (state) => state.books
  );

  const handleDelete = async () => {
    if (!book) return;
    try {
      await dispatch(deleteBook(book.id)).unwrap();
      toast.success("Book deleted successfully");
      onClose();
    } catch (err) {
      toast.error(err?.message || "Failed to delete book");
    } finally {
      dispatch(clearMessages());
    }
  };

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
