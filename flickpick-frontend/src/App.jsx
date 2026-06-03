import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Home from './pages/Home'; // Import the new Home design
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const handleLogout = () => {
    localStorage.removeItem('flickpick_token');
    window.location.href = '/login';
  };

  const isLoggedIn = !!localStorage.getItem('flickpick_token');

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '20px 40px', 
          backgroundColor: '#13131a', 
          borderBottom: '1px solid #222230',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '24px', 
            fontWeight: '800', 
            letterSpacing: '1.5px',
            color: '#e50914', 
            textShadow: '0 0 12px rgba(229, 9, 20, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🎬 <span style={{ color: '#fff' }}>Flick</span>Pick
          </h1>
          
          <nav style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
            {/* Added Home Link */}
            <Link to="/" style={{ color: '#b3b3b3', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>Home</Link>
            <Link to="/search" style={{ color: '#b3b3b3', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>Search</Link>
            <Link to="/favorites" style={{ color: '#b3b3b3', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>My Favorites</Link>
            <Link to="/login" style={{ color: '#b3b3b3', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>Account</Link>
            
            {isLoggedIn && (
              <button 
                onClick={handleLogout} 
                style={{ 
                  padding: '8px 16px', 
                  background: 'transparent', 
                  color: '#ff4d4d', 
                  border: '1px solid #ff4d4d', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Logout
              </button>
            )}
          </nav>
        </header>

        <main style={{ padding: '40px 20px', flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* Base domain "/" now defaults to your therapeutic landing page */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;