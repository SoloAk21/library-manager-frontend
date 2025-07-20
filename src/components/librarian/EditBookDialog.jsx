import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "../common/Dialog";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import useForm from "../../hooks/useForm";
import { updateBook } from "../../redux/books/booksSlice";
import { fetchGenres } from "../../redux/genres/genresSlice";
import toast from "react-hot-toast";

const EditBookDialog = ({ isOpen, onClose, book }) => {
  const dispatch = useDispatch();
  const { genres, loading: genresLoading } = useSelector(
    (state) => state.genres
  );
  const initialData = {
    title: book?.title || "",
    author: book?.author || "",
    publishedYear: book?.publishedYear?.toString() || "",
    availableCopies: book?.availableCopies?.toString() || "",
    genreId: book?.genreId?.toString() || "",
  };

  const validate = (data) => {
    const errors = {};
    if (!data.title.trim()) errors.title = "Title is required";
    if (!data.author.trim()) errors.author = "Author is required";
    const year = parseInt(data.publishedYear);
    if (isNaN(year)) errors.publishedYear = "Published year must be a number";
    else if (year < 1800) errors.publishedYear = "Year must be >= 1800";
    const copies = parseInt(data.availableCopies);
    if (isNaN(copies))
      errors.availableCopies = "Available copies must be a number";
    else if (copies < 0) errors.availableCopies = "Copies must be >= 0";
    if (!data.genreId || isNaN(parseInt(data.genreId)))
      errors.genreId = "Please select a valid genre";
    return errors;
  };

  const { formData, errors, handleChange, validateForm, setFormData } = useForm(
    initialData,
    validate
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchGenres());
      setFormData(initialData);
    }
  }, [isOpen, book, dispatch, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await dispatch(
        updateBook({
          bookId: book.id,
          bookData: {
            ...formData,
            publishedYear: parseInt(formData.publishedYear),
            availableCopies: parseInt(formData.availableCopies),
            genreId: parseInt(formData.genreId),
          },
        })
      ).unwrap();
      toast.success("Book updated successfully!");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to update book");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!book) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Book"
      description="Update the book information below."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          disabled={isSubmitting}
          placeholder="Enter book title"
        />
        <Input
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          error={errors.author}
          disabled={isSubmitting}
          placeholder="Enter author name"
        />
        <Input
          id="publishedYear"
          name="publishedYear"
          type="number"
          min="1800"
          max={new Date().getFullYear()}
          value={formData.publishedYear}
          onChange={handleChange}
          error={errors.publishedYear}
          disabled={isSubmitting}
          placeholder="Enter published year"
        />
        <Input
          id="availableCopies"
          name="availableCopies"
          type="number"
          min="0"
          value={formData.availableCopies}
          onChange={handleChange}
          error={errors.availableCopies}
          disabled={isSubmitting}
          placeholder="Enter available copies"
        />
        <Select
          id="genreId"
          name="genreId"
          value={formData.genreId}
          onChange={handleChange}
          error={errors.genreId}
          disabled={isSubmitting || genresLoading}
        >
          <option value="">
            {genresLoading ? "Loading genres..." : "Select a genre"}
          </option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </Select>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Update Book
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default EditBookDialog;
