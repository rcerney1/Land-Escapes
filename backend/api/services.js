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

//POST: Add a service
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

//Delete a service
// DELETE: Remove a service by ID and delete its image from S3
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Get the image URL from the database
        const service = await pool.query('SELECT image_url FROM services WHERE id = $1', [id]);

        if (service.rows.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const imageKey = service.rows[0].image_url.split('/').pop();

        // Delete image from S3
        s3.deleteObject(
            {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: `services/${imageKey}`,
            },
            (err) => {
                if (err) {
                    console.error('Error deleting file from S3:', err);
                }
            }
        );

        // Delete the service from the database
        await pool.query('DELETE FROM services WHERE id = $1', [id]);

        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT: Update a service by ID (Name, Description, and optionally Image)
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    let image_url = req.file ? req.file.location : null;

    try {
        // Fetch the existing service
        const existingService = await pool.query('SELECT * FROM services WHERE id = $1', [id]);

        if (existingService.rows.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // If a new image is uploaded, delete the old one from S3
        if (image_url) {
            const oldImageKey = existingService.rows[0].image_url.split('/').pop();
            s3.deleteObject(
                {
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: `services/${oldImageKey}`,
                },
                (err) => {
                    if (err) console.error('Error deleting old image from S3:', err);
                }
            );
        } else {
            // Keep the old image URL if no new image is provided
            image_url = existingService.rows[0].image_url;
        }

        // Update the service
        await pool.query(
            'UPDATE services SET name = $1, description = $2, image_url = $3 WHERE id = $4',
            [name, description, image_url, id]
        );

        res.json({ message: 'Service updated successfully' });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Error updating service' });
    }
});


module.exports = router;
