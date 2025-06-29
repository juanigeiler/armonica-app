import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">🎵</div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Harmonica Library
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
        >
          <span className="flex items-center space-x-2">
            <span>Logout</span>
            <span>🚪</span>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;