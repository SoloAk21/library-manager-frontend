import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooks,
  clearMessages,
  deleteBook,
} from "../../redux/books/booksSlice";
import toast from "react-hot-toast";
import AddBookDialog from "../../components/librarian/AddBookDialog";
import EditBookDialog from "../../components/librarian/EditBookDialog";
import ViewBookDialog from "../../components/librarian/ViewBookDialog";
import DeleteBookDialog from "../../components/librarian/DeleteBookDialog";
import BookCard from "../../components/common/BookCard";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { PlusIcon, SearchIcon } from "../../components/ui/icons";
import useForm from "../../hooks/useForm";
import { cn } from "../../utils/cn";

// Custom hook for books logic
const useBooks = () => {
  const dispatch = useDispatch();
  const {
    books = [],
    loading: booksLoading,
    error,
    successMessage,
  } = useSelector((state) => state.books || {});
  const { token, user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  React.useEffect(() => {
    if (token) {
      dispatch(fetchBooks());
    }
  }, [dispatch, token]);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
  }, [error, successMessage, dispatch]);

  return { books, booksLoading, token, isAdmin };
};

// Header component
const BooksHeader = ({ onAddBook, isLoading }) => (
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Books</h1>
      <p className="text-gray-600">Manage your library's book collection</p>
    </div>
    <Button onClick={onAddBook} disabled={isLoading}>
      <PlusIcon className="mr-2 h-4 w-4" />
      Add Book
    </Button>
  </div>
);

// Search component
const BooksSearch = ({ searchQuery, onChange, isLoading }) => (
  <div className="relative">
    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    <Input
      id="searchQuery"
      name="searchQuery"
      placeholder="Search books by title, author, or genre..."
      value={searchQuery}
      onChange={onChange}
      disabled={isLoading}
      className="pl-10"
    />
  </div>
);

const BooksPage = React.memo(() => {
  const { books, booksLoading, token, isAdmin } = useBooks();
  const dispatch = useDispatch();
  const initialData = { searchQuery: "" };
  const validate = () => ({});
  const { formData, handleChange } = useForm(initialData, validate);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [bookToDelete, setBookToDelete] = React.useState(null);

  const filteredBooks = useMemo(() => {
    return books.filter((book) =>
      `${book.title} ${book.author} ${book.genre}`
        .toLowerCase()
        .includes(formData.searchQuery.toLowerCase())
    );
  }, [books, formData.searchQuery]);

  const handleViewBook = React.useCallback((book) => {
    setSelectedBook(book);
    setIsViewDialogOpen(true);
  }, []);

  const handleEditBook = React.useCallback((book) => {
    setSelectedBook(book);
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteBook = React.useCallback((book) => {
    setBookToDelete(book);
    setIsDeleteDialogOpen(true);
  }, []);

  return (
    <main className={cn("flex-1 overflow-auto p-6", isAdmin && "bg-gray-100")}>
      {booksLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      <div className="space-y-6">
        <BooksHeader
          onAddBook={() => setIsAddDialogOpen(true)}
          isLoading={booksLoading}
        />
        <BooksSearch
          searchQuery={formData.searchQuery}
          onChange={handleChange}
          isLoading={booksLoading}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.length === 0 && !booksLoading && (
            <div className="text-center py-8 text-gray-500 col-span-full">
              {books.length === 0
                ? "No books available"
                : "No matching books found"}
            </div>
          )}
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onView={handleViewBook}
              onEdit={handleEditBook}
              onDelete={handleDeleteBook}
              loading={booksLoading}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </div>
      <AddBookDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
      <EditBookDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        book={selectedBook}
      />
      <ViewBookDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        book={selectedBook}
      />

      <DeleteBookDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setBookToDelete(null);
        }}
        book={bookToDelete}
      />
    </main>
  );
});

export default BooksPage;
