import React from "react";
import Card from "./Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { EyeIcon, SquarePenIcon, TrashIcon } from "../ui/icons";

const BookCard = React.memo(
  ({ book, onView, onEdit, onDelete, loading, isAdmin }) => {
    const getStatusProps = (availableCopies) => ({
      variant: availableCopies > 0 ? "primary" : "destructive",
      text: availableCopies > 0 ? "Available" : "Out of Stock",
    });

    const statusBadge = (
      <Badge {...getStatusProps(book.availableCopies)}>
        {getStatusProps(book.availableCopies).text}
      </Badge>
    );

    const footerActions = (
      <>
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
      </>
    );

    return (
      <Card
        title={book.title}
        subtitle={`by ${book.author}`}
        headerActions={statusBadge}
        footerActions={footerActions}
      >
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Genre:</span> {book.genre}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Published:</span> {book.publishedYear}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Available Copies:</span>{" "}
            {book.availableCopies}
          </p>
        </div>
      </Card>
    );
  }
);

export default BookCard;
