
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
}

const sql = neon(process.env.DATABASE_URL);

async function initializeDatabase() {
    await sql`
        CREATE TABLE IF NOT EXISTS meals (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            meal_date DATE NOT NULL,
            description TEXT
        )
    `;

    console.log('Connected to Neon PostgreSQL!');
}

module.exports = { sql, initializeDatabase };
