import React from "react";
import Dialog from "./Dialog";

const ViewBookDialog = ({ isOpen, onClose, book }) => {
  const getStatusBadgeClass = (availableCopies) => {
    return availableCopies > 0
      ? "bg-primary text-primary-foreground hover:bg-primary/80"
      : "bg-destructive text-destructive-foreground hover:bg-destructive/80";
  };

  const getStatusText = (availableCopies) => {
    return availableCopies > 0 ? "Available" : "Out of Stock";
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={book?.title || "Book Details"}
      description="View book information"
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Author:</span>
          <span className="col-span-2">{book?.author}</span>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Genre:</span>
          <span className="col-span-2">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
              {book?.genre || "Unknown"}
            </div>
          </span>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Published:</span>
          <span className="col-span-2">{book?.publishedYear}</span>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Available:</span>
          <span className="col-span-2">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
              {book?.availableCopies} copies
            </div>
          </span>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Status:</span>
          <span className="col-span-2">
            <div
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${getStatusBadgeClass(
                book?.availableCopies
              )}`}
            >
              {getStatusText(book?.availableCopies)}
            </div>
          </span>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewBookDialog;
