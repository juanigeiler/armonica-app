import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SongsList = () => {
  const { id } = useParams();
  const [songs, setSongs] = useState([]);
  const [artistName, setArtistName] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [newSong, setNewSong] = useState({ title: "", album: "", key: "", tabs: "" });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/artists/${id}/songs`)
      .then((response) => {
        setSongs(response.data);
        if (response.data.length > 0) {
          setArtistName(response.data[0].artistName); //revisar aca
        }
      })
      .catch((error) => console.error(error));
  }, [id]);

  const openModal = (song) => {
    setSelectedSong(song);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedSong(null);
    setModalIsOpen(false);
  };

  const openCreateModal = () => {
    setCreateModalIsOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalIsOpen(false);
    setNewSong({ title: "", album: "", key: "", tabs: "" });
  };

  const handleCreateSong = () => {
    const songData = { ...newSong, artistId: id };

    axios
    .post(`${process.env.REACT_APP_API_URL}/songs`, songData)
    .then((response) => {
      setSongs((prevSongs) => [...prevSongs, response.data]);
      closeCreateModal();
    })
    .catch((error) => console.error("Error creating song:", error));
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSong((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{artistName}</h1>
      <button
        onClick={openCreateModal}
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mb-4"
      >Add New Song
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song) => (
          <div
            key={song._id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">{song.title}</h2>
            <button
              onClick={() => openModal(song)}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              View Tabs
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalIsOpen && selectedSong && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start pt-20"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full mx-4 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              ✖
            </button>

            <div className="max-h-[80vh] overflow-auto">
              <h2 className="text-2xl font-bold">{selectedSong.title}</h2>
              <p className="text-gray-700 mt-4">
                <strong>Album:</strong> {selectedSong.album}
              </p>
              <p className="text-gray-700 mt-4">
                <strong>Key:</strong> {selectedSong.key}
                <span className="mx-2"></span>
                <strong>Difficulty:</strong> {selectedSong.difficulty}
              </p>
              <h3 className="mt-6 font-semibold text-lg">Tabs:</h3>
              <pre className="bg-gray-100 p-6 rounded-md mt-4 text-lg overflow-auto">
                {selectedSong.tabs}
              </pre>
            </div>
          </div>
        </div>
      )}

      {createModalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
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
              type="number"
              name="difficulty"
              value={newSong.difficulty}
              onChange={handleChange}
              placeholder="Difficulty"
              className="w-full border rounded-md p-2 mb-4"
            />
            <input
              type="text"
              name="spotify_url"
              value={newSong.spotify_url}
              onChange={handleChange}
              placeholder="Spotify Url"
              className="w-full border rounded-md p-2 mb-4"
            />
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
    </div>
  );
};

export default SongsList;