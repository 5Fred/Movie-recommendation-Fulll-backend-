import React, { useState } from 'react';
import axios from 'axios';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await axios.get(`http://localhost:3000/api/search?q=${query}`);
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch search results from the server.');
    } finally {
      setLoading(false);
    }
  };

  // The function that sends data to your protected database route
  const handleAddToFavorites = async (show) => {
    setError('');
    setSuccessMessage('');

    // Pull the logged-in user's token out of local storage
    const token = localStorage.getItem('flickpick_token');

    if (!token) {
      setError('You must be logged in to save favorites!');
      return;
    }

    // Format the payload out of TVMaze data fields cleanly to match your backend schema
    const favoritePayload = {
      title: show.name,
      year: show.premiered ? show.premiered.split('-')[0] : 'N/A',
      summary: show.summary ? show.summary.replace(/<[^>]*>/g, '') : 'No summary provided.', // Strips HTML tags safely
      rating: show.rating?.average || 0
    };

    try {
      const response = await axios.post(
        'http://localhost:3000/api/favorites', 
        favoritePayload,
        {
          headers: {
            // Passing the authorization bearer token exactly like your curl commands did
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccessMessage(`Successfully added "${show.name}" to your favorites!`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save movie to favorites.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Search for Movies & TV Shows</h2>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text"
          placeholder="Type a movie or show title (e.g., From, Inception)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#28A745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Global Status Notifications */}
      {successMessage && <p style={{ color: 'green', fontWeight: 'bold' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {/* Results Display Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {results.map((item) => {
          const show = item.show;
          return (
            <div key={show.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {show.image?.medium ? (
                  <img src={show.image.medium} alt={show.name} style={{ width: '100%', borderRadius: '4px', marginBottom: '10px' }} />
                ) : (
                  <div style={{ height: '230px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', marginBottom: '10px', color: '#888' }}>No Image</div>
                )}
                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{show.name}</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>Year: {show.premiered ? show.premiered.split('-')[0] : 'N/A'}</p>
                <p 
                  style={{ fontSize: '13px', color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', marginBottom: '15px' }}
                  dangerouslySetInnerHTML={{ __html: show.summary || 'No summary available.' }}
                ></p>
              </div>

              <button 
                onClick={() => handleAddToFavorites(show)}
                style={{ 
                  width: '100%', 
                  padding: '8px 0', 
                  backgroundColor: '#007BFF', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginTop: 'auto'
                }}
              >
                ❤️ Save to Favorites
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Search;