import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ArtistsList = () => {
  const [artists, setArtists] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newArtist, setNewArtist] = useState({ name: "", genre: "" });
  const [editArtist, setEditArtist] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/artists`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArtists(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateArtist = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/artists`, newArtist, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModalIsOpen(false);
      fetchArtists();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteArtist = async (artistId) => {
    const confirmed = window.confirm("Are you sure you want to delete this artist?");
    if (confirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/artists/${artistId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchArtists();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEditArtist = (artist) => {
    setEditArtist(artist);
    setIsEditModalOpen(true);
  };

  const handleSaveEditArtist = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/artists/${editArtist._id}`, editArtist, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditModalOpen(false);
      setEditArtist(null);
      fetchArtists();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Artists</h1>
      <button
        onClick={() => setModalIsOpen(true)}
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 mb-4"
      >Create Artist
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {artists.map((artist) => (
          <div
            key={artist._id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition duration-300 flex flex-col"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{artist.name}</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditArtist(artist)}
                  className="text-blue-500 hover:text-blue-700 transition duration-300"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteArtist(artist._id)}
                  className="text-red-500 hover:text-red-700 transition duration-300"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="mt-2">
              <Link
                to={`/artist/${artist._id}`}
                onClick={() => localStorage.setItem("artistName", artist.name)}
                className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-300 inline-block"
              >
                View Songs
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* Modal create */}
      {modalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Create Artist</h2>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={newArtist.name}
              onChange={(e) =>
                setNewArtist({ ...newArtist, name: e.target.value })
              }
              className="w-full border p-2 rounded-md mb-4"
            />
            <label className="block text-sm font-medium mb-2">Genre</label>
            <input
              type="text"
              value={newArtist.genre}
              onChange={(e) =>
                setNewArtist({ ...newArtist, genre: e.target.value })
              }
              className="w-full border p-2 rounded-md mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setModalIsOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateArtist}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar */}
      {isEditModalOpen && editArtist && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Artist</h2>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={editArtist.name}
              onChange={(e) =>
                setEditArtist({ ...editArtist, name: e.target.value })
              }
              className="w-full border p-2 rounded-md mb-4"
            />
            <label className="block text-sm font-medium mb-2">Genre</label>
            <input
              type="text"
              value={editArtist.genre}
              onChange={(e) =>
                setEditArtist({ ...editArtist, genre: e.target.value })
              }
              className="w-full border p-2 rounded-md mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditArtist}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistsList;