import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { borrowBook } from "../redux/borrowRecords/borrowRecordsSlice";
import { fetchBooks } from "../redux/books/booksSlice";
import { fetchMembers } from "../redux/members/membersSlice";
import Dialog from "./Dialog";
import toast from "react-hot-toast";
import { format } from "date-fns";

const BorrowBookDialog = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { books, loading: booksLoading } = useSelector((state) => state.books);
  const { members, loading: membersLoading } = useSelector(
    (state) => state.members
  );
  const { error: borrowError } = useSelector((state) => state.borrowRecords);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    bookId: "",
    memberId: "",
  });

  const [errors, setErrors] = useState({
    bookId: "",
    memberId: "",
    form: "",
  });

  // Fetch data when dialog opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchBooks());
      dispatch(fetchMembers());
      // Reset form when opening
      setFormData({ bookId: "", memberId: "" });
      setErrors({ bookId: "", memberId: "", form: "" });
    }
  }, [isOpen, dispatch]);

  // Handle API errors
  useEffect(() => {
    if (borrowError) {
      setErrors((prev) => ({
        ...prev,
        form: parseApiError(borrowError),
      }));
      setIsSubmitting(false);
    }
  }, [borrowError]);

  const availableBooks = books.filter((book) => book.availableCopies > 0);

  // Helper function to parse API errors
  const parseApiError = (error) => {
    if (typeof error === "string") {
      return error;
    }

    if (error.message) {
      return error.message;
    }

    // Handle validation errors from backend
    if (Array.isArray(error)) {
      return error.map((err) => err.message).join(", ");
    }

    return "An unknown error occurred";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      bookId: "",
      memberId: "",
      form: "",
    };
    let isValid = true;

    if (!formData.bookId) {
      newErrors.bookId = "Please select a book";
      isValid = false;
    } else if (
      !availableBooks.some((book) => book.id.toString() === formData.bookId)
    ) {
      newErrors.bookId = "Selected book is not available";
      isValid = false;
    }

    if (!formData.memberId) {
      newErrors.memberId = "Please select a member";
      isValid = false;
    } else if (
      !members.some((member) => member.id.toString() === formData.memberId)
    ) {
      newErrors.memberId = "Selected member is not valid";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 2 weeks from now

      await dispatch(
        borrowBook({
          bookId: Number(formData.bookId),
          memberId: Number(formData.memberId),
          dueDate: dueDate.toISOString(),
        })
      ).unwrap();

      toast.success("Book borrowed successfully!");
      onClose();
    } catch (error) {
      // Error is already handled by the useEffect hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Borrow Book"
      description="Select a book and member to create a new borrow record."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display form-level errors */}
        {errors.form && (
          <div className="rounded-md bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{errors.form}</p>
          </div>
        )}

        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none text-gray-700"
            htmlFor="bookId"
          >
            Select Book *
          </label>
          <select
            className={`flex h-10 w-full rounded-md border ${
              errors.bookId ? "border-destructive" : "border-gray-300"
            } bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            id="bookId"
            name="bookId"
            value={formData.bookId}
            onChange={handleChange}
            disabled={booksLoading || isSubmitting}
          >
            <option value="">
              {booksLoading ? "Loading books..." : "Select a book"}
            </option>
            {availableBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author} • {book.availableCopies} available
              </option>
            ))}
          </select>
          {errors.bookId && (
            <p className="text-sm text-destructive">{errors.bookId}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none text-gray-700"
            htmlFor="memberId"
          >
            Select Member *
          </label>
          <select
            className={`flex h-10 w-full rounded-md border ${
              errors.memberId ? "border-destructive" : "border-gray-300"
            } bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            id="memberId"
            name="memberId"
            value={formData.memberId}
            onChange={handleChange}
            disabled={membersLoading || isSubmitting}
          >
            <option value="">
              {membersLoading ? "Loading members..." : "Select a member"}
            </option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.email})
              </option>
            ))}
          </select>
          {errors.memberId && (
            <p className="text-sm text-destructive">{errors.memberId}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Borrow Date
            </label>
            <div className="flex items-center mt-1 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-calendar mr-2 h-4 w-4"
              >
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              {format(new Date(), "MMMM do, yyyy")}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Due Date
            </label>
            <div className="flex items-center mt-1 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-calendar mr-2 h-4 w-4"
              >
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              {format(
                new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                "MMMM do, yyyy"
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
            disabled={isSubmitting || booksLoading || membersLoading}
          >
            {isSubmitting ? "Processing..." : "Borrow Book"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default BorrowBookDialog;
