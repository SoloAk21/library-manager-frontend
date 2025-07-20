import React, { useEffect } from "react";
import Dialog from "../../common/Dialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchMemberBorrowingHistory } from "../../../redux/members/membersSlice";
import { format } from "date-fns";
import Badge from "../../ui/Badge";

const HistoryDialog = ({ isOpen, onClose, member }) => {
  const dispatch = useDispatch();
  const { loading, borrowingHistory } = useSelector((state) => state.members);

  useEffect(() => {
    if (isOpen && member?.id) {
      dispatch(fetchMemberBorrowingHistory(member.id));
    }
  }, [isOpen, member?.id, dispatch]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`${member?.name || "Member"} Borrowing History`}
      description="View the borrowing history for this member."
    >
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : borrowingHistory.length === 0 ? (
        <p className="text-center text-gray-600 py-4">
          No borrowing history available.
        </p>
      ) : (
        <div className="space-y-4 py-4">
          {borrowingHistory.map((record) => (
            <div key={record.id} className="border p-4 rounded-md">
              <h4 className="font-medium">{record.bookTitle}</h4>
              <p className="text-sm text-gray-600">
                Borrow Date:{" "}
                {format(new Date(record.borrowDate), "MMMM do, yyyy")}
              </p>
              <p className="text-sm text-gray-600">
                Due Date: {format(new Date(record.dueDate), "MMMM do, yyyy")}
              </p>
              <p className="text-sm text-gray-600">
                Return Date:{" "}
                {record.returnDate
                  ? format(new Date(record.returnDate), "MMMM do, yyyy")
                  : "Not returned"}
              </p>
              <Badge
                variant={
                  record.status === "overdue"
                    ? "destructive"
                    : record.status === "returned"
                    ? "secondary"
                    : "primary"
                }
              >
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </Dialog>
  );
};

export default HistoryDialog;
