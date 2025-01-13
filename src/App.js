import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ArtistsList from "./components/ArtistsList";
import SongsList from "./components/SongsList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ArtistsList />} />
        <Route path="/artist/:id" element={<SongsList />} />
      </Routes>
    </Router>
  );
}

export default App;