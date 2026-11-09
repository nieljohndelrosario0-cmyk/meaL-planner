
const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET all meals
app.get('/api/meals', (req, res) => {
    db.all('SELECT * FROM meals ORDER BY meal_date', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// ADD meal
app.post('/api/meals', (req, res) => {
    const { name, category, meal_date, description } = req.body;

    db.run(
        'INSERT INTO meals (name, category, meal_date, description) VALUES (?, ?, ?, ?)',
        [name, category, meal_date, description || ''],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        }
    );
});

// UPDATE meal
app.put('/api/meals/:id', (req, res) => {
    const { name, category, meal_date, description } = req.body;

    db.run(
        'UPDATE meals SET name=?, category=?, meal_date=?, description=? WHERE id=?',
        [name, category, meal_date, description || '', req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Meal updated!' });
        }
    );
});

// DELETE meal
app.delete('/api/meals/:id', (req, res) => {
    db.run(
        'DELETE FROM meals WHERE id=?',
        [req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Meal deleted!' });
        }
    );
});

// START SERVER
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Meal Planner running on port ${PORT}`);
});
