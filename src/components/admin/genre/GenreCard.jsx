import React from "react";
import Button from "../../ui/Button";
import { PencilIcon, TrashIcon } from "../../ui/icons";

const GenreCard = React.memo(
  ({ genre, onEdit, onDelete, loading, isAdmin }) => {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col space-y-1.5 p-6 pb-3">
          <div className="flex justify-between items-center">
            <div className="font-semibold tracking-tight text-lg">
              {genre.name}
            </div>
            {isAdmin && (
              <div className="flex space-x-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(genre)}
                  disabled={loading}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onDelete(genre)}
                  disabled={loading}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-sm text-muted-foreground">
            Genre ID: {genre.id}
          </div>
        </div>
      </div>
    );
  }
);

export default GenreCard;
