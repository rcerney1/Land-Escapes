const express = require('express');
const router = express.Router();
const pool = require('../db/pool'); // Import PostgreSQL pool connection

// GET: Fetch "About Us" content
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM about_us LIMIT 1');
        res.json(result.rows[0] || { message: 'No content found' });
    } catch (error) {
        console.error('Error fetching About Us:', error);
        res.status(500).json({ message: 'Error fetching About Us' });
    }
});

// PUT: Update "About Us" content
router.put('/', async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    try {
        const check = await pool.query('SELECT * FROM about_us LIMIT 1');
        if (check.rows.length === 0) {
            await pool.query('INSERT INTO about_us (content) VALUES ($1)', [content]);
        } else {
            await pool.query('UPDATE about_us SET content = $1 WHERE id = $2', [content, check.rows[0].id]);
        }
        res.json({ message: 'About Us content updated successfully' });
    } catch (error) {
        console.error('Error updating About Us:', error);
        res.status(500).json({ message: 'Error updating About Us' });
    }
});

module.exports = router;
