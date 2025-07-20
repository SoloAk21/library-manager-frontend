import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "../common/Dialog";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { createBook } from "../../redux/books/booksSlice";
import { fetchGenres } from "../../redux/genres/genresSlice";
import toast from "react-hot-toast";

const AddBookDialog = ({ isOpen, onClose }) => {
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

  // Fetch genres when dialog opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchGenres());
    }
  }, [isOpen, dispatch]);

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
        createBook({
          ...formData,
          publishedYear: parseInt(formData.publishedYear),
          availableCopies: parseInt(formData.availableCopies),
          genreId: parseInt(formData.genreId),
        })
      ).unwrap();

      toast.success("Book created successfully!");
      onClose();
      // Reset form after successful submission
      setFormData({
        title: "",
        author: "",
        publishedYear: "",
        availableCopies: "",
        genreId: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to create book");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Book"
      description="Enter the details for the new book."
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
          label="Title"
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
            Create Book
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default AddBookDialog;
