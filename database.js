
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = process.env.NODE_ENV === 'production'
    ? '/var/data'
    : __dirname;

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'meals.db');

const db = new sqlite3.Database(dbPath, (err) => {
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
