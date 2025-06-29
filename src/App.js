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
        <Header />
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <ArtistsList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/artist/:id" 
            element={
              <ProtectedRoute>
                <SongsList />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;