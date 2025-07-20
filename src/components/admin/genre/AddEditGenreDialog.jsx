import React from "react";
import Dialog from "../../common/Dialog";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const AddEditGenreDialog = ({
  isOpen,
  onClose,
  genre,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = React.useState(genre?.name || "");

  React.useEffect(() => {
    if (isOpen) {
      setName(genre?.name || "");
    }
  }, [isOpen, genre]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={genre ? "Edit Genre" : "Add New Genre"}
      description={
        genre
          ? "Update the genre information below."
          : "Enter the details for the new genre."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter genre name"
          required
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {genre ? "Update Genre" : "Create Genre"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default AddEditGenreDialog;
