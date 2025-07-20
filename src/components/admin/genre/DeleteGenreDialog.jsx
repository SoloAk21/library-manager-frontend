import Dialog from "../../common/Dialog";
import Button from "../../ui/Button";

const DeleteGenreDialog = ({
  isOpen,
  onClose,
  genre,
  onConfirm,
  isLoading,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Genre"
      description={`Are you sure you want to delete "${genre?.name}"? This action cannot be undone.`}
    >
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={() => onConfirm(genre)}
          isLoading={isLoading}
        >
          Delete Genre
        </Button>
      </div>
    </Dialog>
  );
};

export default DeleteGenreDialog;
