import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import ArtistsList from "./components/ArtistsList";
import SongsList from "./components/SongsList";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ProtectedRoute>
          <div className="min-h-screen">
            <Header />
            <Routes>
              <Route path="/" element={<ArtistsList />} />
              <Route path="/artist/:id" element={<SongsList />} />
            </Routes>
          </div>
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
}

export default App;