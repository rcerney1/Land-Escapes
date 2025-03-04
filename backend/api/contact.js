const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

// GET: Fetch Contact Info
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM contact_info LIMIT 1");
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No contact info found." });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching contact info:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.put("/", async (req, res) => {
    const { phone, email, address } = req.body;

    try {
        const result = await pool.query(`
            UPDATE contact_info
            SET phone = $1, email = $2, address = $3
            WHERE id = (SELECT id FROM contact_info LIMIT 1)
            RETURNING *;
        `, [phone, email, address]);

        if (result.rowCount === 0) {
            // If no row was updated, insert a new one
            await pool.query(`
                INSERT INTO contact_info (phone, email, address)
                VALUES ($1, $2, $3);
            `, [phone, email, address]);
        }

        res.json({ message: "Contact info updated successfully!" });
    } catch (error) {
        console.error("Error updating contact info:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


// DELETE: Remove a contact entry by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM contact_info WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Contact entry not found." });
        }

        res.json({ message: "Contact entry deleted successfully!" });
    } catch (error) {
        console.error("Error deleting contact entry:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});



module.exports = router;
