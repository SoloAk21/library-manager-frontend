import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import Dialog from "../common/Dialog";
import Button from "../ui/Button";
import Select from "../ui/Select";
import { CalendarIcon } from "../ui/icons";
import toast from "react-hot-toast";
import { returnBook } from "../../redux/borrowRecords/borrowRecordsSlice";

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
    return records.filter((record) => !record.returnDate);
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
    // Clear error when user selects a record
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

  const getRecordDetails = () => {
    if (!selectedRecordId) return null;
    const record = borrowedRecords.find(
      (r) => r.id.toString() === selectedRecordId
    );
    return record;
  };

  const recordDetails = getRecordDetails();

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Return Book"
      description="Select a borrowed book to mark as returned."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">{errors.form}</p>
          </div>
        )}

        <Select
          id="recordId"
          name="recordId"
          value={selectedRecordId}
          onChange={handleChange}
          error={errors.recordId}
          disabled={recordsLoading || isSubmitting}
        >
          <option value="">
            {recordsLoading ? "Loading records..." : "Select a borrow record"}
          </option>
          {borrowedRecords.map((record) => (
            <option key={record.id} value={record.id}>
              {record.bookTitle} • Borrowed by {record.memberName} • Due:{" "}
              {format(new Date(record.dueDate), "MMMM do, yyyy")}
              {new Date(record.dueDate) < new Date() && " (Overdue)"}
            </option>
          ))}
        </Select>

        {recordDetails && (
          <div className="p-4 border border-primary/10 rounded-md bg-gray-50">
            <h4 className="font-medium text-gray-900">
              {recordDetails.bookTitle}
            </h4>
            <p className="text-sm text-gray-600">
              Borrowed by: {recordDetails.memberName}
            </p>
            <p className="text-sm text-gray-600">
              Borrow date:{" "}
              {format(new Date(recordDetails.borrowDate), "MMMM do, yyyy")}
            </p>
            <p className="text-sm text-gray-600">
              Due date:{" "}
              {format(new Date(recordDetails.dueDate), "MMMM do, yyyy")}
              {new Date(recordDetails.dueDate) < new Date() && (
                <span className="text-red-500 ml-1">(Overdue)</span>
              )}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 pt-4 border-t">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Return Date
            </label>
            <div className="flex items-center mt-1 text-sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(new Date(), "MMMM do, yyyy")}
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
