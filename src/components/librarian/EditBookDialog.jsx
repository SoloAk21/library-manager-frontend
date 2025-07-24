import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "../common/Dialog";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { updateBook, clearMessages } from "../../redux/books/booksSlice";
import { fetchGenres } from "../../redux/genres/genresSlice";
import toast from "react-hot-toast";

const EditBookDialog = ({ isOpen, onClose, book }) => {
  const dispatch = useDispatch();
  const { genres, loading: genresLoading } = useSelector(
    (state) => state.genres
  );
  const {
    loading: isSubmitting,
    successMessage,
    error,
  } = useSelector((state) => state.books);

  const initialFormState = {
    title: "",
    author: "",
    publishedYear: "",
    availableCopies: "",
    genreId: "",
    genreName: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialFormState);
  const [genresLoaded, setGenresLoaded] = useState(false);
  const prevSuccessMessage = useRef(null);
  const prevError = useRef(null);

  useEffect(() => {
    let toastId = null;

    // Only show toast if successMessage has changed and is non-empty
    if (successMessage && successMessage !== prevSuccessMessage.current) {
      toastId = toast.success(successMessage, {
        id: "success",
        data: { title: "Success" },
      });
      dispatch(clearMessages());
      setTimeout(() => {
        onClose();
      }, 1500);
    }

    // Only show toast if error has changed and is non-empty
    if (error && error !== prevError.current) {
      toastId = toast.error(error, { id: "error", data: { title: "Error" } });
      dispatch(clearMessages());
    }

    // Update refs with current values
    prevSuccessMessage.current = successMessage;
    prevError.current = error;

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [successMessage, error, dispatch, onClose]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchGenres());
      setGenresLoaded(true);
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (isOpen && book && genres.length > 0) {
      const currentGenre = genres.find((g) => g.id === book.genreId);
      setFormData({
        title: book.title || "",
        author: book.author || "",
        publishedYear: book.publishedYear?.toString() || "",
        availableCopies: book.availableCopies?.toString() || "",
        genreId: book.genreId?.toString() || "",
        genreName: currentGenre?.name || "",
      });
    }
  }, [isOpen, book, genres]);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormState);
      setErrors(initialFormState);
      dispatch(clearMessages());
    }
  }, [isOpen, dispatch]);

  const validateForm = () => {
    const newErrors = { ...initialFormState };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
      isValid = false;
    }

    const publishedYear = parseInt(formData.publishedYear);
    if (isNaN(publishedYear)) {
      newErrors.publishedYear = "Published year must be a number";
      isValid = false;
    } else if (publishedYear < 1800) {
      newErrors.publishedYear = "Published year must not be less than 1800";
      isValid = false;
    }

    const availableCopies = parseInt(formData.availableCopies);
    if (isNaN(availableCopies)) {
      newErrors.availableCopies = "Available copies must be a number";
      isValid = false;
    } else if (availableCopies < 0) {
      newErrors.availableCopies = "Available copies must be a positive number";
      isValid = false;
    }

    const genreId = parseInt(formData.genreId);
    if (isNaN(genreId)) {
      newErrors.genreId = "Please select a valid genre";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(
      updateBook({
        bookId: book.id,
        bookData: {
          ...formData,
          publishedYear: parseInt(formData.publishedYear),
          availableCopies: parseInt(formData.availableCopies),
          genreId: parseInt(formData.genreId),
        },
      })
    );
  };

  if (!book) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Book"
      description="Update the book information below."
    >
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            disabled={isSubmitting}
            placeholder="Enter book title"
            label="Title"
            required
          />
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            error={errors.author}
            disabled={isSubmitting}
            placeholder="Enter author name"
            label="Author"
            required
          />
          <Input
            id="publishedYear"
            name="publishedYear"
            type="number"
            min="1800"
            value={formData.publishedYear}
            onChange={handleChange}
            error={errors.publishedYear}
            disabled={isSubmitting}
            placeholder="Enter published year"
            label="Published Year"
            required
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
            label="Available Copies"
            required
          />
          <Select
            id="genreId"
            name="genreId"
            value={formData.genreId}
            onChange={handleChange}
            error={errors.genreId}
            disabled={isSubmitting || genresLoading}
            label="Genre"
            required
            selectedLabel={formData.genreName}
          >
            <option value="" hidden>
              {genresLoading ? "Loading genres..." : "Select a genre"}
            </option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </Select>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Update Book
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default EditBookDialog;
