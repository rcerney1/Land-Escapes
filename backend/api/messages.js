const express = require('express');
const router = express.Router();
const pool = require('../db/pool'); // Import PostgreSQL pool connection

// POST: Save a new contact form submission
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    try {
        await pool.query(
            'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)',
            [name, email, message]
        );
        res.status(201).json({ message: 'Message received successfully' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: 'Error saving message' });
    }
});


// GET: Retrieve all messages
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error retrieving messages' });
    }
});

// DELETE: Remove a message by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM messages WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ message: "Error deleting message" });
    }
});


// PATCH: Mark a message as read
router.patch('/:id/read', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "UPDATE messages SET is_read = TRUE WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.json({ message: "Message marked as read" });
    } catch (error) {
        console.error("Error marking message as read:", error);
        res.status(500).json({ message: "Error updating message" });
    }
});




module.exports = router;
