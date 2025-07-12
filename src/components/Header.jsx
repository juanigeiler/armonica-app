import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowLogoutModal(true);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <>
      <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 shadow-lg relative z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-300"
            onClick={handleHomeClick}
            style={{ 
              userSelect: 'none', 
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <div className="text-3xl">🎵</div>
            <h1 className="text-2xl font-bold text-white tracking-wide select-none">
              Harmonica Library
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer z-50 relative font-semibold"
                style={{ 
                  pointerEvents: 'auto',
                  userSelect: 'none',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <span className="flex items-center space-x-2 pointer-events-none">
                  <span>Logout</span>
                  <span>🚪</span>
                </span>
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-white/80 text-sm">
                  🔒 Login to create & edit
                </span>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer z-50 relative font-semibold"
                >
                  <span className="flex items-center space-x-2">
                    <span>Login</span>
                    <span>🔑</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Custom Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-t-4 border-red-500">
            <div className="text-center">
              <div className="mb-4">
                <span className="text-6xl">🚪</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Logout Confirmation
              </h2>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to log out? You'll need to sign in again to access your music library.
              </p>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={cancelLogout}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;