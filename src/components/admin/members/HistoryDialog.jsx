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
      size="full"
    >
      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : borrowingHistory.length === 0 ? (
        <p className="text-center text-gray-600 py-6">
          No borrowing history available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2 py-4">
          {borrowingHistory.map((record) => (
            <div
              key={record.id}
              className="rounded-lg border border-primary/10 bg-white text-card-foreground shadow-xs hover:shadow-md transition-shadow p-6"
            >
              <div className="flex flex-col gap-3">
                <h4 className="font-semibold text-lg text-gray-900">
                  {record.bookTitle}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Borrowed:</span>{" "}
                    {format(new Date(record.borrowDate), "MMM d, yyyy")}
                  </p>
                  <p>
                    <span className="font-medium">Due:</span>{" "}
                    {format(new Date(record.dueDate), "MMM d, yyyy")}
                  </p>
                  <p>
                    <span className="font-medium">Returned:</span>{" "}
                    {record.returnDate
                      ? format(new Date(record.returnDate), "MMM d, yyyy")
                      : "Not returned"}
                  </p>
                </div>
                <div className="pt-2">
                  <Badge
                    variant={
                      record.status === "overdue"
                        ? "destructive"
                        : record.status === "returned"
                        ? "secondary"
                        : "primary"
                    }
                    className="text-sm"
                  >
                    {record.status.charAt(0).toUpperCase() +
                      record.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Dialog>
  );
};

export default HistoryDialog;
