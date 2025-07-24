import React from "react";
import { cn } from "../../utils/cn";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { EyeIcon, SquarePenIcon, TrashIcon } from "../ui/icons";

const BookCard = React.memo(
  ({ book, onView, onEdit, onDelete, loading, isAdmin }) => {
    const getStatusProps = (availableCopies) => ({
      variant: availableCopies > 0 ? "primary" : "destructive",
      text: availableCopies > 0 ? "Available" : "Out of Stock",
    });
    console.log("Rendering BookCard for:", book);

    return (
      <div
        className={cn(
          "rounded-lg border border-primary/10 bg-white text-card-foreground shadow-xs hover:shadow-md transition-shadow",
          isAdmin && "border-primary bg-white"
        )}
      >
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-semibold text-lg">{book.title}</div>
              <div className="text-sm text-gray-500">by {book.author}</div>
            </div>
            <Badge {...getStatusProps(book.availableCopies)}>
              {getStatusProps(book.availableCopies).text}
            </Badge>
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Genre:</span> {book.genre}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Published:</span>{" "}
              {book.publishedYear}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Available Copies:</span>{" "}
              {book.availableCopies}
            </p>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="secondary"
              onClick={() => onView(book)}
              disabled={loading}
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => onEdit(book)}
              disabled={loading}
            >
              <SquarePenIcon className="h-4 w-4" />
            </Button>
            {isAdmin && (
              <Button
                variant="secondary"
                onClick={() => onDelete(book)}
                disabled={loading}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default BookCard;
