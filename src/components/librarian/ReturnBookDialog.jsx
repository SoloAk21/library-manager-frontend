import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, differenceInDays } from "date-fns";
import Dialog from "../common/Dialog";
import Button from "../ui/Button";
import Select from "../ui/Select";
import { CalendarIcon } from "../ui/icons";
import {
  returnBook,
  clearMessages,
} from "../../redux/borrowRecords/borrowRecordsSlice";
import { useToast } from "../../context/ToastContext";
import Badge from "../ui/Badge";

const ReturnBookDialog = ({ isOpen, onClose, record }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { records, loading: recordsLoading } = useSelector(
    (state) => state.borrowRecords
  );
  const { error, successMessage } = useSelector((state) => state.borrowRecords);
  const [selectedRecordId, setSelectedRecordId] = useState("");
  const [errors, setErrors] = useState({
    recordId: "",
    form: "",
  });
  const toastCompletedRef = useRef(false);

  const borrowedRecords = useMemo(() => {
    return records
      .filter((record) => !record.returnDate)
      .map((record) => ({
        ...record,
        daysOverdue: Math.max(
          0,
          differenceInDays(new Date(), new Date(record.dueDate))
        ),
      }));
  }, [records]);

  useEffect(() => {
    if (isOpen) {
      setSelectedRecordId(record?.id || "");
      setErrors({ recordId: "", form: "" });
      dispatch(clearMessages());
      toastCompletedRef.current = false;
    }
  }, [isOpen, record, dispatch]);

  useEffect(() => {
    if (successMessage && isOpen && !toastCompletedRef.current) {
      showToast(successMessage, "success", "Book Returned");
      dispatch(clearMessages());
      toastCompletedRef.current = true;
      setTimeout(() => {
        if (isOpen && !recordsLoading) {
          onClose();
          toastCompletedRef.current = false;
        }
      }, 1500);
    }

    if (error && isOpen && !toastCompletedRef.current) {
      const errorMessage = parseApiError(error);
      setErrors((prev) => ({ ...prev, form: errorMessage }));
      showToast(errorMessage, "error", "Return Failed");
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
    recordsLoading,
  ]);

  const parseApiError = (error) => {
    if (typeof error === "string") return error;
    if (error.message) return error.message;
    if (Array.isArray(error)) return error.map((err) => err.message).join(", ");
    return "An unknown error occurred";
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSelectedRecordId(value);
    if (errors.recordId || errors.form) {
      setErrors({ recordId: "", form: "" });
    }
  };

  const validateForm = () => {
    const newErrors = { recordId: "", form: "" };
    let isValid = true;

    if (!selectedRecordId) {
      newErrors.recordId = "Please select a borrow record";
      isValid = false;
    } else if (
      !borrowedRecords.some((record) => record.id === selectedRecordId)
    ) {
      newErrors.recordId = "Selected record is not valid for return";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    toastCompletedRef.current = false;
    try {
      await dispatch(returnBook(Number(selectedRecordId))).unwrap();
    } catch (err) {
      // Error handled in useEffect
    }
  };

  const selectedRecord = borrowedRecords.find((r) => r.id === selectedRecordId);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => {
        if (!recordsLoading && !toastCompletedRef.current) {
          onClose();
        }
      }}
      title="Return Book"
      description="Select a borrowed book to mark as returned."
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
            Select Book to Return
          </label>
          <Select
            id="recordId"
            name="recordId"
            value={selectedRecordId}
            onChange={handleChange}
            error={errors.recordId}
            disabled={recordsLoading || toastCompletedRef.current}
            className="w-full"
          >
            <option value="" hidden>
              {recordsLoading
                ? "Loading records..."
                : "Select a book to return"}
            </option>
            {borrowedRecords.map((record) => (
              <option key={record.id} value={record.id}>
                {record.bookTitle} by {record.bookAuthor || "Unknown Author"}{" "}
                (Borrowed by {record.memberName})
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Return Date
          </label>
          <div className="flex items-center text-sm p-2 bg-gray-50 rounded-md">
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
            {format(new Date(), "MMMM do, yyyy")}
          </div>
        </div>

        {selectedRecord && (
          <div className="p-4 border border-gray-200 rounded-md bg-gray-50 space-y-2">
            <h4 className="font-medium text-gray-900">Selected Return:</h4>
            <div className="space-y-1">
              <div className="font-medium">
                {selectedRecord.bookTitle} by{" "}
                {selectedRecord.bookAuthor || "Unknown Author"}
              </div>
              <div className="text-sm text-gray-600">
                Borrowed by: {selectedRecord.memberName}
              </div>
              <div className="text-sm text-gray-600">
                Due: {format(new Date(selectedRecord.dueDate), "MMMM do, yyyy")}
              </div>
              {selectedRecord.daysOverdue > 0 && (
                <Badge variant="destructive">
                  OVERDUE ({selectedRecord.daysOverdue} days)
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="secondary"
            onClick={() => {
              if (!recordsLoading && !toastCompletedRef.current) {
                onClose();
              }
            }}
            disabled={recordsLoading || toastCompletedRef.current}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={recordsLoading}
            disabled={
              recordsLoading || !selectedRecordId || toastCompletedRef.current
            }
          >
            Return Book
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default ReturnBookDialog;
