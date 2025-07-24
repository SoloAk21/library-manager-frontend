import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, differenceInDays } from "date-fns";
import Dialog from "../common/Dialog";
import Button from "../ui/Button";
import Select from "../ui/Select";
import { CalendarIcon } from "../ui/icons";
import toast from "react-hot-toast";
import { returnBook } from "../../redux/borrowRecords/borrowRecordsSlice";
import Badge from "../ui/Badge";

const ReturnBookDialog = ({ isOpen, onClose, onConfirm, record }) => {
  const dispatch = useDispatch();
  const { records, loading: recordsLoading } = useSelector(
    (state) => state.borrowRecords
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState("");
  const [errors, setErrors] = useState({
    recordId: "",
    form: "",
  });

  // Filter to get only borrowed (not returned) records
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

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedRecordId(record?.id || "");
      setErrors({ recordId: "", form: "" });
    }
  }, [isOpen, record]);

  const handleChange = (e) => {
    const { value } = e.target;
    setSelectedRecordId(value);
    if (errors.recordId || errors.form) {
      setErrors({ recordId: "", form: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {
      recordId: "",
      form: "",
    };
    let isValid = true;

    if (!selectedRecordId) {
      newErrors.recordId = "Please select a borrow record";
      isValid = false;
    } else if (
      !borrowedRecords.some(
        (record) => record.id.toString() === selectedRecordId
      )
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

    setIsSubmitting(true);
    try {
      await dispatch(returnBook(Number(selectedRecordId))).unwrap();
      toast.success("Book returned successfully!");
      if (onConfirm) onConfirm();
      onClose();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: error.message || "Failed to return book",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRecord = borrowedRecords.find(
    (r) => r.id.toString() === selectedRecordId
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Return Book"
      description="Select a borrowed book to mark as returned."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.form && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">{errors.form}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Book to Return
          </label>
          <Select
            id="recordId"
            name="recordId"
            value={selectedRecordId}
            onChange={handleChange}
            error={errors.recordId}
            disabled={recordsLoading || isSubmitting}
            className="w-full"
          >
            <option value="" hidden>
              {recordsLoading
                ? "Loading records..."
                : "Select a book to return"}
            </option>
            {borrowedRecords.map((record) => (
              <option key={record.id} value={record.id}>
                <div className="py-1">
                  <div className="flex justify-between">
                    <div className="font-medium">{record.bookTitle}</div>
                    {record.daysOverdue > 0 && (
                      <Badge variant="destructive">
                        {record.daysOverdue} days overdue
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    by {record.bookAuthor || "Unknown Author"} • Borrowed by{" "}
                    {record.memberName}
                  </div>
                  <div className="text-xs text-gray-400">
                    Due: {format(new Date(record.dueDate), "MMMM do, yyyy")}
                  </div>
                </div>
              </option>
            ))}
          </Select>
          {errors.recordId && (
            <p className="mt-1 text-sm text-red-600">{errors.recordId}</p>
          )}
        </div>

        <div className="space-y-2">
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
                <Badge variant="danger">
                  OVERDUE ({selectedRecord.daysOverdue} days)
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={recordsLoading || !selectedRecordId}
          >
            Return Book
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default ReturnBookDialog;
