const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Mock Admin Credentials (Replace with database validation later)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("password123", 10); // Pre-hashed password

// Secret key for JWT (store this in .env)
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // Replace with an environment variable

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (username !== ADMIN_USERNAME) {
        return res.status(401).json({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
});

// Middleware to Protect Admin Routes
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

module.exports = { router, authenticateJWT };
