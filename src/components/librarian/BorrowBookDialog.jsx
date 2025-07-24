import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import Dialog from "../common/Dialog";
import Button from "../ui/Button";
import Select from "../ui/Select";
import { CalendarIcon } from "../ui/icons";
import { borrowBook } from "../../redux/borrowRecords/borrowRecordsSlice";
import { fetchBooks } from "../../redux/books/booksSlice";
import { fetchMembers } from "../../redux/members/membersSlice";
import toast from "react-hot-toast";

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

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchBooks());
      dispatch(fetchMembers());
      setFormData({ bookId: "", memberId: "" });
      setErrors({ bookId: "", memberId: "", form: "" });
    }
  }, [isOpen, dispatch]);

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
      dueDate.setDate(dueDate.getDate() + 14);

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
      // Error handled by useEffect
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.form && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">{errors.form}</p>
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
            disabled={membersLoading || isSubmitting}
            className="w-full"
          >
            <option value="" hidden>
              {membersLoading ? "Loading members..." : "Select a member"}
            </option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                <div className="py-1">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.email}</div>
                </div>
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
            disabled={booksLoading || isSubmitting}
            className="w-full"
          >
            <option value="" hidden>
              {booksLoading ? "Loading books..." : "Select a book"}
            </option>
            {availableBooks.map((book) => (
              <option key={book.id} value={book.id}>
                <div className="py-1">
                  <div className="font-medium">{book.title}</div>
                  <div className="text-sm text-gray-500">
                    by {book.author} • {book.availableCopies} available
                  </div>
                </div>
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
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={booksLoading || membersLoading}
          >
            Borrow Book
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default BorrowBookDialog;
