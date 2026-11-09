require('dotenv').config({ path: '.env.local' });

const express = require('express');
const { sql, initializeDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('public'));

// GET all meals
app.get('/api/meals', async (req, res) => {
    try {
        const meals = await sql`
            SELECT * FROM meals ORDER BY meal_date
        `;
        res.json(meals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD meal
app.post('/api/meals', async (req, res) => {
    try {
        const { name, category, meal_date, description } = req.body;

        const result = await sql`
            INSERT INTO meals (name, category, meal_date, description)
            VALUES (${name}, ${category}, ${meal_date}, ${description || ''})
            RETURNING id
        `;

        res.json({ id: result[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE meal
app.put('/api/meals/:id', async (req, res) => {
    try {
        const { name, category, meal_date, description } = req.body;

        await sql`
            UPDATE meals
            SET name = ${name},
                category = ${category},
                meal_date = ${meal_date},
                description = ${description || ''}
            WHERE id = ${req.params.id}
        `;

        res.json({ message: 'Meal updated!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE meal
app.delete('/api/meals/:id', async (req, res) => {
    try {
        await sql`
            DELETE FROM meals WHERE id = ${req.params.id}
        `;

        res.json({ message: 'Meal deleted!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// START SERVER
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Meal Planner running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database initialization failed:', err);
        process.exit(1);
    });
