import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Rating } from '@mui/material';
import { useAuth } from "../context/AuthContext";
import { useApiRequest } from "../hooks/useApiRequest";
import TabsViewer from "./TabsViewer";

const SongsList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [artistName, setArtistName] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const [newSong, setNewSong] = useState({ title: "", album: "", key: "", difficulty: 0, spotify_song_id: "", tabs: "" });
  const { token, isAuthenticated } = useAuth();
  const api = useApiRequest();

  useEffect(() => {
    const storedArtistName = localStorage.getItem("artistName");
    setArtistName(storedArtistName || "");

    const fetchSongs = async () => {
      try {
        const response = await api.get(`/artists/${id}/songs`);
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
      const response = await api.post('/songs', songData);
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
      const response = await api.put(`/songs/${selectedSong._id}`, selectedSong);
      // Actualizar la lista de canciones con la canción editada
      setSongs((prevSongs) => {
        const updatedSongs = prevSongs.map((song) =>
          song._id === response.data._id ? response.data : song
        );
        return updatedSongs;
      });
      // Cerrar el modal
      closeEditModal();
    } catch (error) {
      console.error("Error updating song:", error);
    }
  };

  const handleDeleteSong = async (songId) => {
    setSongToDelete(songId);
    setDeleteModalIsOpen(true);
  };

  const confirmDeleteSong = async () => {
    if (songToDelete) {
      try {
        await api.delete(`/songs/${songToDelete}`);
        setSongs((prevSongs) => prevSongs.filter((song) => song._id !== songToDelete));
        setDeleteModalIsOpen(false);
        setSongToDelete(null);
      } catch (error) {
        console.error("Error deleting song:", error);
      }
    }
  };

  const cancelDeleteSong = () => {
    setDeleteModalIsOpen(false);
    setSongToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 relative">
      {/* Subtle geometric pattern */}
      <div className="absolute inset-0 opacity-[0.25]" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, #8b5cf6 2px, transparent 2px),
                         radial-gradient(circle at 75% 75%, #3b82f6 1px, transparent 1px),
                         radial-gradient(circle at 50% 50%, #6366f1 1px, transparent 1px)`,
        backgroundSize: '60px 60px, 80px 80px, 40px 40px',
        backgroundPosition: '0 0, 20px 20px, 10px 10px'
      }}></div>
      
      <div className="relative container mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-full hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
          >
            <span className="flex items-center space-x-2">
              <span>⬅</span>
              <span>Back to Artists</span>
            </span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 font-['Space_Grotesk']">
            🎵 {artistName}
          </h1>
          <p className="text-gray-600 text-lg">Explore the musical collection</p>
          {!isAuthenticated && (
            <p className="text-gray-500 text-sm mt-2">
              🔒 Login required to create, edit, or delete songs
            </p>
          )}
        </div>

        {isAuthenticated && (
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
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {songs.map((song) => (
            <div
              key={song._id}
              className="bg-gray-50/95 backdrop-blur-sm shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 flex flex-col transform hover:-translate-y-3 hover:bg-white group"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-gray-800 font-['Space_Grotesk']">{song.title}</h2>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-1">
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-1.5 hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 animate-bounce delay-100">
                      <button
                        onClick={() => openEditModal(song)}
                        className="text-blue-500 hover:text-blue-700 transition duration-300 hover:scale-110 transform"
                      >
                        ✏️
                      </button>
                    </div>
                    <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-full p-1.5 hover:from-red-200 hover:to-pink-200 transition-all duration-300 animate-bounce delay-200">
                      <button
                        onClick={() => handleDeleteSong(song._id)}
                        className="text-red-500 hover:text-red-700 transition duration-300 hover:scale-110 transform"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full p-1.5 hover:from-emerald-200 hover:to-teal-200 transition-all duration-300 animate-bounce delay-300">
                      <button
                        onClick={() => openViewModal(song)}
                        className="text-emerald-600 hover:text-emerald-700 transition duration-300 hover:scale-110 transform"
                        title="View Tabs"
                      >
                        📖
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full p-1.5 hover:from-emerald-200 hover:to-teal-200 transition-all duration-300 animate-bounce delay-100">
                      <button
                        onClick={() => openViewModal(song)}
                        className="text-emerald-600 hover:text-emerald-700 transition duration-300 hover:scale-110 transform"
                        title="View Tabs"
                      >
                        📖
                      </button>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-full p-1.5 animate-bounce delay-300">
                      <span className="text-purple-600 text-sm">🎵</span>
                    </div>
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-1.5 animate-bounce delay-400">
                      <span className="text-blue-600 text-sm">🎶</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm">
                  {song.key && (
                    <div className="flex items-center space-x-1">
                      <span className="text-base text-gray-500 font-medium">🎼</span>
                      <span className={`px-2 py-1 rounded-full text-sm font-bold text-white
                        ${song.key === 'C' ? 'bg-sky-400' : 
                          song.key === 'D' ? 'bg-orange-400' :
                          song.key === 'E' ? 'bg-yellow-400' :
                          song.key === 'F' ? 'bg-green-400' :
                          song.key === 'G' ? 'bg-blue-400' :
                          song.key === 'A' ? 'bg-indigo-400' :
                          song.key === 'B' ? 'bg-purple-400' :
                          'bg-gray-400'
                        }`}
                      >
                        {song.key}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <Rating
                    name={`difficulty-${song._id}`}
                    value={song.difficulty}
                    precision={1}
                    readOnly
                    size="small"
                  />
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-1">
                      <span>🎛️</span>
                      <span>Edit & manage</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🎪</span>
                      <span>Your collection</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-1">
                      <span>🎸</span>
                      <span>Practice ready</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>📖</span>
                      <span>Learn & play</span>
                    </div>
                  </>
                )}
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
            <div className="bg-stone-50 rounded-lg shadow-lg p-8 max-w-5xl w-full mx-4 relative">
              <button
                onClick={closeViewModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
                aria-label="Close"
              >
                ✖
              </button>

              <div className="max-h-[90vh] overflow-auto">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  🎵 {selectedSong.title}
                </h2>
                
                {/* Song Information Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">💿</span>
                        <div>
                          <p className="text-base font-bold text-gray-700 uppercase tracking-wide">Album</p>
                          <p className="text-xl font-semibold text-gray-800">{selectedSong.album}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">🎼</span>
                        <div>
                          <p className="text-base font-bold text-gray-700 uppercase tracking-wide">Key</p>
                          <p className="text-xl font-semibold text-gray-800">{selectedSong.key}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">🔥</span>
                        <div>
                          <p className="text-base font-bold text-gray-700 uppercase tracking-wide">Difficulty</p>
                          <Rating 
                            name="difficulty" 
                            id={`difficulty-${selectedSong._id}`} 
                            value={selectedSong.difficulty} 
                            precision={1} 
                            readOnly 
                            size="medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Spotify Player Section */}
                {selectedSong.spotify_song_id && (
                  <div className="bg-stone-100 rounded-xl p-6 mb-6 border border-stone-300 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl">🎧</span>
                      <h3 className="text-xl font-semibold text-gray-800">Listen on Spotify</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 items-start">
                      {/* Spotify Player */}
                      <div className="flex justify-center md:justify-start">
                        <iframe
                          src={`https://open.spotify.com/embed/track/${selectedSong.spotify_song_id}`}
                          width="100%"
                          height="152"
                          allow="encrypted-media"
                          className="rounded-lg max-w-sm"
                          title="Spotify iFrame"
                        ></iframe>
                      </div>
                      
                      {/* Song Details - Hidden on mobile */}
                      <div className="hidden md:block">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                          <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center">
                            <span className="text-lg mr-1">🎵</span>
                            Song Details
                          </h4>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600 font-medium">Title:</span>
                              <span className="text-xs text-gray-800 font-semibold text-right truncate ml-2">{selectedSong.title}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600 font-medium">Album:</span>
                              <span className="text-xs text-gray-800 font-semibold text-right truncate ml-2">{selectedSong.album}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600 font-medium">Key:</span>
                              <span className="text-xs text-gray-800 font-semibold text-right">{selectedSong.key}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600 font-medium">Difficulty:</span>
                              <Rating 
                                name="spotify-difficulty" 
                                value={selectedSong.difficulty} 
                                precision={1} 
                                readOnly 
                                size="small"
                                sx={{ fontSize: '0.875rem' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Tabs Section */}
                <div className="bg-stone-100 rounded-xl border border-stone-300 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎵</span>
                      <h3 className="text-xl font-semibold text-gray-800">Harmonica Tabs</h3>
                    </div>
                  </div>
                  <div className="p-0">
                    <TabsViewer tabs={selectedSong.tabs} title={selectedSong.title} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Modal */}
        {createModalIsOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="bg-stone-50 rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 border-t-4 border-emerald-500 max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-['Space_Grotesk']">
                🎤 Create New Song
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide">Song Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newSong.title}
                    onChange={handleChange}
                    placeholder="Enter song title..."
                    className="w-full border-2 border-gray-200 focus:border-emerald-500 p-3 rounded-xl transition-colors duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide">Album</label>
                  <input
                    type="text"
                    name="album"
                    value={newSong.album}
                    onChange={handleChange}
                    placeholder="Enter album name..."
                    className="w-full border-2 border-gray-200 focus:border-emerald-500 p-3 rounded-xl transition-colors duration-300"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide">Key</label>
                  <input
                    type="text"
                    name="key"
                    value={newSong.key}
                    onChange={handleChange}
                    placeholder="e.g., C, G, Am..."
                    className="w-full border-2 border-gray-200 focus:border-emerald-500 p-3 rounded-xl transition-colors duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide">Difficulty</label>
                  <div className="bg-gray-50 px-3 py-2 rounded-xl border-2 border-gray-200 flex items-center">
                    <Rating 
                      name="difficulty" 
                      value={newSong.difficulty} 
                      onChange={handleRatingChange}
                      precision={1}
                      size="medium"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide">Spotify Song ID</label>
                <input
                  type="text"
                  name="spotify_song_id"
                  value={newSong.spotify_song_id}
                  onChange={handleChange}
                  placeholder="Optional: Spotify track ID..."
                  className="w-full border-2 border-gray-200 focus:border-emerald-500 p-3 rounded-xl transition-colors duration-300"
                />
                <p className="text-xs text-gray-500 mt-1">💡 You can find this in the Spotify track URL</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide">
                  🎹 Harmonica Tabs
                </label>
                <textarea
                  name="tabs"
                  value={newSong.tabs}
                  onChange={handleChange}
                  placeholder="Enter harmonica tabs here...&#10;Example:&#10;(4)teue 4(5)5 5&#10;(4)teue 4(5)5 5"
                  className="w-full border-2 border-gray-200 focus:border-emerald-500 p-4 rounded-xl transition-colors duration-300 font-mono text-sm"
                  rows="8"
                  style={{ fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", monospace' }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Use (4) or -4 for aspirated notes, and 4 for blown notes
                </p>
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeCreateModal}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSong}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg font-semibold"
                >
                  Create Song ✨
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModalIsOpen && selectedSong && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="bg-stone-50 rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 border-t-4 border-blue-500 max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-['Space_Grotesk']">
                ✏️ Edit Song
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide">Song Title</label>
                  <input
                    type="text"
                    name="title"
                    value={selectedSong.title}
                    onChange={handleEditChange}
                    placeholder="Enter song title..."
                    className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-xl transition-colors duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide">Album</label>
                  <input
                    type="text"
                    name="album"
                    value={selectedSong.album}
                    onChange={handleEditChange}
                    placeholder="Enter album name..."
                    className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-xl transition-colors duration-300"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide">Key</label>
                  <input
                    type="text"
                    name="key"
                    value={selectedSong.key}
                    onChange={handleEditChange}
                    placeholder="e.g., C, G, Am..."
                    className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-xl transition-colors duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide">Difficulty</label>
                  <div className="bg-gray-50 px-3 py-2 rounded-xl border-2 border-gray-200 flex items-center">
                    <Rating 
                      name="difficulty" 
                      value={selectedSong.difficulty} 
                      onChange={handleEditRatingChange}
                      precision={1}
                      size="medium"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide">Spotify Song ID</label>
                <input
                  type="text"
                  name="spotify_song_id"
                  value={selectedSong.spotify_song_id}
                  onChange={handleEditChange}
                  placeholder="Optional: Spotify track ID..."
                  className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-xl transition-colors duration-300"
                />
                <p className="text-xs text-gray-500 mt-1">💡 You can find this in the Spotify track URL</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide">
                  🎹 Harmonica Tabs
                </label>
                <textarea
                  name="tabs"
                  value={selectedSong.tabs}
                  onChange={handleEditChange}
                  placeholder="Enter harmonica tabs here...&#10;Example:&#10;(4)teue 4(5)5 5&#10;(4)teue 4(5)5 5"
                  className="w-full border-2 border-gray-200 focus:border-blue-500 p-4 rounded-xl transition-colors duration-300 font-mono text-sm"
                  rows="8"
                  style={{ fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", monospace' }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Use (4) or -4 for aspirated notes, and 4 for blown notes
                </p>
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeEditModal}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSong}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg font-semibold"
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
            <div className="bg-stone-50 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-t-4 border-red-500">
              <div className="text-center">
                <div className="mb-4">
                  <span className="text-6xl">🗑️</span>
                </div>
                
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Delete Song
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this song? This action cannot be undone.
                </p>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={cancelDeleteSong}
                    className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteSong}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg font-semibold"
                  >
                    Delete Song
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

export default SongsList;