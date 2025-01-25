const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/aws');


// Configure Multer-S3 for image uploads
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET,
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
        res.status(500).json({ message: 'Error fetching projects ' });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('File object from multer:', req.file);

        const { title, description } = req.body;

        if (!req.file || !req.file.location) {
            console.error('Image upload failed or file missing in request.');
            return res.status(500).json({ message: 'Error uploading image' });
        }

        const image_url = req.file.location;

        const result = await pool.query(
            'INSERT INTO projects (title, description, image_url) VALUES ($1, $2, $3)',
            [title, description, image_url]
        );

        console.log('Database query result:', result);
        res.status(201).json({ message: 'Project added successfully' });
    } catch (error) {
        console.error('Error in POST /api/projects:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// DELETE: Delete a project by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const project = await pool.query('SELECT image_url FROM projects WHERE id = $1', [id]);

        if (project.rows.length > 0) {
            const imageKey = project.rows[0].image_url.split('/').pop();

            s3.deleteObject(
                {
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: `projects/${imageKey}`,
                },
                (err) => {
                    if (err) console.error('Error deleting file from S3:', err);
                }
            );
        }

        await pool.query('DELETE FROM projects WHERE id = $1', [id]);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project' });
    }
});

module.exports = router;
