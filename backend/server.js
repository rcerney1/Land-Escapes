const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const apiRoutes = require('./api');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', apiRoutes);

// Log a message when API routes are registered
console.log("✅ API routes loaded in server.js");

// Log when a request is made
app.use((req, res, next) => {
    console.log(`➡️  Request received: ${req.method} ${req.url}`);
    next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
