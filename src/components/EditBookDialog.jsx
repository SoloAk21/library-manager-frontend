import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBook } from "../redux/books/booksSlice";
import { fetchGenres } from "../redux/genres/genresSlice";
import Dialog from "./Dialog";
import toast from "react-hot-toast";

const EditBookDialog = ({ isOpen, onClose, book }) => {
  const dispatch = useDispatch();
  const { genres, loading: genresLoading } = useSelector(
    (state) => state.genres
  );

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishedYear: "",
    availableCopies: "",
    genreId: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    author: "",
    publishedYear: "",
    availableCopies: "",
    genreId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch genres and set initial form data when dialog opens or book changes
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchGenres());
      if (book) {
        setFormData({
          title: book.title,
          author: book.author,
          publishedYear: book.publishedYear.toString(),
          availableCopies: book.availableCopies.toString(),
          genreId: book.genreId.toString(),
        });
      }
    }
  }, [isOpen, book, dispatch]);

  const validateForm = () => {
    const newErrors = {
      title: "",
      author: "",
      publishedYear: "",
      availableCopies: "",
      genreId: "",
    };
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
    if (!formData.publishedYear || isNaN(publishedYear)) {
      newErrors.publishedYear = "Published year must be a number";
      isValid = false;
    } else if (publishedYear < 1800) {
      newErrors.publishedYear = "Published year must not be less than 1800";
      isValid = false;
    }

    const availableCopies = parseInt(formData.availableCopies);
    if (!formData.availableCopies || isNaN(availableCopies)) {
      newErrors.availableCopies = "Available copies must be a number";
      isValid = false;
    } else if (availableCopies < 0) {
      newErrors.availableCopies = "Available copies must be a positive number";
      isValid = false;
    }

    const genreId = parseInt(formData.genreId);
    if (!formData.genreId || isNaN(genreId)) {
      newErrors.genreId = "Please select a valid genre";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        updateBook({
          bookId: book.id,
          bookData: {
            title: formData.title,
            author: formData.author,
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
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none text-gray-700"
            htmlFor="title"
          >
            Title
          </label>
          <input
            className={`flex h-10 w-full rounded-md border ${
              errors.title ? "border-destructive" : "border-gray-300"
            } bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none text-gray-700"
            htmlFor="author"
          >
            Author
          </label>
          <input
            className={`flex h-10 w-full rounded-md border ${
              errors.author ? "border-destructive" : "border-gray-300"
            } bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            id="author"
            name="author"
            required
            value={formData.author}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.author && (
            <p className="text-sm text-destructive">{errors.author}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none text-gray-700"
            htmlFor="publishedYear"
          >
            Published Year
          </label>
          <input
            className={`flex h-10 w-full rounded-md border ${
              errors.publishedYear ? "border-destructive" : "border-gray-300"
            } bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            id="publishedYear"
            name="publishedYear"
            type="number"
            min="1800"
            max={new Date().getFullYear()}
            required
            value={formData.publishedYear}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.publishedYear && (
            <p className="text-sm text-destructive">{errors.publishedYear}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none text-gray-700"
            htmlFor="availableCopies"
          >
            Available Copies
          </label>
          <input
            className={`flex h-10 w-full rounded-md border ${
              errors.availableCopies ? "border-destructive" : "border-gray-300"
            } bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            id="availableCopies"
            name="availableCopies"
            type="number"
            min="0"
            required
            value={formData.availableCopies}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.availableCopies && (
            <p className="text-sm text-destructive">{errors.availableCopies}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none text-gray-700"
            htmlFor="genreId"
          >
            Genre
          </label>
          <select
            className={`flex h-10 w-full rounded-md border ${
              errors.genreId ? "border-destructive" : "border-gray-300"
            } bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            id="genreId"
            name="genreId"
            required
            value={formData.genreId}
            onChange={handleChange}
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
          </select>
          {errors.genreId && (
            <p className="text-sm text-destructive">{errors.genreId}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || genresLoading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
          >
            {isSubmitting ? "Updating..." : "Update Book"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default EditBookDialog;
