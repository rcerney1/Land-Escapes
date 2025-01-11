const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/aws'); // AWS S3 configuration

// Configure Multer-S3 for image uploads
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `projects/${Date.now().toString()}-${file.originalname}`);
        },
    }),
});

// GET: Fetch all projects
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Error fetching projects' });
    }
});

// POST: Add a new project with an image upload
router.post('/', upload.single('image'), async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }

    const image_url = req.file.location;

    try {
        await pool.query(
            'INSERT INTO projects (title, description, image_url) VALUES ($1, $2, $3)',
            [title, description, image_url]
        );
        res.status(201).json({ message: 'Project added successfully' });
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ message: 'Error adding project' });
    }
});

// DELETE: Delete a project by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM projects WHERE id = $1', [id]);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project' });
    }
});

module.exports = router;
