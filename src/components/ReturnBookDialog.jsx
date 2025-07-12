import React, { useState } from "react";
import Dialog from "./Dialog";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { returnBook } from "../redux/borrowRecords/borrowRecordsSlice";
import toast from "react-hot-toast";

const ReturnBookDialog = ({ isOpen, onClose, onConfirm, record }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReturn = async () => {
    if (!record) return;

    setIsSubmitting(true);
    try {
      await dispatch(returnBook(record.id)).unwrap();
      toast.success("Book returned successfully!");
      onConfirm();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to return book");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!record) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Return Book"
      description="Confirm the return of this borrowed book."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="font-medium text-gray-700">Book</div>
          <div className="text-sm">
            {record.bookTitle} (ID: {record.bookId})
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-medium text-gray-700">Borrowed By</div>
          <div className="text-sm">
            {record.memberName} (ID: {record.memberId})
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="font-medium text-gray-700">Borrow Date</div>
            <div className="text-sm flex items-center">
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
              {format(new Date(record.borrowDate), "MMMM do, yyyy")}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium text-gray-700">Due Date</div>
            <div className="text-sm flex items-center">
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
              {format(new Date(record.dueDate), "MMMM do, yyyy")}
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <div className="font-medium text-gray-700">Return Date</div>
          <div className="text-sm flex items-center">
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
            type="button"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
            onClick={handleReturn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Return"}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ReturnBookDialog;
