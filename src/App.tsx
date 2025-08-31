import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SchedulePage from './pages/Schedule';
import GalleryPage from './pages/Gallery';
import NewsPage from './pages/News';
import RegistrationPage from './pages/Registration';

// Admin imports
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import NewsManagement from './pages/admin/NewsManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import MessagesManagement from './pages/admin/MessagesManagement';
import RegistrationsManagement from './pages/admin/RegistrationsManagement';
import PricingManagement from './pages/admin/PricingManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/*" element={
            <div className="min-h-screen bg-white">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/schedule" element={<SchedulePage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/registration" element={<RegistrationPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="news" element={<NewsManagement />} />
            <Route path="gallery" element={<GalleryManagement />} />
            <Route path="messages" element={<MessagesManagement />} />
            <Route path="registrations" element={<RegistrationsManagement />} />
            <Route path="pricing" element={<PricingManagement />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;