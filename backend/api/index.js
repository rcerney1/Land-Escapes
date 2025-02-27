const express = require('express');

// Import individual route files
const aboutRoutes = require('./about');
const projectRoutes = require('./projects');
const serviceRoutes = require('./services');
const messageRoutes = require('./messages');
const authRoutes = require('./auth').router;

const router = express.Router();

// Register routes
router.use('/about', aboutRoutes);
router.use('/projects', projectRoutes);
router.use('/services', serviceRoutes);
router.use('/messages', messageRoutes);
router.use('/auth', authRoutes);  // <-- Register authentication routes

module.exports = router;
