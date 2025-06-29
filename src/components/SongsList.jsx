import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Rating from '@mui/material/Rating';
import { useAuth } from "../context/AuthContext";

const SongsList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [artistName, setArtistName] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [newSong, setNewSong] = useState({ title: "", album: "", key: "", difficulty: 0, spotify_song_id: "", tabs: "" });
  const { token } = useAuth();

  useEffect(() => {
    const storedArtistName = localStorage.getItem("artistName");
    setArtistName(storedArtistName || "");

    const fetchSongs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/artists/${id}/songs`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSongs(response.data);
      } catch (error) {
        console.error("Error al obtener las canciones:", error);
      }
    };

    fetchSongs();
  }, [id, token]);

  const openViewModal = (song) => {
    setSelectedSong(song);
    setViewModalIsOpen(true);
  };

  const closeViewModal = () => {
    setSelectedSong(null);
    setViewModalIsOpen(false);
  };

  const openCreateModal = () => {
    setCreateModalIsOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalIsOpen(false);
    setNewSong({ title: "", album: "", key: "", difficulty: 0, spotify_song_id: "", tabs: "" });
  };

  const openEditModal = (song) => {
    setSelectedSong(song);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setSelectedSong(null);
    setEditModalIsOpen(false);
  };

  const handleCreateSong = async () => {
    const songData = { ...newSong, artistId: id };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/songs`, songData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSongs((prevSongs) => [...prevSongs, response.data]);
      closeCreateModal();
    } catch (error) {
      console.error("Error creating song:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSong((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (event, newValue) => {
    setNewSong((prev) => ({ ...prev, difficulty: newValue }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedSong((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditRatingChange = (event, newValue) => {
    setSelectedSong((prev) => ({ ...prev, difficulty: newValue }));
  };

  const handleEditSong = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/songs/${selectedSong._id}`, selectedSong, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSongs((prevSongs) =>
        prevSongs.map((song) =>
          song._id === response.data._id ? response.data : song
        )
      );
      closeEditModal();
    } catch (error) {
      console.error("Error updating song:", error);
    }
  };

  const handleDeleteSong = async (songId) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/songs/${songId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSongs((prevSongs) => prevSongs.filter((song) => song._id !== songId));
      } catch (error) {
        console.error("Error deleting song:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Patrón musical de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="text-9xl text-blue-400 absolute top-16 left-16 transform rotate-12">🎵</div>
        <div className="text-7xl text-purple-400 absolute top-32 right-24 transform -rotate-12">🎶</div>
        <div className="text-6xl text-indigo-400 absolute bottom-40 left-1/3 transform rotate-45">🎼</div>
        <div className="text-8xl text-blue-400 absolute bottom-24 right-1/4 transform -rotate-45">♪</div>
      </div>

      <div className="relative container mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-full hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
          >
            <span className="flex items-center space-x-2">
              <span>⬅</span>
              <span>Back to Artists</span>
            </span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            🎵 {artistName}
          </h1>
          <p className="text-gray-600 text-lg">Explore the musical collection</p>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-8 rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
          >
            <span className="flex items-center space-x-2">
              <span>✨</span>
              <span>Add New Song</span>
              <span>🎤</span>
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {songs.map((song) => (
            <div
              key={song._id}
              className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 flex flex-col transform hover:-translate-y-2 border border-blue-100"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{song.title}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(song)}
                    className="text-blue-500 hover:text-blue-700 transition duration-300"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteSong(song._id)}
                    className="text-red-500 hover:text-red-700 transition duration-300"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <button
                  onClick={() => openViewModal(song)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                >
                  View Tabs
                </button>
                <div className="ml-4 mt-1">
                  <Rating
                    name="difficulty"
                    defaultValue={song.difficulty}
                    precision={1}
                    readOnly
                    size="small"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Modal */}
        {viewModalIsOpen && selectedSong && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start pt-20 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeViewModal();
            }}
          >
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full mx-4 relative">
              <button
                onClick={closeViewModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close"
              >
                ✖
              </button>

              <div className="max-h-[80vh] overflow-auto">
                <h2 className="text-2xl font-bold">{selectedSong.title}</h2>
                <p className="text-gray-700 mt-4">
                  <strong>Album:</strong> {selectedSong.album}
                </p>
                <div className="mt-2 flex items-left ">
                  <strong className="mr-2">Key: </strong> {selectedSong.key}
                  <span className="mx-3"></span>
                  <strong className="mr-2">Difficulty:</strong> 
                  <Rating 
                    name="difficulty" 
                    id={`difficulty-${selectedSong._id}`} 
                    value={selectedSong.difficulty} 
                    precision={1} 
                    readOnly 
                  />
                </div>
                {selectedSong.spotify_song_id && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg">Spotify Player</h3>
                    <iframe
                      src={`https://open.spotify.com/embed/track/${selectedSong.spotify_song_id}`}
                      width="380"
                      height="80"
                      allow="encrypted-media"
                      className="mt-4"
                      title="Spotify iFrame"
                    ></iframe>
                  </div>
                )}
                <h3 className="mt-6 font-semibold text-lg">Tabs:</h3>
                <pre className="bg-gray-100 p-6 rounded-md mt-4 text-lg overflow-auto">
                  {selectedSong.tabs}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Create Modal */}
        {createModalIsOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Create New Song</h2>
              <input
                type="text"
                name="title"
                value={newSong.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full border rounded-md p-2 mb-4"
              />
              <input
                type="text"
                name="album"
                value={newSong.album}
                onChange={handleChange}
                placeholder="Album"
                className="w-full border rounded-md p-2 mb-4"
              />
              <input
                type="text"
                name="key"
                value={newSong.key}
                onChange={handleChange}
                placeholder="Key"
                className="w-full border rounded-md p-2 mb-4"
              />
              <input
                type="text"
                name="spotify_song_id"
                value={newSong.spotify_song_id}
                onChange={handleChange}
                placeholder="Spotify Song Id"
                className="w-full border rounded-md p-2 mb-4"
              />
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Difficulty:</label>
                <Rating 
                  name="difficulty" 
                  value={newSong.difficulty} 
                  onChange={handleRatingChange}
                  precision={1} 
                />
              </div>
              <textarea
                name="tabs"
                value={newSong.tabs}
                onChange={handleChange}
                placeholder="Tabs"
                className="w-full border rounded-md p-2 mb-4"
                rows="6"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeCreateModal}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSong}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModalIsOpen && selectedSong && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Edit Song</h2>
              <input
                type="text"
                name="title"
                value={selectedSong.title}
                onChange={handleEditChange}
                placeholder="Title"
                className="w-full border rounded-md p-2 mb-4"
              />
              <input
                type="text"
                name="album"
                value={selectedSong.album}
                onChange={handleEditChange}
                placeholder="Album"
                className="w-full border rounded-md p-2 mb-4"
              />
              <input
                type="text"
                name="key"
                value={selectedSong.key}
                onChange={handleEditChange}
                placeholder="Key"
                className="w-full border rounded-md p-2 mb-4"
              />
              <input
                type="text"
                name="spotify_song_id"
                value={selectedSong.spotify_song_id}
                onChange={handleEditChange}
                placeholder="Spotify Song Id"
                className="w-full border rounded-md p-2 mb-4"
              />
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Difficulty:</label>
                <Rating 
                  name="difficulty" 
                  value={selectedSong.difficulty} 
                  onChange={handleEditRatingChange}
                  precision={1} 
                />
              </div>
              <textarea
                name="tabs"
                value={selectedSong.tabs}
                onChange={handleEditChange}
                placeholder="Tabs"
                className="w-full border rounded-md p-2 mb-4"
                rows="6"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeEditModal}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSong}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongsList;