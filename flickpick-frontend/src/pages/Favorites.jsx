import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // State to manage the video modal pop-up
  const [activeTrailerUrl, setActiveTrailerUrl] = useState(null);

  const fetchFavorites = async () => {
    const token = localStorage.getItem('flickpick_token');
    if (!token) {
      setError('Please log in to view your favorites.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data);
    } catch (err) {
      setError('Could not retrieve your favorites list.');
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('flickpick_token');
    try {
      await axios.delete(`http://localhost:3000/api/favorites/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Movie removed successfully!');
      setFavorites(favorites.filter(movie => movie.id !== id));
    } catch (err) {
      setError('Failed to remove the movie.');
    }
  };
  

  // Helper function to open the official trailer directly in a new browser tab
  const openTrailer = (title) => {
    const searchQuery = encodeURIComponent(title + ' official trailer');
    const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
    
    // Opens a secure, clean target tab instantly
    window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
  };

  const closeTrailer = () => {
    setActiveTrailerUrl(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>My Saved Favorites Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {favorites.length === 0 ? (
        <p>No favorites saved yet. Go search for some shows!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {favorites.map((movie) => (
            <div key={movie.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>{movie.title}</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>Year: {movie.year}</p>
                <p style={{ color: '#ff9800', fontWeight: 'bold' }}>⭐ {movie.rating || 'N/A'}</p>
                <p style={{ fontSize: '13px', color: '#444' }}>{movie.summary}</p>
              </div>
              
              <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  onClick={() => openTrailer(movie.title)}
                  style={{ width: '100%', padding: '8px 0', backgroundColor: '#28A745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  🎬 Watch Trailer
                </button>
                <button 
                  onClick={() => handleDelete(movie.id)}
                  style={{ width: '100%', padding: '8px 0', backgroundColor: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  🗑️ Delete Item
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIDEO PLAYER POPUP MODAL OVERLAY */}
      {activeTrailerUrl && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: '#111', padding: '10px', borderRadius: '8px', width: '90%', maxWidth: '640px', position: 'relative' }}>
            <button 
              onClick={closeTrailer}
              style={{ position: 'absolute', top: '-35px', right: '0px', background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}
            >
              ✕ Close
            </button>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                src={activeTrailerUrl}
                title="Trailer Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '4px' }}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Favorites;