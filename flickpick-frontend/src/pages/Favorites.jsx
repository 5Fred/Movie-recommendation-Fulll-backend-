import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fetch favorites when the page loads
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

  // Handle removing a movie from favorites
  const handleDelete = async (id) => {
    const token = localStorage.getItem('flickpick_token');
    try {
      await axios.delete(`http://localhost:3000/api/favorites/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Movie removed successfully!');
      // Refresh the list immediately in the UI
      setFavorites(favorites.filter(movie => movie.id !== id));
    } catch (err) {
      setError('Failed to remove the movie.');
    }
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
              <button 
                onClick={() => handleDelete(movie.id)}
                style={{ width: '100%', padding: '8px 0', backgroundColor: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
              >
                🗑️ Delete Item
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;