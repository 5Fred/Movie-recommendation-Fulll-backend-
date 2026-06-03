import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [trending, setTrending] = useState([]);
  const [classics, setClassics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        // Fetching a batch list of general shows to populate our grids dynamically
        const response = await axios.get('https://api.tvmaze.com/shows?page=0');
        const allShows = response.data;

        // Section 1: Slice out some high-rating shows for the trending row
        const trendingList = allShows.slice(15, 23);
        
        // Section 2: Sort and slice out classic highly-rated gems for the second row
        const classicsList = allShows.filter(show => show.rating?.average >= 8.2).slice(0, 8);

        setTrending(trendingList);
        setClassics(classicsList);
      } catch (err) {
        setError('Failed to load streaming recommendations.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeContent();
  }, []);

  const openTrailer = (title) => {
    const searchQuery = encodeURIComponent(title + ' official trailer');
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) return <div style={{ color: '#b3b3b3', textAlign: 'center', marginTop: '100px', fontSize: '18px' }}>Loading FlickPick Arena...</div>;

  // Pick the very first trending show as our cinematic top header banner image
  const heroShow = trending[0] || { name: "Featured Spotlight", summary: "Loading epic content..." };

  return (
    <div style={{ color: '#e2e8f0', paddingBottom: '60px' }}>
      
      {/* 1. IMAX HERO BANNER FEATURE */}
      {trending.length > 0 && (
        <div style={{
          position: 'relative',
          height: '420px',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '40px',
          backgroundImage: `linear-gradient(to right, #0d0d11 40%, rgba(13,13,17,0.3) 100%), url(${heroShow.image?.original})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 50px'
        }}>
          <div style={{ maxWidth: '500px', zIndex: 2 }}>
            <span style={{ backgroundColor: '#e50914', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>SPOTLIGHT FEATURE</span>
            <h2 style={{ fontSize: '42px', margin: '15px 0 10px 0', fontWeight: '800', lineHeight: '1.1' }}>{heroShow.name}</h2>
            <p style={{ color: '#ff9800', fontWeight: 'bold', marginBottom: '15px' }}>⭐ {heroShow.rating?.average} / 10</p>
            <p 
              style={{ fontSize: '15px', color: '#b3b3b3', lineHeight: '1.5', marginBottom: '25px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              dangerouslySetInnerHTML={{ __html: heroShow.summary }}
            ></p>
            <button 
              onClick={() => openTrailer(heroShow.name)}
              style={{ padding: '12px 28px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 4px 15px rgba(229,9,20,0.4)' }}
            >
              ▶ Play Official Trailer
            </button>
          </div>
        </div>
      )}

      {error && <p style={{ color: '#ff4d4d' }}>{error}</p>}

      {/* 2. TRENDING NOW SECTION ROW */}
      <h3 style={{ fontSize: '22px', marginBottom: '20px', fontWeight: '700', borderLeft: '4px solid #e50914', paddingLeft: '10px' }}>What's Trending Right Now</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '20px', marginBottom: '50px' }}>
        {trending.map((show) => (
          <div key={show.id} onClick={() => openTrailer(show.name)} style={{ cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', marginBottom: '8px' }}>
              <img src={show.image?.medium} alt={show.name} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.06)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} />
            </div>
            <h4 style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff', margin: '5px 0 2px 0' }}>{show.name}</h4>
            <span style={{ fontSize: '12px', color: '#ff9800' }}>⭐ {show.rating?.average || 'N/A'}</span>
          </div>
        ))}
      </div>

      {/* 3. FAN FAVORITES / TOP RATED ROW */}
      <h3 style={{ fontSize: '22px', marginBottom: '20px', fontWeight: '700', borderLeft: '4px solid #ff9800', paddingLeft: '10px' }}>Top Rated Classics (Fan Favorites)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '20px' }}>
        {classics.map((show) => (
          <div key={show.id} onClick={() => openTrailer(show.name)} style={{ cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', marginBottom: '8px' }}>
              <img src={show.image?.medium} alt={show.name} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.06)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} />
            </div>
            <h4 style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff', margin: '5px 0 2px 0' }}>{show.name}</h4>
            <span style={{ fontSize: '12px', color: '#ff9800' }}>⭐ {show.rating?.average}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;