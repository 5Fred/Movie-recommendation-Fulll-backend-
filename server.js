const jwt = require('jsonwebtoken');
const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose(); 
const app = express();
const PORT = 3000;
const bcrypt = require('bcrypt');

// Middleware to parse JSON bodies
app.use(express.json());

// AUTH MIDDLEWARE: Security guard to verify incoming JWT tokens
const authenticateToken = (req, res, next) => {
    // Look for the token in the 'Authorization' header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Splits "Bearer <TOKEN>"

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // Verify the token signature using our secret key
    jwt.verify(token, 'MY_SUPER_SECRET_KEY', (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token." });
        }
        
        // Save the verified user details inside the request object
        req.user = user;
        next(); // Let the request proceed to the actual route handler
    });
};

// Connect to the SQLite database file and auto-create tables if missing
const db = new sqlite3.Database('./movies.db', (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to movies.db file successfully.");
        
        // Force create the users table right here if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `, (tableErr) => {
            if (tableErr) console.error("Error auto-creating users table:", tableErr.message);
            else console.log("Database verification: 'users' table is fully ready.");
        });
    }
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

// 3. POST Route: Protected with authenticateToken
app.post('/api/favorites', authenticateToken, (req, res) => {
    const { title, year, summary, rating } = req.body;
    const sql = `INSERT INTO favorites (title, year, summary, rating) VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [title, year, summary, rating], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Movie added to favorites successfully!", id: this.lastID });
    });
});

// 4. GET Route: Protected with authenticateToken
app.get('/api/favorites', authenticateToken, (req, res) => {
    const sql = `SELECT * FROM favorites`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 5. REGISTRATION ROUTE: Create a new secure user account
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Hash the password cleanly (10 is the saltRounds / security complexity factor)
        const hashedPassword = await bcrypt.hash(password, 10);

        // SQL command to insert the user
        const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;

        db.run(sql, [username, hashedPassword], function(err) {
            if (err) {
                // Handle cases where the username already exists (UNIQUE constraint fails)
                if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(400).json({ error: "Username is already taken" });
                }
                return res.status(500).json({ error: err.message });
            }
            
            res.status(201).json({
                message: "User registered successfully!",
                userId: this.lastID
            });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. LOGIN ROUTE: Verify credentials and issue a secure JWT token
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const sql = `SELECT * FROM users WHERE username = ?`;

    db.get(sql, [username], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ error: "Invalid username or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid username or password" });

        // GENERATE JWT TOKEN: Payload contains user ID, using a secret signature key
        const token = jwt.sign(
            { id: user.id, username: user.username }, 
            'MY_SUPER_SECRET_KEY', 
            { expiresIn: '1h' } // Token expires automatically in 1 hour
        );

        // Send the token back to the client
        res.json({
            message: "Login successful!",
            token: token
        });
    });
});

// ALWAYS AT THE ABSOLUTE BOTTOM: Start the server
app.listen(PORT, () => {
    console.log(`Server is running smoothly on http://localhost:${PORT}`);
});