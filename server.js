const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose(); 
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to the SQLite database file
const db = new sqlite3.Database('./movies.db', (err) => {
    if (err) console.error("Database connection error:", err.message);
    else console.log("Connected to movies.db file successfully.");
});

// 1. Home Route
app.get('/', (req, res) => {
    res.send('Welcome to the FlickPick Movie Recommendation API!');
});

// 2. Search Route (Fetches live data from external TVMaze API via Axios)
app.get('/api/search', async (req, res) => {
    try {
        const movieName = req.query.q; 
        if (!movieName) return res.status(400).json({ error: "Please provide a name" });
        const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${movieName}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. POST Route: Save a movie to the SQL database
app.post('/api/favorites', (req, res) => {
    const { title, year, summary, rating } = req.body;
    const sql = `INSERT INTO favorites (title, year, summary, rating) VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [title, year, summary, rating], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: "Movie added to favorites successfully!",
            id: this.lastID 
        });
    });
});

// 4. GET Route: Fetch all saved favorite movies from the SQL database
app.get('/api/favorites', (req, res) => {
    const sql = `SELECT * FROM favorites`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// ALWAYS AT THE ABSOLUTE BOTTOM: Start the server
app.listen(PORT, () => {
    console.log(`Server is running smoothly on http://localhost:${PORT}`);
});