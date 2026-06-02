const sqlite3 = require('sqlite3').verbose();

// 1. Connect to the database (This will automatically create a file called movies.db if it doesn't exist)
const db = new sqlite3.Database('./movies.db', (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the SQLite database successfully.");
    }
});

// 2. Create the 'favorites' table using raw SQL
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            year TEXT,
            summary TEXT,
            rating REAL
        )
    `, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        } else {
            console.log(" 'favorites' table is ready!");
        }
    });
});

// 3. Close the connection after setup
db.close();
