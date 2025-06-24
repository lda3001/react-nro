import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewsSection from './components/NewsSection';
import PostDetail from './components/PostDetail';
import AdminPostPage from './pages/AdminPostPage';
import Milestone from './pages/Milestone';
import AppChat from './components/Appchat';

function AppContent() {
  const getHours = new Date().getHours();
  // chia 24h thành 3 khoảng: 0-8, 8-16, 16-24 khi chưa login thì background theo giờ 
  const background = getHours >= 0 && getHours < 8 ? 'background0.jpg' : getHours >= 8 && getHours < 16 ? 'background1.jpg' : 'background2.jpg';
  const { user } = useAuth();
  const gender = user?.character?.infochar ? JSON.parse(user.character.infochar).Gender : '';
  const backgroundUser = gender === 0 || gender === 1 || gender === 2  ? `background${gender}.jpg` : background;

  

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative" style={{ 
        backgroundImage: `url("/images/icons/${backgroundUser}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-black opacity-75" style={{ zIndex: 0 }}></div>
        <div className='relative z-10'>
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/news/:id" element={<PostDetail />} />
              <Route path="/admin/post" element={<AdminPostPage />} />
              <Route path="/milestone" element={<Milestone />} />
            </Routes>
          </main>
          <AppChat />
          <Footer />
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
