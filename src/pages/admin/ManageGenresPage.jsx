import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGenres,
  createGenre,
  updateGenre,
  deleteGenre,
} from "../../redux/genres/genresSlice";
import GenreCard from "../../components/admin/genre/GenreCard";
import AddEditGenreDialog from "../../components/admin/genre/AddEditGenreDialog";
import DeleteGenreDialog from "../../components/admin/genre/DeleteGenreDialog";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { PlusIcon, SearchIcon } from "../../components/ui/icons";
import useForm from "../../hooks/useForm";

const useGenres = () => {
  const dispatch = useDispatch();
  const {
    genres = [],
    loading: genresLoading,
    error,
    successMessage,
  } = useSelector((state) => state.genres || {});
  const { token, user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (token) {
      dispatch(fetchGenres());
    }
  }, [dispatch, token]);

  return { genres, genresLoading, isAdmin };
};

const GenresHeader = ({ onAddGenre, isLoading, isAdmin }) => (
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Genres</h1>
      <p className="text-gray-600">
        {isAdmin ? "Manage book genres" : "Browse book genres"}
      </p>
    </div>
    {isAdmin && (
      <Button onClick={onAddGenre} disabled={isLoading}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Genre
      </Button>
    )}
  </div>
);

const GenresSearch = ({ searchQuery, onChange, isLoading }) => (
  <div className="relative">
    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    <Input
      id="searchQuery"
      name="searchQuery"
      placeholder="Search genres..."
      value={searchQuery}
      onChange={onChange}
      disabled={isLoading}
      className="pl-10"
    />
  </div>
);

const ManageGenresPage = () => {
  const { genres, genresLoading, isAdmin } = useGenres();
  const dispatch = useDispatch();

  const initialData = { searchQuery: "" };
  const validate = () => ({});
  const { formData, handleChange } = useForm(initialData, validate);

  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const filteredGenres = React.useMemo(() => {
    return genres.filter((genre) =>
      genre.name.toLowerCase().includes(formData.searchQuery.toLowerCase())
    );
  }, [genres, formData.searchQuery]);

  const handleAddGenre = () => {
    setSelectedGenre(null);
    setIsAddEditDialogOpen(true);
  };

  const handleEditGenre = (genre) => {
    setSelectedGenre(genre);
    setIsAddEditDialogOpen(true);
  };

  const handleDeleteGenre = (genre) => {
    setSelectedGenre(genre);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitGenre = async (name) => {
    if (selectedGenre) {
      await dispatch(
        updateGenre({ genreId: selectedGenre.id, genreData: { name } })
      );
    } else {
      await dispatch(createGenre({ name }));
    }
    setIsAddEditDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedGenre) {
      await dispatch(deleteGenre(selectedGenre.id));
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      {genresLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      <div className="space-y-6">
        <GenresHeader
          onAddGenre={handleAddGenre}
          isLoading={genresLoading}
          isAdmin={isAdmin}
        />
        <GenresSearch
          searchQuery={formData.searchQuery}
          onChange={handleChange}
          isLoading={genresLoading}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGenres.length === 0 && !genresLoading ? (
            <div className="text-center py-8 text-gray-500 col-span-full">
              {genres.length === 0
                ? "No genres available"
                : "No matching genres found"}
            </div>
          ) : (
            filteredGenres.map((genre) => (
              <GenreCard
                key={genre.id}
                genre={genre}
                onEdit={isAdmin ? handleEditGenre : null}
                onDelete={isAdmin ? handleDeleteGenre : null}
                loading={genresLoading}
                isAdmin={isAdmin}
              />
            ))
          )}
        </div>
      </div>

      <AddEditGenreDialog
        isOpen={isAddEditDialogOpen}
        onClose={() => setIsAddEditDialogOpen(false)}
        genre={selectedGenre}
        onSubmit={handleSubmitGenre}
        isLoading={genresLoading}
      />

      <DeleteGenreDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        genre={selectedGenre}
        onConfirm={handleConfirmDelete}
        isLoading={genresLoading}
      />
    </main>
  );
};

export default ManageGenresPage;
