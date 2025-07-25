import Dialog from "../../common/Dialog";
import Button from "../../ui/Button";
import { useToast } from "../../../context/ToastContext"; // Add this import

const DeleteGenreDialog = ({
  isOpen,
  onClose,
  genre,
  onConfirm,
  isLoading,
}) => {
  const { showToast } = useToast(); // Add this line

  const handleConfirm = async () => {
    try {
      await onConfirm(genre);
      showToast(
        `${genre.name} deleted successfully`,
        "success",
        "Genre Deleted"
      );
    } catch (error) {
      showToast(error.message || "Failed to delete genre", "error", "Error");
    }
  };

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
          onClick={handleConfirm}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Delete Genre
        </Button>
      </div>
    </Dialog>
  );
};

export default DeleteGenreDialog;
