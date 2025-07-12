import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import ArtistsList from "./components/ArtistsList";
import SongsList from "./components/SongsList";
import Login from "./components/Login";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={<ArtistsList />} />
            <Route path="/artist/:id" element={<SongsList />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;