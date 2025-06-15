import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  Menu,
  X,
  PenSquare,
  User,
  Home,
  LogOut,
  BookOpen,
  LogIn,
  UserPlus,
  UserPen,
} from 'lucide-react';

import toast from 'react-hot-toast';
import Logo from '../../assets/image/Logo.png';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Logout failed');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="h-6 w-6" />
            <span className="ml-2 text-2xl font-serif font-bold text-gray-900">MindFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated && (
              <Link
                to="/"
                className={`inline-flex items-center h-8 px-3 rounded-md transition-colors ${
                  isActive('/') ? 'text-teal-600 font-semibold' : 'hover:text-green-600'
                }`}
              >
                <Home className="h-5 w-5 mr-1" />
                Home
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to="/feed"
                  className={`inline-flex items-center h-8 px-3 rounded-md transition-colors ${
                    isActive('/feed') ? 'text-teal-600 font-semibold' : 'hover:text-green-600'
                  }`}
                >
                  <BookOpen className="h-5 w-5 mr-1" />
                  Feed
                </Link>

                <Link
                  to="/create-post"
                  className={`inline-flex items-center h-8 px-3 rounded-md transition-colors ${
                    isActive('/create-post') ? 'text-teal-600 font-semibold' : 'hover:text-green-600'
                  }`}
                >
                  <PenSquare className="h-5 w-5 mr-1" />
                  Write
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-1">
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img
                          src={`http://localhost:5000${user.avatar}`}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                    <div className="py-2">
                      <Link
                        to={`/profile/${user?._id}`}
                        className={`flex items-center px-3 py-2 rounded-md w-full text-left ${
                          isActive(`/profile/${user?._id}`) ? ' text-teal-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <User className="h-5 w-5 mr-2 text-gray-600" />
                        Profile
                      </Link>
                      <Link
                        to="/edit-profile"
                        className={`flex items-center px-3 py-2 rounded-md w-full text-left ${
                          isActive('/edit-profile') ? ' text-teal-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <UserPen className="h-5 w-5 mr-2 text-gray-600" />
                        Edit Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut className="h-5 w-5 mr-2 text-gray-600" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`inline-flex items-center h-8 px-3 rounded-md transition-colors ${
                    isActive('/login') ? 'text-teal-600 font-semibold' : 'hover:text-green-600'
                  }`}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`inline-flex items-center h-9 px-3 rounded-md transition-colors ${
                    isActive('/register') ? 'bg-teal-700 text-white' : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 animate-fade-in">
            <div className="flex flex-col space-y-3 py-3">
              {!isAuthenticated && (
                <Link
                  to="/"
                  className={`flex items-center px-3 py-2 rounded-md ${
                    isActive('/') ? ' text-teal-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="h-5 w-5 mr-1 " />
                  Home
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/feed"
                    className={`flex items-center px-3 py-2 rounded-md ${
                      isActive('/feed') ? ' text-teal-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookOpen className="h-5 w-5 mr-2 text-gray-600" />
                    Feed
                  </Link>

                  <Link
                    to="/create-post"
                    className={`flex items-center px-3 py-2 rounded-md ${
                      isActive('/create-post') ? ' text-teal-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <PenSquare className="h-5 w-5 mr-2" />
                    Write
                  </Link>

                  <Link
                    to={`/profile/${user?._id}`}
                    className={`flex items-center px-3 py-2 rounded-md ${
                      isActive(`/profile/${user?._id}`) ? ' text-teal-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2 text-gray-600" />
                    Profile
                  </Link>

                  <Link
                    to="/edit-profile"
                    className={`flex items-center px-3 py-2 rounded-md ${
                      isActive('/edit-profile') ? ' text-teal-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPen className="h-5 w-5 mr-2 text-gray-600" />
                    Edit Profile
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 w-full text-left"
                  >
                    <LogOut className="h-5 w-5 mr-2 text-gray-600" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`flex items-center px-3 py-2 rounded-md ${
                      isActive('/login') ? ' text-teal-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5 mr-1" />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className={`flex items-center px-3 py-2 rounded-md ${
                      isActive('/register') ? ' text-teal-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="h-5 w-5 mr-1" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
