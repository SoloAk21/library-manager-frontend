import React from "react";
import { cn } from "../../utils/cn";
import { CalendarIcon, BookIcon, UserIcon } from "../ui/icons";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const BorrowRecordCard = React.memo(({ record, onReturn, loading }) => {
  const getStatusProps = (status) => {
    switch (status) {
      case "borrowed":
        return { variant: "primary", text: "Borrowed" };
      case "returned":
        return { variant: "secondary", text: "Returned" };
      case "overdue":
        return { variant: "destructive", text: "Overdue" };
      default:
        return { variant: "secondary", text: status.toUpperCase() };
    }
  };

  return (
    <div className="rounded-lg border border-primary/10 bg-white shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="font-semibold text-lg flex items-center">
              <BookIcon className="mr-2 h-5 w-5" />
              {record.bookTitle}
            </div>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <UserIcon className="mr-2 h-4 w-4" />
              {record.memberName}
            </div>
          </div>
          <Badge variant={getStatusProps(record.status).variant}>
            {getStatusProps(record.status).text}
          </Badge>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <div>
              <span className="font-medium">Borrowed:</span>
              <br />
              {new Date(record.borrowDate).toLocaleDateString()}
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <div>
              <span className="font-medium">Due:</span>
              <br />
              {new Date(record.dueDate).toLocaleDateString()}
            </div>
          </div>
          {record.returnDate && (
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <div>
                <span className="font-medium">Returned:</span>
                <br />
                {new Date(record.returnDate).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
        {record.status === "borrowed" && (
          <div className="mt-4 flex">
            <Button onClick={() => onReturn(record)} disabled={loading}>
              Mark as Returned
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

export default BorrowRecordCard;
