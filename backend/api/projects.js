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


//create a project
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

// PUT: Update an existing project (Title, Description, and optionally Image)
router.put('/:id', upload.single('image'), async (req, res) => {
    console.log("test")
    const { id } = req.params;
    const { title, description } = req.body;
    let image_url = req.file ? req.file.location : null;

    try {
        // Fetch the existing project
        const existingProject = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);

        if (existingProject.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // If a new image is uploaded, delete the old one from S3
        if (image_url) {
            const oldImageKey = existingProject.rows[0].image_url.split('/').pop();
            s3.deleteObject(
                {
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: `projects/${oldImageKey}`,
                },
                (err) => {
                    if (err) console.error('Error deleting old image from S3:', err);
                }
            );
        } else {
            // Keep the old image URL if no new image is provided
            image_url = existingProject.rows[0].image_url;
        }

        // Update the project
        await pool.query(
            'UPDATE projects SET title = $1, description = $2, image_url = $3 WHERE id = $4',
            [title, description, image_url, id]
        );

        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project' });
    }
});


module.exports = router;
