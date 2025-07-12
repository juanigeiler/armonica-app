import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApiRequest } from "../hooks/useApiRequest";

const ArtistsList = () => {
  const [artists, setArtists] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState(null);
  const [newArtist, setNewArtist] = useState({ name: "", genre: "" });
  const [editArtist, setEditArtist] = useState(null);
  const { logout, isAuthenticated } = useAuth();
  const api = useApiRequest();

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await api.get('/artists');
      setArtists(response.data);
    } catch (error) {
      console.error('Error fetching artists:', error);
      // El hook ya maneja automáticamente el logout si el token expiró
    }
  };

  const handleCreateArtist = async () => {
    try {
      await api.post('/artists', newArtist);
      setModalIsOpen(false);
      setNewArtist({ name: "", genre: "" });
      fetchArtists();
    } catch (error) {
      console.error('Error creating artist:', error);
    }
  };

  const handleDeleteArtist = async (artistId) => {
    setArtistToDelete(artistId);
    setDeleteModalIsOpen(true);
  };

  const confirmDeleteArtist = async () => {
    if (artistToDelete) {
      try {
        await api.delete(`/artists/${artistToDelete}`);
        fetchArtists();
        setDeleteModalIsOpen(false);
        setArtistToDelete(null);
      } catch (error) {
        console.error('Error deleting artist:', error);
      }
    }
  };

  const cancelDeleteArtist = () => {
    setDeleteModalIsOpen(false);
    setArtistToDelete(null);
  };

  const handleEditArtist = (artist) => {
    setEditArtist(artist);
    setIsEditModalOpen(true);
  };

  const handleSaveEditArtist = async () => {
    try {
      await api.put(`/artists/${editArtist._id}`, editArtist);
      setIsEditModalOpen(false);
      setEditArtist(null);
      fetchArtists();
    } catch (error) {
      console.error('Error updating artist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Patrón de fondo musical */}
      <div className="absolute inset-0 opacity-5">
        <div className="text-9xl text-gray-400 absolute top-20 left-10 transform rotate-12">♪</div>
        <div className="text-7xl text-gray-400 absolute top-40 right-20 transform -rotate-12">♫</div>
        <div className="text-6xl text-gray-400 absolute bottom-32 left-1/4 transform rotate-45">♩</div>
        <div className="text-8xl text-gray-400 absolute bottom-20 right-1/3 transform -rotate-45">♬</div>
      </div>
      
      <div className="relative container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🎵 Artists Collection
          </h1>
          <p className="text-gray-600 text-lg">Discover and manage your musical library</p>
          {!isAuthenticated && (
            <p className="text-gray-500 text-sm mt-2">
              🔒 Login required to create, edit, or delete artists
            </p>
          )}
        </div>
        
        {isAuthenticated && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setModalIsOpen(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-8 rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              <span className="flex items-center space-x-2">
                <span>✨</span>
                <span>Create New Artist</span>
                <span>🎤</span>
              </span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artists.map((artist) => (
            <div
              key={artist._id}
              className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 flex flex-col transform hover:-translate-y-2 border border-purple-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{artist.name}</h2>
                {isAuthenticated && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditArtist(artist)}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-300 text-xl hover:scale-110 transform"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteArtist(artist._id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-300 text-xl hover:scale-110 transform"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium">
                  {artist.genre || "Genre"}
                </span>
              </div>
              
              <div className="mt-auto">
                <Link
                  to={`/artist/${artist._id}`}
                  onClick={() => localStorage.setItem("artistName", artist.name)}
                  className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-center font-semibold transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>🎵</span>
                    <span>View Songs</span>
                    <span>→</span>
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Modales mantienen el diseño actual pero con pequeñas mejoras */}
        {modalIsOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-t-4 border-emerald-500">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                🎤 Create Artist
              </h2>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Artist Name</label>
              <input
                type="text"
                value={newArtist.name}
                onChange={(e) =>
                  setNewArtist({ ...newArtist, name: e.target.value })
                }
                className="w-full border-2 border-gray-200 focus:border-emerald-500 p-3 rounded-xl mb-4 transition-colors duration-300"
                placeholder="Enter artist name..."
              />
              <label className="block text-sm font-semibold mb-2 text-gray-700">Genre</label>
              <input
                type="text"
                value={newArtist.genre}
                onChange={(e) =>
                  setNewArtist({ ...newArtist, genre: e.target.value })
                }
                className="w-full border-2 border-gray-200 focus:border-emerald-500 p-3 rounded-xl mb-6 transition-colors duration-300"
                placeholder="Enter genre..."
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setModalIsOpen(false)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateArtist}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg"
                >
                  Create ✨
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de edición similar con los mismos estilos */}
        {isEditModalOpen && editArtist && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-t-4 border-blue-500">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ✏️ Edit Artist
              </h2>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Artist Name</label>
              <input
                type="text"
                value={editArtist.name}
                onChange={(e) =>
                  setEditArtist({ ...editArtist, name: e.target.value })
                }
                className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-xl mb-4 transition-colors duration-300"
              />
              <label className="block text-sm font-semibold mb-2 text-gray-700">Genre</label>
              <input
                type="text"
                value={editArtist.genre}
                onChange={(e) =>
                  setEditArtist({ ...editArtist, genre: e.target.value })
                }
                className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-xl mb-6 transition-colors duration-300"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditArtist}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  Save Changes ✨
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalIsOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-t-4 border-red-500">
              <div className="text-center">
                <div className="mb-4">
                  <span className="text-6xl">🗑️</span>
                </div>
                
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Delete Artist
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this artist? This action will also delete all associated songs and cannot be undone.
                </p>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={cancelDeleteArtist}
                    className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteArtist}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg font-semibold"
                  >
                    Delete Artist
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistsList;