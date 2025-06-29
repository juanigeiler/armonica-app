import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(credentials);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos musicales de fondo */}
      <div className="absolute inset-0">
        <div className="text-9xl text-white/10 absolute top-20 left-10 transform rotate-12 animate-pulse">♪</div>
        <div className="text-7xl text-white/10 absolute top-40 right-20 transform -rotate-12 animate-pulse delay-1000">♫</div>
        <div className="text-6xl text-white/10 absolute bottom-32 left-1/4 transform rotate-45 animate-pulse delay-2000">♩</div>
        <div className="text-8xl text-white/10 absolute bottom-20 right-1/3 transform -rotate-45 animate-pulse delay-3000">♬</div>
        <div className="text-5xl text-white/10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-12 animate-pulse delay-4000">🎵</div>
      </div>

      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md relative z-10 border border-white/20">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎵</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg">Sign in to access your musical universe</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-lg"
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-lg"
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
            } text-white`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Signing in...
              </div>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>🎵</span>
                <span>Sign In</span>
                <span>→</span>
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-lg">
            🎶 Your music, your way 🎶
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;