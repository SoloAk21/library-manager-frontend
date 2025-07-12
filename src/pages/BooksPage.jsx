import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks, clearMessages } from "../redux/books/booksSlice";
import toast from "react-hot-toast";
import AddBookDialog from "../components/AddBookDialog";
import EditBookDialog from "../components/EditBookDialog";
import ViewBookDialog from "../components/ViewBookDialog";

export default function BooksPage() {
  const dispatch = useDispatch();
  const {
    books = [],
    loading: booksLoading,
    error,
    successMessage,
  } = useSelector((state) => state.books || {});
  const { token } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Fetch books on mount and when token changes
  useEffect(() => {
    if (token) {
      dispatch(fetchBooks());
    }
  }, [dispatch, token]);

  // Handle messages and errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
  }, [error, successMessage, dispatch]);

  // Filter books based on search query
  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author} ${book.genre}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeClass = (availableCopies) => {
    return availableCopies > 0
      ? "bg-primary text-primary-foreground hover:bg-primary/80"
      : "bg-destructive text-destructive-foreground hover:bg-destructive/80";
  };

  const getStatusText = (availableCopies) => {
    return availableCopies > 0 ? "Available" : "Out of Stock";
  };

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setIsViewDialogOpen(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 overflow-auto p-6">
        {booksLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Books</h1>
              <p className="text-gray-600">
                Manage your library's book collection
              </p>
            </div>
            <button
              onClick={() => setIsAddDialogOpen(true)}
              disabled={booksLoading}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-plus mr-2 h-4 w-4"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              Add Book
            </button>
          </div>

          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input
              type="text"
              placeholder="Search books by title, author, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={booksLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.length === 0 && !booksLoading && (
              <div className="text-center py-8 text-gray-500 col-span-full">
                {books.length === 0
                  ? "No books available"
                  : "No matching books found"}
              </div>
            )}

            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col space-y-1.5 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold tracking-tight text-lg">
                        {book.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        by {book.author}
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${getStatusBadgeClass(
                        book.availableCopies
                      )}`}
                    >
                      {getStatusText(book.availableCopies)}
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Genre:</span> {book.genre}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Published:</span>{" "}
                      {book.publishedYear}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Available Copies:</span>{" "}
                      {book.availableCopies}
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => handleViewBook(book)}
                      disabled={booksLoading}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-eye h-4 w-4"
                      >
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEditBook(book)}
                      disabled={booksLoading}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-square-pen h-4 w-4"
                      >
                        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dialogs */}
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
      </main>
    </div>
  );
}
