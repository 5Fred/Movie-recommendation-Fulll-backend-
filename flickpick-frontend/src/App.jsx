import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Search from './pages/Search';
import Favorites from './pages/Favorites'; // 1. Import it here

function App() {
  const handleLogout = () => {
    localStorage.removeItem('flickpick_token');
    alert('Logged out successfully!');
    window.location.href = '/login';
  };

  return (
    <Router>
      <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#fff', color: '#333' }}>
        
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '15px 30px', 
          backgroundColor: '#1a1a1a', 
          color: 'white' 
        }}>
          <h1 style={{ margin: 0, fontSize: '22px', letterSpacing: '1px' }}>🎬 FlickPick</h1>
          <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Account</Link>
            <Link to="/search" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Search Shows</Link>
            <Link to="/favorites" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>My Favorites</Link>
            <button onClick={handleLogout} style={{ padding: '6px 12px', background: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Logout
            </button>
          </nav>
        </header>

        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} /> {/* 2. Render it here */}
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;