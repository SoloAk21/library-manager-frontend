import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBorrowRecords,
  returnBook,
  clearMessages,
  fetchOverdueBooks,
  fetchPopularGenres,
  fetchAnalyticsSummary,
} from "../redux/borrowRecords/borrowRecordsSlice";
import toast from "react-hot-toast";
import BorrowBookDialog from "../components/BorrowBookDialog";
import ReturnBookDialog from "../components/ReturnBookDialog";

// Reusable components to reduce duplication
const CalendarIcon = ({ className = "" }) => (
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
    className={`lucide lucide-calendar mr-2 h-4 w-4 ${className}`}
  >
    <path d="M8 2v4"></path>
    <path d="M16 2v4"></path>
    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
    <path d="M3 10h18"></path>
  </svg>
);

const BookIcon = ({ className = "" }) => (
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
    className={`lucide lucide-book-open mr-2 h-5 w-5 ${className}`}
  >
    <path d="M12 7v14"></path>
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
  </svg>
);

const UserIcon = ({ className = "" }) => (
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
    className={`lucide lucide-user mr-2 h-4 w-4 ${className}`}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const ArrowLeftRightIcon = ({ className = "" }) => (
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
    className={`lucide lucide-arrow-left-right mr-2 h-4 w-4 ${className}`}
  >
    <path d="M8 3 4 7l4 4"></path>
    <path d="M4 7h16"></path>
    <path d="m16 21 4-4-4-4"></path>
    <path d="M20 17H4"></path>
  </svg>
);

const BorrowRecordCard = ({ record, onReturn, loading }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "borrowed":
        return "bg-primary text-primary-foreground hover:bg-primary/80";
      case "returned":
        return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
      case "overdue":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/80";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="font-semibold tracking-tight text-lg flex items-center">
              <BookIcon />
              {record.bookTitle}
            </div>
            <div className="text-sm text-muted-foreground flex items-center mt-1">
              <UserIcon />
              {record.memberName}
            </div>
          </div>
          <div
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${getStatusBadgeClass(
              record.status
            )}`}
          >
            {record.status.toUpperCase()}
          </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon />
            <div>
              <span className="font-medium">Borrowed:</span>
              <br />
              {new Date(record.borrowDate).toLocaleDateString()}
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon />
            <div>
              <span className="font-medium">Due:</span>
              <br />
              {new Date(record.dueDate).toLocaleDateString()}
            </div>
          </div>
          {record.returnDate && (
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon />
              <div>
                <span className="font-medium">Returned:</span>
                <br />
                {new Date(record.returnDate).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
        {record.status === "borrowed" && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => onReturn(record)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3"
            >
              Mark as Returned
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function BorrowRecordsPage() {
  const dispatch = useDispatch();
  const {
    records = [],
    overdueBooks = [],
    popularGenres = [],
    analyticsSummary,
    loading: recordsLoading,
    error,
    successMessage,
  } = useSelector((state) => state.borrowRecords || {});
  const { token } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredRecords = records.filter((record) =>
    `${record.bookTitle} ${record.memberName} ${record.status}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
            <button
              onClick={() => setIsBorrowDialogOpen(true)}
              disabled={recordsLoading}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <ArrowLeftRightIcon />
              Borrow Book
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              disabled
            >
              <ArrowLeftRightIcon />
              Return Book
            </button>
          </div>
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
}
