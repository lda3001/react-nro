import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col relative" style={{ backgroundImage: 'url("/images/icons/background.jpg")', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
        <div className="absolute inset-0 bg-black opacity-75" style={{ zIndex: 0 }}></div>
        <div className='relative z-10'>
          <Header />
          <main className="flex-grow">
            <HomePage />
          </main>
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
