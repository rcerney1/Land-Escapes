const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db/pool');  // Import PostgreSQL connection

const router = express.Router();

console.log("✅ Auth routes loaded in auth.js"); // Debugging


// Secret key for JWT (store this in .env)
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Admin Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists in the database
        const result = await pool.query("SELECT * FROM admins WHERE username = $1", [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const admin = result.rows[0];

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        console.log("Entered Password:", password);
        console.log("Hashed Password from DB:", admin.password);
        console.log("Password Match:", isPasswordValid);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ username: admin.username }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ token });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});




// Middleware to Protect Admin Routes (for future use)
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }
        req.user = user;
        next();
    });
};

//change password route
router.post('/change-password', authenticateJWT, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const username = req.user.username; // Extract username from JWT

    try {
        // Fetch the admin's current password from the database
        const result = await pool.query("SELECT password FROM admins WHERE username = $1", [username]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const admin = result.rows[0];

        // Verify the current password
        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Incorrect current password" });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await pool.query("UPDATE admins SET password = $1 WHERE username = $2", [hashedNewPassword, username]);

        res.json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = { router, authenticateJWT };
