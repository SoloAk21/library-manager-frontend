import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import Dialog from "../common/Dialog";
import Button from "../ui/Button";
import Select from "../ui/Select";
import { CalendarIcon } from "../ui/icons";
import {
  borrowBook,
  clearMessages,
} from "../../redux/borrowRecords/borrowRecordsSlice";
import { fetchBooks } from "../../redux/books/booksSlice";
import { fetchMembers } from "../../redux/members/membersSlice";
import { useToast } from "../../context/ToastContext";

const BorrowBookDialog = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { books, loading: booksLoading } = useSelector((state) => state.books);
  const { members, loading: membersLoading } = useSelector(
    (state) => state.members
  );
  const {
    loading: borrowLoading,
    error,
    successMessage,
  } = useSelector((state) => state.borrowRecords);
  const [formData, setFormData] = useState({
    bookId: "",
    memberId: "",
  });
  const [errors, setErrors] = useState({
    bookId: "",
    memberId: "",
    form: "",
  });
  const toastCompletedRef = useRef(false);

  const availableBooks = books.filter((book) => book.availableCopies > 0);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchBooks());
      dispatch(fetchMembers());
      setFormData({ bookId: "", memberId: "" });
      setErrors({ bookId: "", memberId: "", form: "" });
      dispatch(clearMessages());
      toastCompletedRef.current = false;
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (successMessage && isOpen && !toastCompletedRef.current) {
      showToast(successMessage, "success", "Book Borrowed");
      dispatch(clearMessages());
      toastCompletedRef.current = true;
      setTimeout(() => {
        if (isOpen && !borrowLoading) {
          onClose();
          toastCompletedRef.current = false;
        }
      }, 1500);
    }

    if (error && isOpen && !toastCompletedRef.current) {
      const errorMessage = parseApiError(error);
      setErrors((prev) => ({ ...prev, form: errorMessage }));
      showToast(errorMessage, "error", "Borrow Failed");
      dispatch(clearMessages());
      toastCompletedRef.current = true;
      setTimeout(() => {
        toastCompletedRef.current = false;
      }, 1500);
    }
  }, [
    successMessage,
    error,
    dispatch,
    isOpen,
    onClose,
    showToast,
    borrowLoading,
  ]);

  const parseApiError = (error) => {
    if (typeof error === "string") return error;
    if (error.message) return error.message;
    if (Array.isArray(error)) return error.map((err) => err.message).join(", ");
    return "An unknown error occurred";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = { bookId: "", memberId: "", form: "" };
    let isValid = true;

    if (!formData.bookId) {
      newErrors.bookId = "Please select a book";
      isValid = false;
    } else if (!availableBooks.some((book) => book.id === formData.bookId)) {
      newErrors.bookId = "Selected book is not available";
      isValid = false;
    }

    if (!formData.memberId) {
      newErrors.memberId = "Please select a member";
      isValid = false;
    } else if (!members.some((member) => member.id === formData.memberId)) {
      newErrors.memberId = "Selected member is not valid";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    toastCompletedRef.current = false;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    try {
      await dispatch(
        borrowBook({
          bookId: Number(formData.bookId),
          memberId: Number(formData.memberId),
          dueDate: dueDate.toISOString(),
        })
      ).unwrap();
    } catch (err) {
      // Error handled in useEffect
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => {
        if (!borrowLoading && !toastCompletedRef.current) {
          onClose();
        }
      }}
      title="Borrow Book"
      description="Select a book and member to create a new borrow record."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.values(errors).some((error) => error) && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">
              {errors.form || "Please fix the errors in the form."}
            </p>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Select Member
          </label>
          <Select
            id="memberId"
            name="memberId"
            value={formData.memberId}
            onChange={handleChange}
            error={errors.memberId}
            disabled={membersLoading || borrowLoading}
            className="w-full"
          >
            <option value="" hidden>
              {membersLoading ? "Loading members..." : "Select a member"}
            </option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.email})
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Select Book
          </label>
          <Select
            id="bookId"
            name="bookId"
            value={formData.bookId}
            onChange={handleChange}
            error={errors.bookId}
            disabled={booksLoading || borrowLoading}
            className="w-full"
          >
            <option value="" hidden>
              {booksLoading ? "Loading books..." : "Select a book"}
            </option>
            {availableBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author} ({book.availableCopies} available)
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/10">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Borrow Date
            </label>
            <div className="flex items-center mt-1 text-sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(new Date(), "MMMM do, yyyy")}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Due Date
            </label>
            <div className="flex items-center mt-1 text-sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(
                new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                "MMMM do, yyyy"
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="secondary"
            onClick={() => {
              if (!borrowLoading && !toastCompletedRef.current) {
                onClose();
              }
            }}
            disabled={borrowLoading || toastCompletedRef.current}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={borrowLoading}
            disabled={
              booksLoading ||
              membersLoading ||
              borrowLoading ||
              toastCompletedRef.current
            }
          >
            Borrow Book
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default BorrowBookDialog;
