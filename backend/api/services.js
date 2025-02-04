const express = require('express');
const router = express.Router();
const pool = require('../db/pool'); // Import PostgreSQL pool connection

const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/aws"); // AWS S3 configuration

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `services/${Date.now().toString()}-${file.originalname}`);
        },
    }),
});

// GET: Fetch all services
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM services');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Error fetching services' });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('File object from multer:', req.file);

        const { name, description } = req.body;

        if (!req.file || !req.file.location) {
            console.error('Image upload failed or file missing in request.');
            return res.status(500).json({ message: 'Error uploading image' });
        }

        const image_url = req.file.location; // Get S3 image URL

        await pool.query(
            'INSERT INTO services (name, description, image_url) VALUES ($1, $2, $3)',
            [name, description, image_url]
        );

        res.status(201).json({ message: 'Service added successfully' });
    } catch (error) {
        console.error('Error adding service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
