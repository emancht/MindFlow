import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feeds from './pages/Feeds';
import Profile from './pages/Profile';
import PostDetailPage from './pages/PostDetailPage';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import EditProfile from './pages/EditProfile';
import PrivateRoute from './components/common/PrivateRoute';
import OTPVerification from './pages/OTPVerification';
import Loading from './components/common/Loading';

function App() {
  const { checkAuth, loading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
         <Route path="/" element={isAuthenticated ? <Navigate to="/feed" replace /> : <Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerification />} />

          <Route
            path="/feed"
            element={
              <PrivateRoute>
                <Feeds />
              </PrivateRoute>
            }
          />

          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/post/:id" element={<PostDetailPage />} />

          <Route
            path="/create-post"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit-post/:id"
            element={
              <PrivateRoute>
                <EditPost />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
