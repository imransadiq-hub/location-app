const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const verifyToken = require('../middleware/auth');
const multer = require('multer');
const JSZip = require('jszip');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Get all locations for authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      'SELECT * FROM locations WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Server error fetching locations' });
  }
});

// Add a new location
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { name, latitude, longitude } = req.body;

    // Validate input
    if (!name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Name, latitude, and longitude are required' });
    }

    // Validate coordinate ranges
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude format' });
    }

    if (lat < -90 || lat > 90) {
      return res.status(400).json({ error: 'Latitude must be between -90 and 90' });
    }

    if (lng < -180 || lng > 180) {
      return res.status(400).json({ error: 'Longitude must be between -180 and 180' });
    }
    // ✅ NEW: Check for duplicate location
    const duplicateCheck = await pool.query(
      'SELECT * FROM locations WHERE user_id = $1 AND name = $2 AND latitude = $3 AND longitude = $4',
      [userId, name, lat, lng]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: 'This location already exists in your list' 
      });
    }
    // Insert location
    const result = await pool.query(
      'INSERT INTO locations (user_id, name, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, lat, lng]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({ error: 'Server error adding location' });
  }
});

// Upload ZIP file with locations
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Load ZIP file
    const zip = await JSZip.loadAsync(req.file.buffer);

    // Get all files in the ZIP
    const files = Object.keys(zip.files);
    const txtFiles = files.filter(f => f.endsWith('.txt') && !f.startsWith('__MACOSX'));

    // Validate: must contain exactly one .txt file
    if (txtFiles.length === 0) {
      return res.status(400).json({ error: 'ZIP file must contain at least one .txt file' });
    }

    if (txtFiles.length > 1) {
      return res.status(400).json({ error: 'ZIP file must contain exactly one .txt file' });
    }

    // Extract and parse the text file
    const txtFile = txtFiles[0];
    const content = await zip.file(txtFile).async('string');
    
    // Split into lines and remove header
    const lines = content.split('\n').slice(1).filter(line => line.trim());

    if (lines.length === 0) {
      return res.status(400).json({ error: 'Text file is empty or has no data' });
    }

    // Parse each line
    const locations = [];
    const errors = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',').map(p => p.trim());

      if (parts.length !== 3) {
        errors.push(`Line ${i + 2}: Invalid format (expected 3 columns)`);
        continue;
      }

      const [name, latStr, lngStr] = parts;
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);

      if (isNaN(lat) || isNaN(lng)) {
        errors.push(`Line ${i + 2}: Invalid coordinates`);
        continue;
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        errors.push(`Line ${i + 2}: Coordinates out of range`);
        continue;
      }

      locations.push({ name, latitude: lat, longitude: lng });
    }

    if (locations.length === 0) {
      return res.status(400).json({ 
        error: 'No valid locations found in file',
        details: errors 
      });
    }

    // Insert all locations
    const insertPromises = locations.map(loc =>
      pool.query(
        'INSERT INTO locations (user_id, name, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, loc.name, loc.latitude, loc.longitude]
      )
    );

    const results = await Promise.all(insertPromises);
    const insertedLocations = results.map(r => r.rows[0]);

    res.status(201).json({
      message: 'Locations uploaded successfully',
      count: insertedLocations.length,
      locations: insertedLocations,
      warnings: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Server error processing file upload' });
  }
});

module.exports = router;