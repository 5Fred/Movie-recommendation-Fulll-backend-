import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  // State variables to capture user input and toggle form modes
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // The backend base URL where your Node.js server is running
  const API_BASE_URL = 'http://localhost:3000/api';

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser from reloading the page
    setMessage('');
    setError('');

    // Determine which endpoint to hit based on the form mode
    const endpoint = isRegistering ? `${API_BASE_URL}/register` : `${API_BASE_URL}/login`;

    try {
      const response = await axios.post(endpoint, { username, password });

      if (isRegistering) {
        setMessage('Registration successful! You can now log in.');
        setIsRegistering(false); // Automatically flip back to login mode
        setPassword('');         // Clear the password input field
      } else {
        // Login path: extraction and storage of the issued JWT token
        const token = response.data.token;
        localStorage.setItem('flickpick_token', token);
        setMessage('Login successful! Welcome back.');
        
        // Quick console check to verify storage allocation
        console.log("Token stored securely:", localStorage.getItem('flickpick_token'));
      }
    } catch (err) {
      // Pulls the exact error message sent from your backend responses
      setError(err.response?.data?.error || 'An unexpected error occurred.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{isRegistering ? 'Create an Account' : 'Sign In to FlickPick'}</h2>
      
      {/* Dynamic Status Notifications */}
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
        <button 
          onClick={() => { setIsRegistering(!isRegistering); setError(''); setMessage(''); }}
          style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
        >
          {isRegistering ? 'Login here' : 'Register here'}
        </button>
      </p>
    </div>
  );
}

export default Login;