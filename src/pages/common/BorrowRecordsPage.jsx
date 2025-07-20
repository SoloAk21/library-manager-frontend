import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBorrowRecords,
  returnBook,
  clearMessages,
  fetchOverdueBooks,
  fetchPopularGenres,
  fetchAnalyticsSummary,
} from "../../redux/borrowRecords/borrowRecordsSlice";
import toast from "react-hot-toast";
import BorrowBookDialog from "../../components/librarian/BorrowBookDialog";
import ReturnBookDialog from "../../components/librarian/ReturnBookDialog";
import BorrowRecordCard from "../../components/librarian/BorrowRecordCard";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { ArrowLeftRightIcon, SearchIcon } from "../../components/ui/icons";
import useForm from "../../hooks/useForm";

const BorrowRecordsPage = () => {
  const dispatch = useDispatch();
  const {
    records = [],

    loading: recordsLoading,
    error,
    successMessage,
  } = useSelector((state) => state.borrowRecords || {});
  const { token } = useSelector((state) => state.auth);

  const initialData = { searchQuery: "" };
  const validate = () => ({});
  const { formData, handleChange } = useForm(initialData, validate);
  const [isBorrowDialogOpen, setIsBorrowDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchBorrowRecords());
      dispatch(fetchOverdueBooks());
      dispatch(fetchPopularGenres());
      dispatch(fetchAnalyticsSummary());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
  }, [error, successMessage, dispatch]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) =>
      `${record.bookTitle} ${record.memberName} ${record.status}`
        .toLowerCase()
        .includes(formData.searchQuery.toLowerCase())
    );
  }, [records, formData.searchQuery]);

  const handleReturnBook = (record) => {
    setSelectedRecord(record);
    setIsReturnDialogOpen(true);
  };

  const handleConfirmReturn = async () => {
    if (selectedRecord) {
      await dispatch(returnBook(selectedRecord.id));
      setIsReturnDialogOpen(false);
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      {recordsLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Borrow & Return
            </h1>
            <p className="text-gray-600">
              Manage book borrowing and return operations
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setIsBorrowDialogOpen(true)}
              disabled={recordsLoading}
            >
              <ArrowLeftRightIcon className="mr-2 h-4 w-4" />
              Borrow Book
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsReturnDialogOpen(true)}
              disabled={recordsLoading}
            >
              <ArrowLeftRightIcon className="mr-2 h-4 w-4" />
              Return Book
            </Button>
          </div>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="searchQuery"
            name="searchQuery"
            placeholder="Search records by title, member, or status..."
            value={formData.searchQuery}
            onChange={handleChange}
            disabled={recordsLoading}
            className="pl-10"
          />
        </div>
        <div className="grid gap-4">
          {filteredRecords.length === 0 && !recordsLoading ? (
            <div className="text-center py-8 text-gray-500">
              {records.length === 0
                ? "No borrow records available"
                : "No matching records found"}
            </div>
          ) : (
            filteredRecords.map((record) => (
              <BorrowRecordCard
                key={record.id}
                record={record}
                onReturn={handleReturnBook}
                loading={recordsLoading}
              />
            ))
          )}
        </div>
      </div>
      <BorrowBookDialog
        isOpen={isBorrowDialogOpen}
        onClose={() => setIsBorrowDialogOpen(false)}
      />

      <ReturnBookDialog
        isOpen={isReturnDialogOpen}
        onClose={() => setIsReturnDialogOpen(false)}
        onConfirm={handleConfirmReturn}
        record={selectedRecord}
      />
    </main>
  );
};

export default BorrowRecordsPage;
