import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

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
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute inset-0">
        {/* Large floating circles */}
        <div className="absolute top-80 sm:top-20 left-4 sm:left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-4 sm:bottom-20 right-4 sm:right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 sm:top-1/2 left-1/3 w-64 h-64 bg-blue-300/15 rounded-full blur-2xl animate-pulse delay-2000"></div>
        
        {/* Musical notes floating */}
        <div className="absolute top-8 sm:top-32 right-8 sm:right-24 text-4xl sm:text-6xl text-white/20 animate-bounce delay-500">♪</div>
        <div className="absolute bottom-8 sm:bottom-32 left-8 sm:left-24 text-5xl sm:text-7xl text-white/15 animate-bounce delay-1500">♫</div>
        <div className="absolute bottom-40 sm:top-3/4 right-1/4 sm:right-1/3 text-3xl sm:text-5xl text-white/20 animate-bounce delay-1000">🎵</div>
        
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, #ffffff 1px, transparent 1px),
                           radial-gradient(circle at 80% 80%, #a855f7 1px, transparent 1px),
                           radial-gradient(circle at 40% 60%, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '80px 80px, 120px 120px, 60px 60px',
          backgroundPosition: '0 0, 40px 40px, 20px 20px'
        }}></div>
      </div>
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md relative z-10 border border-white/20">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎵</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 font-['Space_Grotesk']">
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