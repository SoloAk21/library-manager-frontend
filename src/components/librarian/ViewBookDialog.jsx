import React from "react";
import Dialog from "../common/Dialog";
import Badge from "../ui/Badge";

const ViewBookDialog = ({ isOpen, onClose, book }) => {
  const getStatusProps = (availableCopies) => ({
    variant: availableCopies > 0 ? "primary" : "destructive",
    text: availableCopies > 0 ? "Available" : "Out of Stock",
  });

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
            <Badge variant="secondary">{book?.genre || "Unknown"}</Badge>
          </span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Published:</span>
          <span className="col-span-2">{book?.publishedYear}</span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Available:</span>
          <span className="col-span-2">
            <Badge variant="primary">{book?.availableCopies} copies</Badge>
          </span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="font-medium">Status:</span>
          <span className="col-span-2">
            <Badge {...getStatusProps(book?.availableCopies)}>
              {getStatusProps(book?.availableCopies).text}
            </Badge>
          </span>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewBookDialog;
