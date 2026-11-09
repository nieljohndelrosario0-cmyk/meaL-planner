const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./meals.db', (err) => {
    if (err) {
        console.error('Database error:', err.message);
    } else {
        console.log('Connected to Meal Planner Database!');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS meals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            meal_date TEXT NOT NULL,
            description TEXT
        )
    `);
});

module.exports = db;